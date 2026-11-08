import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthStore } from '../../core/auth/auth.store';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  loginService = inject(AuthService);
  formUtils = FormUtils;
  showPassword: boolean = false;
  loading: boolean = false;

  readonly loginForm = this.formBuilder.nonNullable.group({
    address: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.loginForm.invalid || this.loading()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    const formData = { address: email, password };
    // const formData = this.loginForm.value;
    this.loading = true;
    this.loginService.login(formData).subscribe(
      (resp: any) => {
        console.log(resp);

        this.loginService.setToken(resp.token);
        this.router.navigate(['/catalogo']);
        // this.loginService.setCookie('user_name', resp.usuarioDB.nombre);
        // this.loginService.setCookie('user_profile', resp.usuarioDB.profile);

        this.loading = false;
      },
      (err) => {
        console.error(err);
        // this.alertService.topCenter('Usuario o password incorrectos', 'warning');
        this.loading = false;
      }
    );
    // 👇 Por ahora, simular login con cualquier credencial
    // this.router.navigate(['/catalogo']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToRecover() {
    this.router.navigate(['/recover']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

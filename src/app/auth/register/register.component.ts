import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../shared/utils/form-utils';
import { AlertService } from '../../shared/services/alert.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  alertService = inject(AlertService);
  formUtils = FormUtils;
  showPassword = false;
  registerService = inject(AuthService);
    loading: boolean = false;

  registerForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(FormUtils.strongPasswordPattern)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'confirmPassword')] }
  );

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}


import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormUtils } from '../../shared/utils/form-utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);

  formUtils = FormUtils;
  
  showPassword = false;

  token: string | null = null;

  resetForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.pattern(FormUtils.strongPasswordPattern)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'confirmPassword')],
    }
  );

  ngOnInit() {
    // Obtenemos el token de la URL
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onReset() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    // Simulación: redirigimos al login
    this.router.navigate(['/login'], {
      queryParams: { resetSuccess: true },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}

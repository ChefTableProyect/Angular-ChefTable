import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../shared/utils/form-utils';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  formUtils = FormUtils;
  showPassword = false;

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


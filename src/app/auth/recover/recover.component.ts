import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../shared/utils/form-utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recover',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css'
})
export class RecoverComponent {
  fb = inject(FormBuilder);
  router = inject(Router);

  formUtils = FormUtils;

  recoverForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
  });

  onRecover() {
    if (this.recoverForm.invalid) {
      this.recoverForm.markAllAsTouched();
      return;
    }

    // Redirigir a reset-password simulando el link con token
    this.router.navigate(['/reset-password'], { queryParams: { token: 'fakeToken123' } });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  
}

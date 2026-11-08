import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { StaffRole } from './auth.models';
import { AuthStore } from './auth.store';

export function roleGuard(...roles: StaffRole[]): CanMatchFn {
  return () => {
    const auth = inject(AuthStore);
    const router = inject(Router);
    return auth.authenticated() && auth.hasAnyRole(roles)
      ? true
      : router.createUrlTree(['/login']);
  };
}

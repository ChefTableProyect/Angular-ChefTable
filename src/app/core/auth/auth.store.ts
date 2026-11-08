import { Injectable, computed, signal } from '@angular/core';
import { StaffRole } from './auth.models';

const TOKEN_KEY = 'cheftable.staff.token';
const ROLE_KEY = 'cheftable.staff.role';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly tokenState = signal(sessionStorage.getItem(TOKEN_KEY));
  private readonly roleState = signal<StaffRole | null>(
    sessionStorage.getItem(ROLE_KEY) as StaffRole | null,
  );

  readonly token = this.tokenState.asReadonly();
  readonly role = this.roleState.asReadonly();
  readonly authenticated = computed(() => Boolean(this.tokenState()));

  setSession(token: string, role: StaffRole): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(ROLE_KEY, role);
    this.tokenState.set(token);
    this.roleState.set(role);
  }

  clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    this.tokenState.set(null);
    this.roleState.set(null);
  }

  hasAnyRole(roles: readonly StaffRole[]): boolean {
    const role = this.roleState();
    return role !== null && roles.includes(role);
  }
}

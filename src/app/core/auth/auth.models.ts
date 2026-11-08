export type StaffRole = 'ADMIN' | 'KITCHEN';

export interface LoginRequest {
  address: string;
  password: string;
}

export interface LoginResponse {
  address: string;
  token: string;
  role: StaffRole;
}

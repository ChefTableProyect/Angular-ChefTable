import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-menu.component').then((component) => component.AdminMenuComponent),
  },
];

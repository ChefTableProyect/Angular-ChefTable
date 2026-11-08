import { Routes } from '@angular/router';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/landing/landing.routes').then((routes) => routes.LANDING_ROUTES),
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./features/menu/menu.routes').then((routes) => routes.MENU_ROUTES),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/order.routes').then((routes) => routes.ORDER_ROUTES),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((component) => component.LoginComponent),
  },
  {
    path: 'kitchen',
    canMatch: [roleGuard('KITCHEN', 'ADMIN')],
    loadChildren: () =>
      import('./features/kitchen/kitchen.routes').then((routes) => routes.KITCHEN_ROUTES),
  },
  {
    path: 'admin',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((routes) => routes.ADMIN_ROUTES),
  },
  { path: 'catalogo', redirectTo: 'menu', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];

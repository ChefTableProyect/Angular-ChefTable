import { Routes } from '@angular/router';

export const ORDER_ROUTES: Routes = [
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout-page.component').then((component) => component.CheckoutPageComponent),
  },
  {
    path: 'track',
    loadComponent: () =>
      import('./tracking-page.component').then((component) => component.TrackingPageComponent),
  },
  {
    path: ':publicCode',
    loadComponent: () =>
      import('./tracking-page.component').then((component) => component.TrackingPageComponent),
  },
];

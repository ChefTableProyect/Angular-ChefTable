import { Routes } from '@angular/router';

export const MENU_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./menu-page.component').then((component) => component.MenuPageComponent),
  },
];

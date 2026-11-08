import { Routes } from '@angular/router';

export const KITCHEN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./kitchen-board.component').then((component) => component.KitchenBoardComponent),
  },
];

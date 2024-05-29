import { Routes } from '@angular/router';
import { LoginGuard } from './services/guards/login.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
  },
  {
    loadComponent: () => import('./layout/layout.component'),
    path: '',
    children: [
      {
        path: 'home',
        title: 'V-Max',
        loadComponent: () => import('./pages/home/home.component'),
      },
      {
        path: 'orders-list',
        canActivate: [LoginGuard],
        title: 'Lista de Ordenes',
        loadComponent: () =>
          import('./pages/orders-list/orders-list.component'),
      },
      {
        path: 'retreats-list',
        canActivate: [LoginGuard],
        title: 'Lista de Retiros',
        loadComponent: () =>
          import('./pages/retreats-list/retreats-list.component'),
      },
      {
        path: 'incomes-list',
        canActivate: [LoginGuard],
        title: 'Lista de Retiros',
        loadComponent: () =>
          import('./pages/incomes-list/incomes-list.component'),
      },
      {
        path: 'support',
        canActivate: [LoginGuard],
        title: 'Soporte',
        loadComponent: () => import('./pages/support/support.component'),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

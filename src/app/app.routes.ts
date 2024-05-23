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
        path: 'support',
        canActivate: [LoginGuard],
        title: 'Soporte',
        loadComponent: () => import('./pages/support/support.component'),
      },
      {
        path: 'tasks',
        canActivate: [LoginGuard],
        title: 'Tareas V-Max',
        loadComponent: () => import('./pages/tasks/tasks.component'),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

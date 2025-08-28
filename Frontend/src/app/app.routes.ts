import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'appointments',
    loadComponent: () => import('./components/appointments/appointments.component').then(m => m.AppointmentsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'annonces',
    loadComponent: () => import('./components/announcement/announcement-list.component').then(m => m.AnnouncementListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'annonces/create',
    loadComponent: () => import('./components/announcement/announcement-form.component').then(m => m.AnnouncementFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'annonces/:id/edit',
    loadComponent: () => import('./components/announcement/announcement-form.component').then(m => m.AnnouncementFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'comments',
    loadComponent: () => import('./components/comments/comments.component').then(m => m.CommentsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'appointments',
    pathMatch: 'full'
  }
];



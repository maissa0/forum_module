import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'appointments', 
    loadComponent: () => import('./components/appointments/appointments.component').then(m => m.AppointmentsComponent) 
  },
  { 
    path: 'comments', 
    loadComponent: () => import('./components/comments/comments.component').then(m => m.CommentsComponent) 
  },
  { 
    path: 'chat', 
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent) 
  },
  {
    path: 'annonces',
    loadComponent: () => import('./components/announcement/announcement-list.component')
      .then(m => m.AnnouncementListComponent)
  },
  {
    path: 'annonces/create',
    loadComponent: () => import('./components/announcement/announcement-form.component')
      .then(m => m.AnnouncementFormComponent)
  },
  {
    path: 'annonces/:id/edit',
    loadComponent: () => import('./components/announcement/announcement-form.component')
      .then(m => m.AnnouncementFormComponent)
  },
  { 
    path: '', 
    redirectTo: '/appointments', 
    pathMatch: 'full' 
  }
];

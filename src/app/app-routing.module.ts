import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'appointments', loadComponent: () => import('./components/appointments/appointments.component').then(m => m.AppointmentsComponent) },
  { path: 'comments', loadComponent: () => import('./components/comments/comments.component').then(m => m.CommentsComponent) },
  { path: 'chat', loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent) },
  { path: '', redirectTo: '/appointments', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

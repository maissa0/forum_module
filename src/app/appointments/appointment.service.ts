import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id: string;
  date: Date;
  userId: string;
  responsableId: string;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = '/api/appointments';
  constructor(private http: HttpClient) {}
  getAppointments(userRole: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}?role=${userRole}`);
  }
  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }
  updateAppointment(id: string, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment);
  }
  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../models/announcement';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'http://localhost:8081/api/annonces';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(): Observable<Announcement[]> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<Announcement[]>(this.apiUrl, { headers });
  }

  getById(id: string): Observable<Announcement> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<Announcement>(`${this.apiUrl}/${id}`, { headers });
  }

  create(announcement: Omit<Announcement, 'id'>, image?: File): Observable<Announcement> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    const formData = new FormData();
    formData.append('title', announcement.title);
    formData.append('description', announcement.description);
    formData.append('date', announcement.date.toString());
    formData.append('category', announcement.category);
    if (image) {
        formData.append('image', image);
    }
    return this.http.post<Announcement>(this.apiUrl, formData, { headers });
  }

  update(id: string, announcement: Announcement): Observable<Announcement> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.put<Announcement>(`${this.apiUrl}/${id}`, announcement, { headers });
  }

  delete(id: string): Observable<void> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  search(criteria: string): Observable<Announcement[]> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<Announcement[]>(`${this.apiUrl}/search`, {
      headers,
      params: { q: criteria }
    });
  }

  rateAnnouncement(id: string, rating: number): Observable<{ average: number }> {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    return this.http.post<{ average: number }>(`${this.apiUrl}/${id}/rate`, { rating }, { headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id: string;
  text: string;
  userId: string;
  likes: number;
  dislikes: number;
  emojis: string[];
  createdDate: string;
}

@Injectable({ providedIn: 'root' })
export class CommentService {
  private apiUrl = 'http://localhost:8081/api/comments';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment, { headers: this.getHeaders() });
  }

  updateComment(id: string, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}`, comment, { headers: this.getHeaders() });
  }

  likeComment(id: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}/like`, {}, { headers: this.getHeaders() });
  }

  dislikeComment(id: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}/dislike`, {}, { headers: this.getHeaders() });
  }

  addEmoji(id: string, emoji: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}/emoji`, emoji, { headers: this.getHeaders() });
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

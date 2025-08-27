import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id: string;
  text: string;
  userId: string;
  moduleId: string;
  likes: number;
  dislikes: number;
  emojis: string[];
}

@Injectable({ providedIn: 'root' })
export class CommentService {
  private apiUrl = '/api/comments';
  constructor(private http: HttpClient) {}
  getComments(moduleId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?moduleId=${moduleId}`);
  }
  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }
  updateComment(id: string, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}`, comment);
  }
  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

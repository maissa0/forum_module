import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  token: string;
}

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password });
  }

  register(user: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        return decoded.role || 'USER';
      } catch (error) {
        console.error('Error decoding token:', error);
        return 'USER';
      }
    }
    return 'USER';
  }

  getUsername(): string {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        return decoded.sub || 'anonymous';
      } catch (error) {
        console.error('Error decoding token:', error);
        return 'anonymous';
      }
    }
    return 'anonymous';
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

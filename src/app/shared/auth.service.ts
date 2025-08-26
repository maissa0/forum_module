import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn(): boolean {
    // TODO: Implement JWT check
    return !!localStorage.getItem('token');
  }
  getUserRole(): string {
    // TODO: Implement role retrieval
    return localStorage.getItem('role') || 'enseignant';
  }
}

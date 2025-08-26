import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;
  constructor() {
    this.socket = io('http://backend-url');
  }
  sendMessage(message: string, toUserId: string) {
    this.socket.emit('message', { msg: message, to: toUserId });
  }
  getMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message', (data) => observer.next(data));
    });
  }
}

import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

export interface ChatMessage {
  id: string;
  text: string;
  time: Date;
  senderId: string;
  senderName: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastMessage?: string;
  unreadCount?: number;
}

type WritableSignal<T> = {
  (): T;
  set: (value: T) => void;
  update: (fn: (value: T) => T) => void;
  mutate: (fn: (value: T) => void) => void;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    PickerComponent
  ],
  template: `
    <div class="chat-container">
      <mat-drawer-container class="chat-drawer-container">
        <!-- Users Sidebar -->
        <mat-drawer mode="side" opened class="users-sidebar">
          <div class="search-container">
            <mat-form-field appearance="outline">
              <mat-label>Search Users</mat-label>
              <input matInput 
                     [ngModel]="searchText()" 
                     (ngModelChange)="onSearchChange($event)"
                     name="search" 
                     aria-label="Search users">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <mat-nav-list>
            <a mat-list-item *ngFor="let user of filteredUsers()" 
               [class.selected-user]="selectedUser()?.id === user.id"
               (click)="selectUser(user)"
               role="button"
               [attr.aria-label]="'Select chat with ' + user.name">
              <div class="user-list-item">
                <div class="avatar-container">
                  <img [src]="user.avatar" [alt]="user.name + ' avatar'" class="user-avatar">
                  <span class="status-indicator" [class]="user.status"></span>
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="last-message">{{ user.lastMessage }}</span>
                </div>
                <mat-badge *ngIf="user.unreadCount" 
                           [matBadge]="user.unreadCount" 
                           matBadgeColor="accent"
                           class="unread-badge">
                </mat-badge>
              </div>
            </a>
          </mat-nav-list>
        </mat-drawer>

        <!-- Chat Area -->
        <mat-drawer-content class="chat-content">
          <ng-container *ngIf="selectedUser(); else noUserSelected">
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="user-info">
                <img [src]="selectedUser()?.avatar" [alt]="selectedUser()?.name + ' avatar'" class="user-avatar">
                <div class="user-details">
                  <h3>{{ selectedUser()?.name }}</h3>
                  <span class="status-text">{{ selectedUser()?.status }}</span>
                </div>
              </div>
              <div class="header-actions">
                <button mat-icon-button matTooltip="Video Call" aria-label="Start video call">
                  <mat-icon>videocam</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Voice Call" aria-label="Start voice call">
                  <mat-icon>call</mat-icon>
                </button>
                <button mat-icon-button matTooltip="More options" aria-label="More options">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
            </div>

            <!-- Messages Area -->
            <div class="messages-area" #scrollContainer>
              <div *ngFor="let msg of messages()" 
                   [class.message-sent]="msg.senderId === currentUserId"
                   [class.message-received]="msg.senderId !== currentUserId"
                   class="message-wrapper">
                <div class="message">
                  <p>{{ msg.text }}</p>
                  <span class="message-time">{{ msg.time | date:'HH:mm' }}</span>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="message-input-container">
              <mat-form-field appearance="outline" class="message-input">
                <textarea matInput 
                       [ngModel]="message()" 
                       (ngModelChange)="message.set($event)"
                       placeholder="Type a message..."
                       (keypress.enter)="$event.preventDefault(); sendMessage()"
                       name="messageInput"
                       aria-label="Type a message"></textarea>
                <mat-icon matSuffix 
                         [matTooltip]="'Add emoji'"
                         role="button"
                         (click)="toggleEmojiPicker($event)">sentiment_satisfied_alt</mat-icon>
                <emoji-mart *ngIf="showEmojiPicker"
                          class="emoji-picker"
                          [darkMode]="true"
                          [showPreview]="false"
                          (emojiClick)="addEmoji($event)"
                          title="Pick your emoji"></emoji-mart>
              </mat-form-field>
              <button mat-fab 
                      color="primary" 
                      class="send-button" 
                      [disabled]="!message().trim()"
                      (click)="sendMessage()"
                      aria-label="Send message">
                <mat-icon>send</mat-icon>
              </button>
            </div>
          </ng-container>
          
          <ng-template #noUserSelected>
            <div class="no-chat-selected">
              <mat-icon class="large-icon">chat</mat-icon>
              <h2>Select a chat to start messaging</h2>
            </div>
          </ng-template>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: calc(100vh - 64px);
    }

    .chat-container {
      height: 100%;
      background-color: #f5f5f5;
    }

    .chat-drawer-container {
      height: 100%;
    }

    .users-sidebar {
      width: 320px;
      background-color: #ffffff;
      border-right: 1px solid #e0e0e0;
    }

    .search-container {
      padding: 16px;
      background-color: #fafafa;
      border-bottom: 1px solid #e0e0e0;
    }

    .user-list-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 12px;
      width: 100%;
    }

    .avatar-container {
      position: relative;
      width: 48px;
      height: 48px;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .status-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #2d2d2d;

      &.online {
        background-color: #4caf50;
      }

      &.away {
        background-color: #ffc107;
      }

      &.offline {
        background-color: #9e9e9e;
      }
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      display: block;
      color: #333333;
      font-weight: 500;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .last-message {
      display: block;
      color: #757575;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .unread-badge {
      margin-left: 8px;
    }

    .chat-content {
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background-color: #ffffff;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .user-details {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
    }

    .status-text {
      color: #757575;
      font-size: 0.875rem;
      text-transform: capitalize;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      color: #196E66;
    }

    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .message-wrapper {
      display: flex;
      flex-direction: column;
      max-width: 70%;
      gap: 2px;
    }

    .message-sent {
      align-self: flex-end;
    }

    .message-received {
      align-self: flex-start;
    }

    .message {
      padding: 12px 16px;
      border-radius: 16px;
      position: relative;
      color: #333333;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .message-sent .message {
      background-color: #196E66;
      color: #ffffff;
    }

    .message-received .message {
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
    }

    .message p {
      margin: 0;
      padding-right: 48px;
    }

    .message-time {
      position: absolute;
      right: 12px;
      bottom: 8px;
      font-size: 0.75rem;
      color: rgba(0, 0, 0, 0.5);
    }

    .message-sent .message-time {
      color: rgba(255, 255, 255, 0.8);
    }

    .message-input-container {
      padding: 16px;
      background-color: #ffffff;
      display: flex;
      gap: 16px;
      align-items: center;
      border-top: 1px solid #e0e0e0;
    }

    .message-input {
      flex: 1;
      margin-bottom: 0;
    }

    .send-button {
      background-color: #196E66;
    }

    .send-button:disabled {
      background-color: #e0e0e0;
      color: #999999;
    }

    .no-chat-selected {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #757575;
    }

    .large-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
      color: #196E66;
    }

    .selected-user {
      background-color: #f5f5f5;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #f5f5f5;
    }

    ::-webkit-scrollbar-thumb {
      background: #e0e0e0;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #d0d0d0;
    }

    .emoji-picker {
      position: absolute;
      bottom: 70px;
      right: 16px;
      z-index: 100;
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewInit {
  message = signal('');
  messages = signal<ChatMessage[]>([]);
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  filteredUsers = signal<User[]>([]);
  searchText = signal('');
  currentUserId = 'current-user';
  private shouldScroll = false;
  showEmojiPicker = false;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {
    // Initialize filtered users based on users signal
    this.users.update((users) => {
      this.filteredUsers.set(users);
      return users;
    });
  }

  ngOnInit() {
    this.users.set([
      {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        status: 'online',
        lastMessage: 'Hey, how are you?',
        unreadCount: 2
      },
      {
        id: 'user2',
        name: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        status: 'away',
        lastMessage: 'See you tomorrow!',
        unreadCount: 0
      },
      {
        id: 'user3',
        name: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=3',
        status: 'offline',
        lastMessage: 'Thanks for your help',
        unreadCount: 0
      }
    ]);

    // Set initial filtered users
    this.filteredUsers.set(this.users());
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  onSearchChange(searchValue: string) {
    this.searchText.set(searchValue);
    const search = searchValue.toLowerCase();
    this.filteredUsers.set(
      this.users().filter(user => 
        search ? user.name.toLowerCase().includes(search) : true
      )
    );
  }

  selectUser(user: User) {
    this.selectedUser.set(user);
    this.users.update(users => 
      users.map(u => u.id === user.id ? { ...u, unreadCount: 0 } : u)
    );
    this.loadChatHistory(user.id);
    this.shouldScroll = true;
  }

  loadChatHistory(userId: string) {
    const mockHistory: ChatMessage[] = [
      {
        id: '1',
        senderId: userId,
        senderName: this.users().find(u => u.id === userId)?.name || '',
        text: 'Hey there!',
        time: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        senderId: this.currentUserId,
        senderName: 'You',
        text: 'Hi! How are you?',
        time: new Date(Date.now() - 3300000)
      }
    ];
    this.messages.set(mockHistory);
    this.shouldScroll = true;
  }

  sendMessage() {
    if (!this.message().trim() || !this.selectedUser()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: this.currentUserId,
      senderName: 'You',
      text: this.message(),
      time: new Date()
    };

    this.messages.update(msgs => [...msgs, newMessage]);
    this.users.update(users =>
      users.map(user => 
        user.id === this.selectedUser()?.id 
          ? { ...user, lastMessage: this.message() }
          : user
      )
    );
    
    this.message.set('');
    this.shouldScroll = true;
    this.scrollToBottom();

    // Simulate received message
    setTimeout(() => {
      if (!this.selectedUser()) return;
      const receivedMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: this.selectedUser()!.id,
        senderName: this.selectedUser()!.name,
        text: 'Thanks for your message! I\'ll get back to you soon.',
        time: new Date()
      };
      this.messages.update(msgs => [...msgs, receivedMessage]);
      this.shouldScroll = true;
      this.scrollToBottom();
    }, 1000);
  }

  private scrollToBottom(): void {
    if (!this.shouldScroll || !this.scrollContainer?.nativeElement) return;
    try {
      const element = this.scrollContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
      this.shouldScroll = false;
    } catch (err) {
      console.warn('Failed to scroll to bottom:', err);
    }
  }

  toggleEmojiPicker(event: Event): void {
    event.stopPropagation();
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: { emoji: { native: string } }): void {
    this.message.set(this.message() + event.emoji.native);
    this.showEmojiPicker = false;
  }

  @HostListener('document:click')
  hideEmojiPicker(): void {
    this.showEmojiPicker = false;
  }

}
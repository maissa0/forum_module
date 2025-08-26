import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport mode="side" opened>
        <mat-toolbar>Forum</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item (click)="navigate('/appointments')" [class.active]="isActive('/appointments')">
            <mat-icon matListItemIcon>event</mat-icon>
            <span matListItemTitle>Rendez-vous</span>
          </a>
          <a mat-list-item (click)="navigate('/comments')" [class.active]="isActive('/comments')">
            <mat-icon matListItemIcon>comment</mat-icon>
            <span matListItemTitle>Commentaires</span>
          </a>
          <a mat-list-item (click)="navigate('/chat')" [class.active]="isActive('/chat')">
            <mat-icon matListItemIcon>chat</mat-icon>
            <span matListItemTitle>Chat</span>
          </a>
          <a mat-list-item (click)="navigate('/annonces')" [class.active]="isActive('/annonces')">
            <mat-icon matListItemIcon>campaign</mat-icon>
            <span matListItemTitle>Annonces</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>{{ title }}</span>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background-color: #f5f5f5;
    }

    .sidenav {
      width: 250px;
      background-color: #ffffff;
      border-right: 1px solid #e0e0e0;
    }

    .mat-toolbar {
      background-color: #ffffff;
      color: #333333;
      border-bottom: 1px solid #e0e0e0;
    }

    .mat-sidenav-content .mat-toolbar {
      background-color: #ffffff;
      position: sticky;
      top: 0;
      z-index: 1;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .content {
      padding: 0;
      min-height: calc(100vh - 64px);
    }

    mat-nav-list {
      padding-top: 0;
    }

    .mat-list-item {
      color: #333333;
    }

    a.active {
      background-color: #f5f5f5 !important;
    }

    a:hover {
      background-color: #fafafa;
    }

    .mat-icon {
      color: #757575;
    }

    .active .mat-icon {
      color: #196E66;
    }

    span {
      color: #333333;
    }
  `]
})
export class AppComponent {
  title = 'Forum';
  
  constructor(private router: Router) {
    router.events.subscribe(event => {
      console.log('Router Event:', event);
    });
  }

  navigate(path: string) {
    console.log('Attempting navigation to:', path);
    this.router.navigate([path], { skipLocationChange: false }).then(
      success => console.log('Navigation success:', success),
      error => console.error('Navigation error:', error)
    );
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './shared/auth.service';
import { filter } from 'rxjs/operators';

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
    <div *ngIf="!isLoginPage; else loginTemplate">
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
            <span class="toolbar-spacer"></span>
            <button mat-icon-button (click)="logout()" title="Se déconnecter">
              <mat-icon>logout</mat-icon>
            </button>
          </mat-toolbar>
          <div class="content">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
    
    <ng-template #loginTemplate>
      <router-outlet></router-outlet>
    </ng-template>
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
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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

    .toolbar-spacer {
      flex: 1 1 auto;
    }
  `]
})
export class AppComponent {
  title = 'Forum';
  isLoginPage = false;

  constructor(private router: Router, private authService: AuthService) {
    // Check initial route
    this.isLoginPage = this.router.url === '/login';
    
    // Listen to route changes
    router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginPage = event.url === '/login';
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

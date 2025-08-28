import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Announcement } from '../../models/announcement';
import { AnnouncementService } from '../../services/announcement.service';
import { AnnouncementDetailDialogComponent } from './announcement-detail-dialog.component';
import { AnnouncementFormDialogComponent } from './announcement-form-dialog.component';

@Component({
  selector: 'app-announcement-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    RouterModule,
    RouterLink,
    AnnouncementFormDialogComponent
  ],
  template: `
    <div class="container">
      <div class="header-section">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>campaign</mat-icon>
            Annonces
          </h1>
          <button 
            mat-raised-button 
            color="primary"
            (click)="openCreateDialog()"
            class="add-button"
          >
            <mat-icon>add</mat-icon>
            Nouvelle Annonce
          </button>
        </div>
        
        <div class="search-container">
          <mat-form-field appearance="outline">
            <mat-label>Rechercher une annonce</mat-label>
            <input 
              matInput 
              [formControl]="searchControl"
              placeholder="Rechercher par titre ou description"
            >
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
        </div>
      </div>

      <div class="announcements-grid">
        <div 
          *ngFor="let announcement of announcements" 
          class="announcement-card"
          (click)="openDetailDialog(announcement)"
        >
          <div class="card-image" *ngIf="announcement.imageUrl">
            <img [src]="getImageUrl(announcement.imageUrl)" [alt]="announcement.title" class="announcement-image">
          </div>
          
          <div class="card-header">
            <div class="announcement-status">{{announcement.category}}</div>
            <div class="announcement-date">{{announcement.date | date:'dd MMM yyyy'}}</div>
          </div>
          
          <div class="card-content">
            <h3 class="announcement-title">{{announcement.title}}</h3>
            <p class="announcement-description">{{announcement.description}}</p>
            
            <div class="announcement-meta">
              <div class="rating">
                <mat-icon class="star-icon">star</mat-icon>
                <span>{{announcement.averageRating || '0.0'}}</span>
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <button 
              mat-button 
              color="white"
              (click)="openDetailDialog(announcement); $event.stopPropagation()"
              class="view-button"
            >
              <mat-icon>visibility</mat-icon>
              Voir détails
            </button>
            <div class="action-buttons">
              <button 
                mat-icon-button 
                color="primary"
                (click)="openEditDialog(announcement); $event.stopPropagation()"
                matTooltip="Modifier"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button 
                mat-icon-button 
                color="warn"
                (click)="deleteAnnouncement(announcement); $event.stopPropagation()"
                matTooltip="Supprimer"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Empty state when no announcements -->
        <div *ngIf="announcements.length === 0" class="empty-state">
          <mat-icon>campaign</mat-icon>
          <h3>Aucune annonce trouvée</h3>
          <p>Créez votre première annonce pour commencer</p>
          <button 
            mat-raised-button 
            color="primary"
            (click)="openCreateDialog()"
          >
            <mat-icon>add</mat-icon>
            Créer une annonce
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 64px);
      background-color: #f8f9fa;
      color: #333333;
      padding: 2rem 0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .header-section {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .page-title mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #196E66;
    }

    .search-container {
      max-width: 400px;
    }

    .search-container mat-form-field {
      width: 100%;
    }

    .add-button {
      background: linear-gradient(135deg, #2f5f5aff, #196E66);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(25, 110, 102, 0.2);
    }

    .add-button:hover {
      background: linear-gradient(135deg, #275450, #145c55);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(25, 110, 102, 0.3);
    }

    .announcements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .announcement-card {
      background: white;
      border-radius: 12px;
      padding: 0;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      cursor: pointer;
      overflow: hidden;
      border: 1px solid #e8e9ea;
    }

    .announcement-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .card-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
    }

    .announcement-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .announcement-card:hover .announcement-image {
      transform: scale(1.05);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem 0.5rem;
    }

    .announcement-status {
      background: linear-gradient(135deg, #196E66, #2f5f5aff);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .announcement-date {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }

    .card-content {
      padding: 0.5rem 1.25rem 1rem;
    }

    .announcement-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .announcement-description {
      color: #666;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0 0 1rem 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .announcement-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #fff8e1;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .star-icon {
      color: #ffc107;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-top: 1px solid #f0f0f0;
      background: #fafafa;
    }

    .view-button {
      background: #196E66;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .view-button:hover {
      background: #145c55;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .action-buttons button {
      width: 36px;
      height: 36px;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ddd;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin: 1rem 0 0.5rem 0;
      color: #333;
    }

    .empty-state p {
      margin: 0 0 2rem 0;
      font-size: 1rem;
    }

    .empty-state button {
      background: linear-gradient(135deg, #2f5f5aff, #196E66);
      color: white;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .announcements-grid {
        grid-template-columns: 1fr;
      }

      .announcement-card {
        margin: 0;
      }
    }
  `]
})
export class AnnouncementListComponent implements OnInit {
  announcements: Announcement[] = [];
  displayedColumns: string[] = ['title', 'description', 'category', 'date', 'actions'];
  searchControl = new FormControl('');

  constructor(
    private announcementService: AnnouncementService,
    private dialog: MatDialog
  ) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value) {
        this.searchAnnouncements(value);
      } else {
        this.loadAnnouncements();
      }
    });
  }

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '';
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it starts with /uploads, prepend the backend URL
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8081${imageUrl}`;
    }
    
    // If it's just a filename, construct the full URL
    if (!imageUrl.startsWith('/')) {
      return `http://localhost:8081/uploads/${imageUrl}`;
    }
    
    return `http://localhost:8081${imageUrl}`;
  }

  loadAnnouncements(): void {
    this.announcementService.getAll().subscribe(
      announcements => this.announcements = announcements
    );
  }

  searchAnnouncements(criteria: string): void {
    this.announcementService.search(criteria).subscribe(
      announcements => this.announcements = announcements
    );
  }

  deleteAnnouncement(announcement: Announcement): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      this.announcementService.delete(announcement.id).subscribe(() => {
        this.loadAnnouncements();
      });
    }
  }

  openDetailDialog(announcement: Announcement): void {
    const dialogRef = this.dialog.open(AnnouncementDetailDialogComponent, {
      data: announcement,
      width: '600px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadAnnouncements();
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AnnouncementFormDialogComponent, {
      width: '450px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAnnouncements();
      }
    });
  }

  openEditDialog(announcement: Announcement): void {
    const dialogRef = this.dialog.open(AnnouncementFormDialogComponent, {
      width: '450px',
      maxHeight: '90vh',
      data: { announcement }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAnnouncements();
      }
    });
  }
}

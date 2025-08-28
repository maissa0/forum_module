import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Announcement } from '../../models/announcement';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-announcement-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>campaign</mat-icon>
          {{ data.title }}
        </h2>
       
      </div>
      
      <mat-dialog-content>
        <div class="content-section">
          <div class="metadata-banner">
            <div class="metadata-item">
              <mat-icon>category</mat-icon>
              <span>{{ data.category }}</span>
            </div>
            <div class="metadata-item">
              <mat-icon>schedule</mat-icon>
              <span>{{ data.date | date:'medium' }}</span>
            </div>
          </div>

          <div class="image-section" *ngIf="data.imageUrl">
            <img [src]="getImageUrl(data.imageUrl)" [alt]="data.title" class="announcement-detail-image">
          </div>

          <mat-card class="description-card">
            <mat-card-content>
              <p class="description">{{ data.description }}</p>
            </mat-card-content>
          </mat-card>

          <div class="rating-section">
            <div class="current-rating">
              <h3>Évaluation</h3>
              <div class="rating-display">
                <div class="average-rating">
                  <span class="rating-number">{{ data.averageRating | number:'1.1-1' }}</span>
                  <span class="rating-max">/5</span>
                </div>
                <div class="static-stars">
                  <mat-icon *ngFor="let star of [1,2,3,4,5]" 
                    [class.filled]="(data.averageRating || 0) >= star"
                    [class.half-filled]="(data.averageRating || 0) >= star - 0.5 && (data.averageRating || 0) < star">
                    star
                  </mat-icon>
                </div>
              </div>
            </div>

            <div class="rate-announcement">
              <h4>Donnez votre avis</h4>
              <div class="star-rating">
                <button 
                  mat-icon-button 
                  *ngFor="let star of [1,2,3,4,5]"
                  (click)="rate(star)"
                  [class.rated]="userRating >= star"
                  [matTooltip]="star + ' étoiles'"
                >
                  <mat-icon>{{ userRating >= star ? 'star' : 'star_border' }}</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close color="primary">Fermer</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
      max-width: 600px;
      background-color: #f8f9fa;
    }

    .dialog-header {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
      background-color: #196E66;
      color: white;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    .dialog-header h2 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      text-align: center;
    }

    .close-button {
      position: absolute;
      right: 8px;
      top: 8px;
      color: white;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    .close-button:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .content-section {
      padding: 24px;
    }

    .metadata-banner {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
      padding: 16px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .metadata-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }

    .metadata-item mat-icon {
      color: #196E66;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .image-section {
      margin-bottom: 24px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .announcement-detail-image {
      width: 100%;
      height: auto;
      max-height: 300px;
      object-fit: cover;
      display: block;
    }

    .description-card {
      margin-bottom: 24px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .description {
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 16px;
    }

    .rating-section {
      background-color: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .current-rating h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 18px;
    }

    .rating-display {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .average-rating {
      display: flex;
      align-items: baseline;
    }

    .rating-number {
      font-size: 48px;
      font-weight: bold;
      color: #196E66;
      line-height: 1;
    }

    .rating-max {
      font-size: 20px;
      color: #666;
      margin-left: 4px;
    }

    .static-stars {
      display: flex;
      gap: 4px;
    }

    .static-stars mat-icon {
      color: #ddd;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .static-stars mat-icon.filled {
      color: #ffd700;
    }

    .static-stars mat-icon.half-filled {
      color: #ffd700;
      opacity: 0.5;
    }

    .rate-announcement {
      border-top: 1px solid #eee;
      padding-top: 24px;
    }

    .rate-announcement h4 {
      margin: 0 0 16px 0;
      color: #666;
      font-size: 16px;
    }

    .star-rating {
      display: flex;
      gap: 8px;
    }

    .star-rating button {
      padding: 0;
      width: 48px;
      height: 48px;
      line-height: 48px;
      transition: transform 0.2s ease;
    }

    .star-rating button:hover {
      transform: scale(1.1);
    }

    .star-rating .mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #ddd;
    }

    button.rated .mat-icon {
      color: #ffd700;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      background-color: white;
      margin: 0;
      border-top: 1px solid #eee;
    }

    mat-dialog-actions button {
      text-transform: uppercase;
      font-weight: 500;
    }
  `]
})
export class AnnouncementDetailDialogComponent {
  userRating = 0;

  constructor(
    public dialogRef: MatDialogRef<AnnouncementDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Announcement,
    private announcementService: AnnouncementService
  ) {}

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

  rate(rating: number): void {
    this.userRating = rating;
    // Here you would typically call a service method to submit the rating
    // For now, we'll just update the average rating in the mock data
    this.announcementService.rateAnnouncement(this.data.id, rating).subscribe(
      result => {
        if (result && result.average !== undefined) {
          this.data.averageRating = result.average;
        }
      }
    );
  }
}

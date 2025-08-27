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
      <mat-card class="list-card fade-in">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>campaign</mat-icon>
            Liste des Annonces
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
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

            <button 
              mat-raised-button 
              color="primary"
              (click)="openCreateDialog()"
              class="add-button"
            >
              <mat-icon>add</mat-icon>
              
            </button>
          </div>

          <table mat-table [dataSource]="announcements" class="mat-elevation-z0">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Titre</th>
              <td mat-cell *matCellDef="let element" class="title-cell">
                <div class="title-content">
                  <span class="announcement-title">{{element.title}}</span>
                  <span class="announcement-category">{{element.category}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let element" class="description-cell">{{element.description}}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Note</th>
              <td mat-cell *matCellDef="let element" class="rating-cell">
                <div class="rating">
                  <mat-icon class="star-icon">star</mat-icon>
                  <span>{{element.averageRating}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let element" class="date-cell">{{element.date | date:'dd/MM/yyyy'}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element">
                <button 
                  mat-icon-button 
                  color="primary"
                  (click)="openDetailDialog(element); $event.stopPropagation()"
                  matTooltip="Voir les détails"
                >
                  <mat-icon>visibility</mat-icon>
                </button>
                <button 
                  mat-icon-button 
                  color="primary"
                  (click)="openEditDialog(element); $event.stopPropagation()"
                  matTooltip="Modifier"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button 
                  mat-icon-button 
                  color="warn"
                  (click)="deleteAnnouncement(element)"
                  matTooltip="Supprimer"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr 
              mat-row 
              *matRowDef="let row; columns: displayedColumns;"
              (click)="openDetailDialog(row)"
              style="cursor: pointer;"
              class="announcement-row"
            ></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    :host {
      display: block;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
      color: #333333;
      padding: 2rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .list-card {
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    ::ng-deep .mat-mdc-card-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      background-color: #fafafa;
    }

    ::ng-deep .mat-mdc-card-title {
      color: #333333;
      font-size: 1.25rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-container {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem 1.5rem;
    }

    mat-form-field {
      flex: 1;
    }

    .add-button {
      background: linear-gradient(135deg, #2f5f5aff, #196E66);
      width: 48px;
      height: 48px;
      min-width: 48px;
      min-height: 48px;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      margin-top: -30px;
      transition: transform 0.2s;
    }

    .add-button mat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      width: 24px;
      height: 24px;
      line-height: 1;
      margin-right: -3px;
    }

    .add-button:hover {
      background: linear-gradient(135deg, #275450, #145c55);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    .mat-mdc-table {
      background: transparent;
    }

    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }

    .mat-mdc-header-cell {
      color: #333333;
      font-weight: 500;
      border-bottom: 1px solid #e0e0e0;
    }

    .mat-mdc-cell {
      color: #333333;
      border-bottom: 1px solid #e0e0e0;
      padding: 16px !important;
    }

    .title-cell {
      min-width: 250px;
      max-width: 300px;
    }

    .title-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .announcement-title {
      font-weight: 500;
      color: #333333;
    }

    .announcement-category {
      font-size: 0.875rem;
      color: #196E66;
      background-color: rgba(25, 110, 102, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
      width: fit-content;
    }

    .description-cell {
      min-width: 400px;
      line-height: 1.5;
    }

    .rating-cell {
      width: 100px;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .star-icon {
      color: #ffc107;
      font-size: 20px;
      height: 20px;
      width: 20px;
    }

    .date-cell {
      width: 120px;
      color: #757575;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in {
      animation: fadeIn 0.3s ease-in;
    }

    .announcement-row:hover {
      background-color: #f5f5f5;
      transition: background-color 0.2s ease;
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

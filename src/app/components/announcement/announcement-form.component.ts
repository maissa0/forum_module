import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-announcement-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="container">
      <mat-card class="form-card fade-in">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ isEditMode ? 'edit' : 'add_circle' }}</mat-icon>
            {{ isEditMode ? 'Modifier l\'annonce' : 'Nouvelle Annonce' }}
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="announcementForm" (ngSubmit)="onSubmit()" class="announcement-form">
            <mat-form-field appearance="outline">
              <mat-label>Titre</mat-label>
              <input 
                matInput 
                formControlName="title"
                placeholder="Titre de l'annonce"
              >
              <mat-icon matPrefix>title</mat-icon>
              <mat-error *ngIf="announcementForm.get('title')?.errors?.['required']">
                Le titre est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea 
                matInput 
                formControlName="description"
                placeholder="Description de l'annonce"
                rows="4"
              ></textarea>
              <mat-icon matPrefix>description</mat-icon>
              <mat-error *ngIf="announcementForm.get('description')?.errors?.['required']">
                La description est requise
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Catégorie</mat-label>
              <mat-select formControlName="category">
                <mat-option value="Général">Général</mat-option>
                <mat-option value="Emploi">Emploi</mat-option>
                <mat-option value="Immobilier">Immobilier</mat-option>
                <mat-option value="Véhicules">Véhicules</mat-option>
              </mat-select>
              <mat-icon matPrefix>category</mat-icon>
              <mat-error *ngIf="announcementForm.get('category')?.errors?.['required']">
                La catégorie est requise
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date</mat-label>
              <input 
                matInput 
                [matDatepicker]="picker"
                formControlName="date"
                placeholder="JJ/MM/AAAA"
              >
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="announcementForm.get('date')?.errors?.['required']">
                La date est requise
              </mat-error>
            </mat-form-field>

            <div class="button-container">
              <button 
                mat-raised-button 
                type="button" 
                (click)="goBack()"
              >
                Annuler
              </button>
              <button 
                mat-raised-button 
                type="submit"
                color="primary"
                [disabled]="!announcementForm.valid"
                class="submit-button"
              >
                <mat-icon>{{ isEditMode ? 'save' : 'add_circle' }}</mat-icon>
                {{ isEditMode ? 'Enregistrer' : 'Créer l\'annonce' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
      color: #333333;
      padding: 2rem 0;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .form-card {
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

    .announcement-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    .submit-button {
      background-color: #196E66;
    }

    .submit-button:hover:not([disabled]) {
      background-color: #145c55;
    }

    .submit-button[disabled] {
      background-color: #e0e0e0;
      color: #999999;
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
  `]
})
export class AnnouncementFormComponent implements OnInit {
  announcementForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    date: new FormControl<Date | null>(null, [Validators.required])
  });

  isEditMode = false;
  announcementId: string | null = null;

  constructor(
    private announcementService: AnnouncementService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.announcementId = id;
      this.loadAnnouncement(id);
    }
  }

  loadAnnouncement(id: string): void {
    this.announcementService.getById(id).subscribe(announcement => {
      if (announcement) {
        this.announcementForm.patchValue({
          title: announcement.title,
          description: announcement.description,
          category: announcement.category,
          date: announcement.date
        });
      }
    });
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      const formValue = this.announcementForm.value;
      if (this.isEditMode && this.announcementId) {
        this.announcementService.update(this.announcementId, {
          id: this.announcementId,
          title: formValue.title || '',
          description: formValue.description || '',
          category: formValue.category || '',
          date: formValue.date || new Date()
        }).subscribe(() => {
          this.router.navigate(['/annonces']);
        });
      } else {
        this.announcementService.create({
          title: formValue.title || '',
          description: formValue.description || '',
          category: formValue.category || '',
          date: formValue.date || new Date()
        }).subscribe(() => {
          this.router.navigate(['/annonces']);
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/annonces']);
  }
}

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AnnouncementService } from '../../services/announcement.service';
import { Announcement } from '../../models/announcement';

@Component({
  selector: 'app-announcement-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule
  ],
  template: `
    <div class="form-container">
      <div class="header-section">
        <h2>Nouvelle annonce</h2>
      </div>
      
      <div class="form-section">
        <form [formGroup]="announcementForm" (ngSubmit)="onSubmit()">
        <div class="input-group">
          <input 
            type="text"
            formControlName="title" 
            placeholder="Titre*"
            class="form-input"
          >
        </div>

        <div class="input-group">
          <textarea 
            formControlName="description" 
            placeholder="Description*"
            rows="4"
            class="form-input textarea"
          ></textarea>
        </div>

        <div class="input-group">
          <select formControlName="category" class="form-input">
            <option value="" disabled>Catégorie*</option>
            <option value="general">Général</option>
            <option value="event">Événement</option>
            <option value="news">Actualité</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div class="input-group">
          <input 
            type="date"
            formControlName="date" 
            placeholder="Date*"
            class="form-input"
            [min]="minDateString"
          >
        </div>

        <div class="input-group">
          <label class="file-upload-label">
            <input 
              type="file"
              accept="image/*"
              (change)="onFileSelected($event)"
              class="file-input"
            >
            <div class="file-upload-area">
              <div class="file-upload-content">
                <mat-icon *ngIf="!selectedImage">cloud_upload</mat-icon>
                <img *ngIf="selectedImage" [src]="selectedImage" alt="Preview" class="image-preview">
                <span class="file-upload-text">
                  {{ selectedFile ? selectedFile.name : 'Ajouter une image (optionnel)' }}
                </span>
              </div>
            </div>
          </label>
        </div>

        <button 
          type="button" 
          class="submit-btn"
          (click)="onSubmit()"
        >
        Créer annonce
        </button>
      </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 450px;
      margin: 0;
    }

    .form-container {
      background: white;
      padding: 0;
      border-radius: 12px;
      text-align: center;
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
    }

    .header-section {
      background: linear-gradient(135deg, #2f5f5aff 0%, #196E66 100%);
      padding: 20px 30px;
      color: white;
      text-align: center;
    }

    .header-section h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: white;
    }

    .form-section {
      padding: 30px 30px 40px 30px;
    }

    .file-upload-label {
      display: block;
      cursor: pointer;
    }

    .file-input {
      display: none;
    }

    .file-upload-area {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
      background-color: #fafafa;
    }

    .file-upload-area:hover {
      border-color: #196E66;
      background-color: #f0f8f7;
    }

    .file-upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .file-upload-content mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #666;
    }

    .file-upload-text {
      color: #666;
      font-size: 14px;
    }

    .image-preview {
      max-width: 150px;
      max-height: 150px;
      border-radius: 8px;
      object-fit: cover;
    }

    .input-group {
      margin-bottom: 16px;
    }

    .form-input {
      width: 100%;
      padding: 16px 20px;
      border: none;
      border-radius: 25px;
      background-color: #e8e8e8;
      font-size: 16px;
      color: #666;
      outline: none;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-input::placeholder {
      color: #999;
      font-size: 16px;
    }

    .form-input:focus {
      background-color: #ddd;
      color: #333;
    }

    .textarea {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }

    select.form-input {
      appearance: none;
      background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
      background-repeat: no-repeat;
      background-position: right 20px center;
      background-size: 12px;
      cursor: pointer;
    }

    select.form-input option {
      background-color: white;
      color: #333;
    }

    input[type="date"].form-input {
      cursor: pointer;
    }

    input[type="date"].form-input::-webkit-calendar-picker-indicator {
      cursor: pointer;
      filter: invert(0.6);
    }

    .submit-btn {
      background: linear-gradient(135deg, #2f5f5aff , #196E66);
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 24px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 212, 170, 0.3);
    }

    .submit-btn:hover:not([disabled]) {
      background: linear-gradient(135deg, #00b894, #00a085);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 212, 170, 0.4);
    }

    .submit-btn[disabled] {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .submit-btn:active {
      transform: translateY(0);
    }
  `]
})
        
export class AnnouncementFormDialogComponent {
  minDate = new Date();
  minDateString = this.minDate.toISOString().split('T')[0];
  selectedFile: File | null = null;
  selectedImage: string | null = null;
  
  announcementForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    category: new FormControl('', [Validators.required]),
    date: new FormControl<Date | null>(null, [Validators.required])
  });

  constructor(
    private dialogRef: MatDialogRef<AnnouncementFormDialogComponent>,
    private announcementService: AnnouncementService,
    @Inject(MAT_DIALOG_DATA) public data?: { announcement?: Announcement }
  ) {
    if (data?.announcement) {
      this.announcementForm.patchValue({
        title: data.announcement.title,
        description: data.announcement.description,
        category: data.announcement.category,
        date: new Date(data.announcement.date)
      });
      
      // Set existing image if available
      if (data.announcement.imageUrl) {
        this.selectedImage = this.getImageUrl(data.announcement.imageUrl);
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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

  onSubmit(): void {
    console.log('Form submitted');
    console.log('Form valid:', this.announcementForm.valid);
    console.log('Form value:', this.announcementForm.value);
    console.log('Form errors:', this.announcementForm.errors);
    
    if (this.announcementForm.valid) {
      const formValue = this.announcementForm.value;
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', formValue.title || '');
      formData.append('description', formValue.description || '');
      formData.append('category', formValue.category || '');
      
      // Handle date - it might be a string or Date object
      const dateValue = formValue.date;
      let dateString: string;
      if (dateValue instanceof Date) {
        dateString = dateValue.toISOString().split('T')[0];
      } else if (typeof dateValue === 'string') {
        dateString = dateValue;
      } else {
        dateString = new Date().toISOString().split('T')[0];
      }
      formData.append('date', dateString);
      
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      console.log('Sending request...');

      if (this.data?.announcement) {
        this.announcementService.updateWithFile(this.data.announcement.id, formData)
          .subscribe({
            next: (updatedAnnouncement) => {
              console.log('Update successful:', updatedAnnouncement);
              this.dialogRef.close(updatedAnnouncement);
            },
            error: (error) => {
              console.error('Update error:', error);
            }
          });
      } else {
        this.announcementService.createWithFile(formData)
          .subscribe({
            next: (newAnnouncement) => {
              console.log('Create successful:', newAnnouncement);
              this.dialogRef.close(newAnnouncement);
            },
            error: (error) => {
              console.error('Create error:', error);
            }
          });
      }
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.announcementForm.controls).forEach(key => {
        this.announcementForm.get(key)?.markAsTouched();
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AnnouncementService } from '../../services/announcement.service';
import { Announcement } from '../../models/announcement';

@Component({
  selector: 'app-announcement-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
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

        <button 
          type="submit" 
          class="submit-btn"
          [disabled]="!announcementForm.valid"
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
    }
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      const formValue = this.announcementForm.value;
      const announcement: Partial<Announcement> = {
        title: formValue.title || '',
        description: formValue.description || '',
        category: formValue.category || '',
        date: formValue.date || new Date()
      };

      if (this.data?.announcement) {
        this.announcementService.update(this.data.announcement.id, 
          { ...this.data.announcement, ...announcement })
          .subscribe(updatedAnnouncement => {
            this.dialogRef.close(updatedAnnouncement);
          });
      } else {
        this.announcementService.create(announcement as Announcement)
          .subscribe(newAnnouncement => {
            this.dialogRef.close(newAnnouncement);
          });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

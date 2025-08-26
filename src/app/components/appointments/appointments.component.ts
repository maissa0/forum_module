import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Appointment {
  id: string;
  title: string;
  date: Date;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FullCalendarModule,
  ],
  template: `
    <div class="container">
      <mat-card class="appointment-form-card fade-in">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>event_available</mat-icon>
            Nouveau Rendez-vous
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()" class="appointment-form">
            <mat-form-field appearance="outline">
              <mat-label>Titre du rendez-vous</mat-label>
              <input 
                matInput 
                formControlName="title" 
                placeholder="Ex: Réunion d'équipe"
                #titleInput
              >
              <mat-icon matPrefix>subject</mat-icon>
              <mat-error *ngIf="appointmentForm.get('title')?.errors?.['required']">
                Le titre est requis
              </mat-error>
              <mat-hint align="end">
                {{ titleInput.value?.length || 0 }}/50 caractères
              </mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date et heure</mat-label>
              <input 
                matInput 
                [matDatepicker]="picker" 
                formControlName="date" 
                placeholder="JJ/MM/AAAA"
                [min]="minDate"
              >
              <mat-icon matPrefix>calendar_today</mat-icon>
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="appointmentForm.get('date')?.errors?.['required']">
                La date est requise
              </mat-error>
              <mat-hint>Cliquez sur une date dans le calendrier pour la sélectionner rapidement</mat-hint>
            </mat-form-field>

            <button 
              mat-raised-button 
              type="submit" 
              color="primary"
              class="submit-button"
              [disabled]="!appointmentForm.valid || !appointmentForm.get('title')?.value || !appointmentForm.get('date')?.value"
            >
              <mat-icon>add_circle</mat-icon>
              Créer le rendez-vous
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="calendar-card fade-in">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>calendar_month</mat-icon>
            Calendrier des rendez-vous
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <full-calendar [options]="calendarOptions"></full-calendar>
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 2rem;
    }

    .appointment-form-card {
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .calendar-card {
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .appointment-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem;
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

    ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: #ffffff;
      border-radius: 8px !important;
    }

    ::ng-deep .mat-mdc-form-field-flex {
      padding: 0.75rem 1rem !important;
    }

    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__trailing {
      border-color: #e0e0e0 !important;
    }

    ::ng-deep .mat-mdc-form-field:hover .mdc-notched-outline__leading,
    ::ng-deep .mat-mdc-form-field:hover .mdc-notched-outline__notch,
    ::ng-deep .mat-mdc-form-field:hover .mdc-notched-outline__trailing {
      border-color: #999999 !important;
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing {
      border-color: #333333 !important;
    }

    ::ng-deep .mat-mdc-input-element {
      color: #333333 !important;
    }

    ::ng-deep .mat-mdc-form-field-label {
      color: #757575 !important;
    }

    ::ng-deep .mat-datepicker-toggle {
      color: #196E66 !important;
    }

    ::ng-deep .mat-calendar {
      background-color: #ffffff;
      color: #333333;
    }

    ::ng-deep .mat-calendar-body-selected {
      background-color: #333333;
      color: #ffffff;
    }

    ::ng-deep .mat-calendar-body-today:not(.mat-calendar-body-selected) {
      border-color: #333333;
    }

    ::ng-deep .submit-button {
      align-self: flex-end !important;
      background-color: #196E66 !important;
    }

    ::ng-deep .submit-button:hover:not([disabled]) {
      background-color: #145c55 !important;
      transform: translateY(-1px);
    }

    ::ng-deep .submit-button:active:not([disabled]) {
      transform: translateY(0);
    }

    ::ng-deep .submit-button[disabled] {
      background-color: #e0e0e0 !important;
      color: #999999 !important;
      cursor: not-allowed;
      transform: none;
    }

    .mat-icon {
      margin-right: 8px;
      font-size: 20px;
    }

    full-calendar {
      height: 700px;
      margin-top: 1rem;
    }

    ::ng-deep .fc {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 1rem;
    }

    ::ng-deep .fc-theme-standard th,
    ::ng-deep .fc-theme-standard td {
      border-color: #e0e0e0;
    }

    ::ng-deep .fc-theme-standard .fc-scrollgrid {
      border-color: #e0e0e0;
    }

    ::ng-deep .fc-day-today {
      background-color: rgba(25, 110, 102, 0.1) !important;
    }

    ::ng-deep .fc-button-primary {
      background-color: #196E66 !important;
      border-color: transparent !important;
      color: #ffffff !important;
    }

    ::ng-deep .fc-button-primary:hover {
      background-color: #145c55 !important;
      border-color: transparent !important;
    }

    ::ng-deep .fc-button-primary:disabled {
      background-color: #e0e0e0 !important;
      border-color: transparent !important;
      color: #999999 !important;
    }

    ::ng-deep .fc-event {
      background-color: #196E66;
      border-color: #145c55;
      border-radius: 4px;
      padding: 2px 4px;
      color: #ffffff;
    }

    ::ng-deep .fc-event:hover {
      background-color: #145c55;
    }

    ::ng-deep .fc-toolbar-title {
      color: #333333;
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

    @media (max-width: 1024px) {
      .container {
        grid-template-columns: 1fr;
      }

      .appointment-form-card {
        position: static;
      }
    }
  `]
})
export class AppointmentsComponent implements OnInit {
  minDate = new Date(); // Prevent selecting past dates

  appointmentForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    date: new FormControl<Date | null>(null, [Validators.required])
  });

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this)
  };

  appointments: Appointment[] = [];

  ngOnInit() {
    // Initialize with a sample appointment
    this.appointments = [
      {
        id: '1',
        title: 'Rendez-vous exemple',
        date: new Date()
      }
    ];
    this.updateCalendarEvents();
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        title: formValue.title || '',
        date: formValue.date || new Date()
      };
      this.appointments.push(newAppointment);
      this.updateCalendarEvents();
      this.appointmentForm.reset();
    }
  }

  private updateCalendarEvents() {
    this.calendarOptions.events = this.appointments.map(appointment => ({
      title: appointment.title,
      start: appointment.date
    }));
  }

  handleDateClick(info: { date: Date; dayEl: HTMLElement; }) {
    this.appointmentForm.get('date')?.setValue(info.date);
    info.dayEl.style.backgroundColor = '#e1f5fe';
    setTimeout(() => {
      info.dayEl.style.backgroundColor = '';
    }, 1000);
  }

  handleEventClick(info: { event: { title: string; start: Date | null; }; }) {
    console.log('Event clicked:', info.event.title);
  }
}

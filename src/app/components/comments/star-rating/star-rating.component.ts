import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  template: `<span *ngFor="let star of [1,2,3,4,5]" (click)="rate(star)">
    <mat-icon>{{ star <= currentRating ? 'star' : 'star_border' }}</mat-icon>
  </span>`
})
export class StarRatingComponent {
  @Input() currentRating = 0;
  @Output() rateChange = new EventEmitter<number>();
  rate(star: number) { this.rateChange.emit(star); }
}

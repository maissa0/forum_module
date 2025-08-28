import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommentService, Comment } from './comment.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PickerModule,
    TextFieldModule
  ],
  template: `
    <div class="container">
      <mat-card class="comment-form-card fade-in">
        <mat-card-header>
          <mat-icon>comment</mat-icon>
          <mat-card-title>Partagez votre avis</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="commentForm" (ngSubmit)="onSubmit()" class="comment-form">
            <mat-form-field>
              <mat-label>Que pensez-vous ?</mat-label>
              <textarea
                matInput
                [formControl]="textControl"
                cdkTextareaAutosize
                rows="4"
                placeholder="Écrivez votre commentaire ici..."
                (keydown)="handleKeydown($event)"
              ></textarea>
              <mat-hint align="end">Appuyez sur Shift + Entrée pour un saut de ligne</mat-hint>
            </mat-form-field>
            <button
              mat-raised-button
              type="submit"
              [disabled]="!commentForm.valid || commentForm.pristine"
            >
              <mat-icon>send</mat-icon>
              Publier
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="comments-list">
        <mat-card *ngFor="let comment of comments" class="comment-card fade-in">
          <mat-card-content>
            <p>{{ comment.text }}</p>
            <div class="comment-actions">
              <button
                mat-icon-button
                (click)="onLike(comment)"
                [class.active]="comment.likes > 0"
                matTooltip="J'aime"
              >
                <mat-icon>thumb_up</mat-icon>
                <span class="count" *ngIf="comment.likes">{{ comment.likes }}</span>
              </button>
              <button
                mat-icon-button
                (click)="onDislike(comment)"
                [class.active]="comment.dislikes > 0"
                matTooltip="Je n'aime pas"
              >
                <mat-icon>thumb_down</mat-icon>
                <span class="count" *ngIf="comment.dislikes">{{ comment.dislikes }}</span>
              </button>
              <button
                mat-icon-button
                (click)="toggleEmojiPicker(comment)"
                [class.active]="selectedComment === comment"
                matTooltip="Ajouter une réaction"
              >
                <mat-icon>add_reaction</mat-icon>
              </button>
              <button
                mat-icon-button
                (click)="onDelete(comment)"
                color="warn"
                matTooltip="Supprimer"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            <div
              *ngIf="selectedComment === comment"
              class="emoji-picker-container fade-in"
              (clickOutside)="selectedComment = null"
            >
              <emoji-mart
                [darkMode]="false"
                [showPreview]="false"
                [emojiSize]="24"
                title="Choisissez une réaction"
                emoji="point_up"
                [style]="{ border: 'none' }"
                [sheetSize]="32"
                [enableFrequentEmojiSort]="true"
                [showSingleCategory]="false"
                (emojiSelect)="onEmojiSelect($event)"
              ></emoji-mart>
            </div>
            <div class="emojis-list" *ngIf="comment.emojis?.length">
              <span *ngFor="let emoji of comment.emojis" class="emoji">
                {{ emoji }}
              </span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
      color: #196E66;
      padding: 2rem 0;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .comment-form-card {
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .comment-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
    }

    ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }

    ::ng-deep .mat-mdc-form-field-wrapper {
      padding-bottom: 0;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: #ffffff;
    }

    ::ng-deep .mat-mdc-form-field-flex {
      padding: 0.75rem 1rem;
    }

    ::ng-deep .mat-mdc-form-field-infix {
      border-top: none;
    }

    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__trailing {
      border-color: #4d4d4d !important;
    }

    ::ng-deep .mat-mdc-form-field {
      color-scheme: dark;
    }

    ::ng-deep .mat-mdc-input-element {
      color: #333333;
      caret-color: #0066cc;
    }

    ::ng-deep .mat-mdc-form-field-label {
      color: #757575;
    }

    ::ng-deep .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {
      color: #333333;
    }

    .comment-card {
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      margin-bottom: 1rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .comment-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    .comment-card mat-card-content {
      padding: 1.5rem;
    }

    .comment-card p {
      color: #333333;
      font-size: 1rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .comment-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid #e0e0e0;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: nowrap;
      min-height: 40px;
    }

    .mat-icon-button {
      color: #757575;
      transition: all 0.2s ease;
      margin: 0;
      padding: 6px;
      width: 36px;
      height: 36px;
      line-height: 36px;
    }

    .mat-icon-button:hover {
      color: #333333;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 18px;
    }

    .mat-icon-button.active {
      color: #0066cc;
      background-color: rgba(0, 102, 204, 0.08);
    }

    .count {
      font-size: 0.75rem;
      margin-left: 4px;
      color: #999999;
      position: relative;
      top: -1px;
    }

    .mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }

    button[type="submit"] {
      align-self: flex-end;
      padding: 0.5rem 1.5rem;
      border-radius: 20px;
      background-color: #0066cc;
      color: white;
      transition: background-color 0.2s ease;
    }

    button[type="submit"]:hover:not([disabled]) {
      background-color: #0052a3;
    }

    button[type="submit"][disabled] {
      background-color: #196E66;
      color: #ffffff;
    }

    .emoji-picker-container {
      position: absolute;
      margin-top: 0.5rem;
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slideIn 0.2s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    ::ng-deep emoji-mart {
      background-color: #ffffff !important;
    }

    ::ng-deep .emoji-mart-bar {
      border-color: #e0e0e0 !important;
    }

    ::ng-deep .emoji-mart-search {
      margin: 8px;
    }

    ::ng-deep .emoji-mart-search input {
      background-color: #ffffff !important;
      border: 1px solid #e0e0e0 !important;
      color: #333333 !important;
      border-radius: 20px !important;
      padding: 8px 16px !important;
    }

    ::ng-deep .emoji-mart-category-label {
      background-color: #2d2d2d !important;
      padding: 8px 16px !important;
    }

    ::ng-deep .emoji-mart-category .emoji-mart-emoji:hover::before {
      background-color: #4d4d4d !important;
    }

    ::ng-deep .emoji-mart-scroll {
      padding: 0 8px;
    }

    ::ng-deep .emoji-mart-anchors {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding: 0 8px;
      justify-content: flex-start;
      background-color: #2d2d2d;
    }

    ::ng-deep .emoji-mart-anchor {
      flex: 0 0 auto;
      color: #999999 !important;
    }

    ::ng-deep .emoji-mart-anchor-selected {
      color: #0066cc !important;
    }

    ::ng-deep .emoji-mart-anchor-bar {
      background-color: #0066cc !important;
    }

    ::ng-deep .emoji-mart-anchors::-webkit-scrollbar {
      height: 4px;
    }

    ::ng-deep .emoji-mart-anchors::-webkit-scrollbar-track {
      background: #2d2d2d;
    }

    ::ng-deep .emoji-mart-anchors::-webkit-scrollbar-thumb {
      background-color: #4d4d4d;
      border-radius: 2px;
    }

    .emojis-list {
      margin-top: 0.75rem;
      font-size: 1.25rem;
      padding: 0.5rem 0.75rem;
      background-color: #f5f5f5;
      border-radius: 20px;
      display: inline-flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      max-width: 100%;
      animation: fadeIn 0.2s ease-out;
    }

    .emoji {
      cursor: pointer;
      transition: transform 0.2s ease;
      display: inline-flex;
      align-items: center;
      padding: 2px 6px;
      border-radius: 12px;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
    }

    .emoji:hover {
      transform: scale(1.2);
      background-color: #f8f8f8;
      border-color: #d0d0d0;
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
export class CommentsComponent implements OnInit {
  textControl = new FormControl('', [Validators.required]);
  commentForm = new FormGroup({
    text: this.textControl
  });

  comments: Comment[] = [];
  selectedComment: Comment | null = null;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getComments().subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
      }
    });
  }

  onSubmit() {
    if (this.commentForm.valid) {
      const text = this.commentForm.value.text;
      const username = this.authService.getUsername();

      // Create comment object without the id field to let MongoDB generate it
      const newComment: any = {
        text: text || '',
        userId: username,
        likes: 0,
        dislikes: 0,
        emojis: [],
        createdDate: new Date().toISOString()
      };

      this.commentService.createComment(newComment).subscribe({
        next: (createdComment) => {
          this.comments.unshift(createdComment);
          this.commentForm.reset();
        },
        error: (err) => {
          console.error('Error creating comment:', err);
        }
      });
    }
  }

  onLike(comment: Comment) {
    this.commentService.likeComment(comment.id).subscribe({
      next: (updatedComment) => {
        const index = this.comments.findIndex(c => c.id === comment.id);
        if (index !== -1) {
          this.comments[index] = updatedComment;
        }
      },
      error: (err) => {
        console.error('Error liking comment:', err);
      }
    });
  }

  onDislike(comment: Comment) {
    this.commentService.dislikeComment(comment.id).subscribe({
      next: (updatedComment) => {
        const index = this.comments.findIndex(c => c.id === comment.id);
        if (index !== -1) {
          this.comments[index] = updatedComment;
        }
      },
      error: (err) => {
        console.error('Error disliking comment:', err);
      }
    });
  }

  onDelete(comment: Comment) {
    this.commentService.deleteComment(comment.id).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== comment.id);
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
      }
    });
  }

  toggleEmojiPicker(comment: Comment) {
    this.selectedComment = this.selectedComment === comment ? null : comment;
  }

  onEmojiSelect(event: any) {
    if (this.selectedComment) {
      this.commentService.addEmoji(this.selectedComment.id, event.emoji.native).subscribe({
        next: (updatedComment) => {
          const index = this.comments.findIndex(c => c.id === this.selectedComment!.id);
          if (index !== -1) {
            this.comments[index] = updatedComment;
          }
          this.selectedComment = null;
        },
        error: (err) => {
          console.error('Error adding emoji:', err);
        }
      });
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.commentForm.valid && !this.commentForm.pristine) {
        this.onSubmit();
      }
    }
  }
}

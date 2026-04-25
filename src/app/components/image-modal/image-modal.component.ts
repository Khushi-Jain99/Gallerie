import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsplashImage } from '../../services/unsplash.service';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        
        <!-- Close Button: Top-right of the card, outside image content -->
        <button class="close-icon-btn" (click)="close()" aria-label="Close">
          <span class="material-icons">close</span>
        </button>

        <!-- Image Section: Top -->
        <div class="image-wrapper">
          <img [src]="image.urls.regular" [alt]="image.alt_description" class="display-img">
        </div>

        <!-- Details Section: Below Image -->
        <div class="details-wrapper">
          <div class="details-header">
            <div class="user-block">
              <span class="photographer">Photo by <strong>{{ image.user.name }}</strong></span>
            </div>
            <div class="likes-badge">
              <span class="heart-icon">❤️</span>
              <span class="count">{{ image.likes }}</span>
            </div>
          </div>

          <p class="image-desc" *ngIf="image.alt_description">
            {{ image.alt_description | titlecase }}
          </p>

          <div class="action-footer">
            <a [href]="image.links.download + '&force=true'" target="_blank" class="simple-download-btn">
              <span class="material-icons">download</span>
              Download Image
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      padding: 20px;
    }

    .modal-card {
      position: relative;
      background: #1a1a1a;
      width: 100%;
      max-width: 800px;
      max-height: 95vh;
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Close Button Styles */
    .close-icon-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
      transition: background 0.3s ease;
    }

    .close-icon-btn:hover {
      background: rgba(255, 255, 255, 0.4);
    }

    /* Image Styles */
    .image-wrapper {
      width: 100%;
      background: #000;
      display: flex;
      justify-content: center;
      padding-top: 50px; /* Space for close button */
    }

    .display-img {
      max-width: 100%;
      max-height: 60vh;
      object-fit: contain;
      display: block;
    }

    /* Details Styles */
    .details-wrapper {
      padding: 25px;
      background: #1a1a1a;
    }

    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .photographer {
      color: #fff;
      font-size: 1.1rem;
    }

    .likes-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(255, 255, 255, 0.05);
      padding: 5px 12px;
      border-radius: 20px;
    }

    .heart-icon {
      font-size: 1rem;
    }

    .count {
      color: #fff;
      font-weight: 600;
    }

    .image-desc {
      color: #aaa;
      line-height: 1.5;
      margin-bottom: 20px;
      font-size: 0.95rem;
    }

    .action-footer {
      display: flex;
    }

    .simple-download-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #6366f1;
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      transition: opacity 0.3s;
    }

    .simple-download-btn:hover {
      opacity: 0.9;
    }

    /* Mobile adjustments */
    @media (max-width: 600px) {
      .modal-card {
        border-radius: 12px;
      }
      .details-wrapper {
        padding: 15px;
      }
      .photographer {
        font-size: 1rem;
      }
    }
  `]
})
export class ImageModalComponent {
  @Input() image!: UnsplashImage;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}

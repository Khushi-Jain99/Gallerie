import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsplashImage } from '../../services/unsplash.service';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        
        <!-- Close Button -->
        <button class="close-icon-btn" (click)="close()" aria-label="Close">
          <span class="material-icons">close</span>
        </button>

        <!-- Image Section -->
        <div class="image-wrapper">
          <img [src]="image.urls.regular" [alt]="image.alt_description" class="display-img">
        </div>

        <!-- Details Section -->
        <div class="details-wrapper">
          <div class="details-header">
            <div class="user-block">
              <span class="photographer">Photo by <strong>{{ image.user.name }}</strong></span>
            </div>
            
            <div class="like-action" [class.is-liked]="isLiked" (click)="toggleLike()">
              <span class="material-icons heart-icon">{{ isLiked ? 'favorite' : 'favorite_border' }}</span>
              <span class="count">{{ currentLikes }}</span>
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
      animation: modalFadeUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
    }

    @keyframes modalFadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .close-icon-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .close-icon-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }

    .image-wrapper {
      width: 100%;
      background: #0a0a0a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    .display-img {
      max-width: 100%;
      max-height: 65vh;
      object-fit: contain;
      display: block;
    }

    .details-wrapper {
      padding: 30px;
      background: #1a1a1a;
    }

    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .photographer {
      color: #fff;
      font-size: 1.15rem;
    }

    /* Like Action Styles */
    .like-action {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      padding: 10px 18px;
      border-radius: 30px;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .like-action:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.05);
    }

    .like-action.is-liked {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
    }

    .heart-icon {
      font-size: 24px;
      color: #fff;
      transition: color 0.3s ease;
    }

    .is-liked .heart-icon {
      color: #ef4444;
      animation: heartPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .count {
      color: #fff;
      font-weight: 600;
      font-size: 1rem;
    }

    @keyframes heartPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }

    .image-desc {
      color: #aaa;
      line-height: 1.6;
      margin-bottom: 25px;
      font-size: 1rem;
    }

    .action-footer {
      display: flex;
      gap: 15px;
    }

    .simple-download-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: white;
      padding: 14px 24px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }

    .simple-download-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
      filter: brightness(1.1);
    }

    @media (max-width: 600px) {
      .modal-card {
        border-radius: 0;
        max-height: 100vh;
      }
      .details-wrapper {
        padding: 20px;
      }
      .photographer {
        font-size: 1rem;
      }
      .like-action {
        padding: 8px 14px;
      }
    }
  `]
})
export class ImageModalComponent implements OnInit {
  @Input() image!: UnsplashImage;
  @Output() closed = new EventEmitter<void>();

  isLiked: boolean = false;
  currentLikes: number = 0;

  ngOnInit() {
    this.currentLikes = this.image.likes || 0;
    this.checkLikeStatus();
  }

  checkLikeStatus() {
    const savedLikes = JSON.parse(localStorage.getItem('gallerie_likes') || '{}');
    if (savedLikes[this.image.id]) {
      this.isLiked = true;
    }
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    
    if (this.isLiked) {
      this.currentLikes++;
    } else {
      this.currentLikes--;
    }

    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    const savedLikes = JSON.parse(localStorage.getItem('gallerie_likes') || '{}');
    if (this.isLiked) {
      savedLikes[this.image.id] = true;
    } else {
      delete savedLikes[this.image.id];
    }
    localStorage.setItem('gallerie_likes', JSON.stringify(savedLikes));
  }

  close() {
    this.closed.emit();
  }
}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsplashImage } from '../../services/unsplash.service';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-card">
      <div class="glass-overlay" (click)="onCardClick()"></div>
      <img 
        [src]="image.urls.small" 
        [alt]="image.alt_description" 
        loading="lazy"
        class="gallery-image"
        (click)="onCardClick()"
      >
      
      <div class="like-container" [class.is-liked]="isLiked" (click)="toggleLike($event)">
        <div class="like-button">
          <span class="material-icons heart-icon">{{ isLiked ? 'favorite' : 'favorite_border' }}</span>
        </div>
        <span class="like-count">{{ currentLikes }}</span>
      </div>

      <div class="card-info" (click)="onCardClick()">
        <p class="photographer-name">{{ image.user.name }}</p>
      </div>
    </div>
  `,
  styles: [`
    .image-card {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      margin-bottom: 20px;
      break-inside: avoid;
    }

    .image-card:hover {
      transform: scale(1.02);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .image-card:hover .gallery-image {
      transform: scale(1.1);
      filter: brightness(0.8);
    }

    .gallery-image {
      width: 100%;
      display: block;
      transition: transform 0.6s ease;
      border-radius: 16px;
    }

    .glass-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        transparent 60%,
        rgba(0, 0, 0, 0.7) 100%
      );
      z-index: 1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .image-card:hover .glass-overlay {
      opacity: 1;
    }

    /* Like Button Styles */
    .like-container {
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px;
      border-radius: 30px;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0.6;
    }

    .image-card:hover .like-container {
      opacity: 1;
    }

    .like-container:hover {
      background: rgba(0, 0, 0, 0.5);
      transform: translateY(-2px);
    }

    .like-container.is-liked {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(239, 68, 68, 0.4);
      opacity: 1;
    }

    .heart-icon {
      font-size: 24px;
      color: white;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .is-liked .heart-icon {
      color: #ef4444;
      animation: heartPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .like-count {
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }

    @keyframes heartPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.4); }
      100% { transform: scale(1); }
    }

    .card-info {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 15px;
      z-index: 2;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    }

    .image-card:hover .card-info {
      opacity: 1;
      transform: translateY(0);
    }

    .photographer-name {
      color: white;
      margin: 0;
      font-size: 0.9rem;
      font-weight: 500;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
  `]
})
export class ImageCardComponent implements OnInit {
  @Input() image!: UnsplashImage;
  @Output() clicked = new EventEmitter<UnsplashImage>();

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
      // If we liked it locally, we should probably show that in the count
      // though real apps would sync with a backend.
      // For this local-only persistence, we'll just track the state.
    }
  }

  toggleLike(event: Event) {
    event.stopPropagation(); // Prevent card click trigger
    
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

  onCardClick() {
    this.clicked.emit(this.image);
  }
}

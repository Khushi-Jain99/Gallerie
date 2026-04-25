import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsplashImage } from '../../services/unsplash.service';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-card" (click)="onCardClick()">
      <div class="glass-overlay"></div>
      <img 
        [src]="image.urls.small" 
        [alt]="image.alt_description" 
        loading="lazy"
        class="gallery-image"
      >
      <div class="card-info">
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
export class ImageCardComponent {
  @Input() image!: UnsplashImage;
  @Output() clicked = new EventEmitter<UnsplashImage>();

  onCardClick() {
    this.clicked.emit(this.image);
  }
}

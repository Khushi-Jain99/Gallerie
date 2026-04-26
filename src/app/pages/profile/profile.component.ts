import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UnsplashService, UnsplashImage } from '../../services/unsplash.service';
import { AuthService, User } from '../../services/auth.service';
import { ImageCardComponent } from '../../components/image-card/image-card.component';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ImageCardComponent, ImageModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  stats = {
    uploads: 0,
    likes: 0,
    collections: 12
  };

  activeTab: 'uploads' | 'liked' = 'uploads';
  uploadedImages: any[] = [];
  likedImages: UnsplashImage[] = [];
  isLoadingLiked: boolean = false;
  selectedImage: UnsplashImage | null = null;

  // Editing state
  isEditing = false;
  editName = '';
  editBio = '';
  editLocation = '';

  // Image Adjustment state
  showCropModal = false;
  tempImage: string | null = null;
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  isDragging = false;
  startX = 0;
  startY = 0;

  constructor(
    private unsplashService: UnsplashService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUploads();
    this.loadLikedImages();
    this.resetEditFields();
  }

  get user() {
    return this.authService.currentUser();
  }

  resetEditFields() {
    const current = this.user;
    if (current) {
      this.editName = current.name;
      this.editBio = current.bio || '';
      this.editLocation = current.location || '';
    }
  }

  toggleEdit() {
    this.isEditing = true;
    this.resetEditFields();
  }

  cancelEdit() {
    this.isEditing = false;
    this.resetEditFields();
  }

  saveProfile() {
    if (this.editName.trim()) {
      this.authService.updateProfile({
        name: this.editName,
        bio: this.editBio,
        location: this.editLocation
      });
      this.isEditing = false;
    }
  }

  // Location handling
  detectLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Use a simple free reverse geocoding API (OpenStreetMap Nominatim)
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(data => {
              const city = data.address.city || data.address.town || data.address.village || '';
              const state = data.address.state || '';
              const country = data.address.country || '';
              const locString = `${city}${city && state ? ', ' : ''}${state}${ (city || state) && country ? ' / ' : ''}${country}`;
              
              this.editLocation = locString || 'Location found';
              this.authService.updateProfile({ location: this.editLocation });
            })
            .catch(() => {
              console.error('Reverse geocoding failed');
            });
        },
        (error) => {
          console.error('Geolocation permission denied or failed', error);
          alert('Location access denied. Please enter your location manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  // Image Adjustment Handling
  onAvatarClick(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.tempImage = reader.result as string;
        this.showCropModal = true;
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
      };
      reader.readAsDataURL(file);
    }
  }

  startDrag(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    this.startX = clientX - this.panX;
    this.startY = clientY - this.panY;
  }

  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    this.panX = clientX - this.startX;
    this.panY = clientY - this.startY;
  }

  stopDrag() {
    this.isDragging = false;
  }

  saveAdjustedImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // We'll create a 400x400 output
      canvas.width = 400;
      canvas.height = 400;

      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate based on current zoom and pan
        // This is a simplified version: we draw the image onto the canvas 
        // with the transformations applied.
        const size = 400;
        const scale = this.zoomLevel;
        
        ctx.save();
        ctx.translate(size / 2 + this.panX, size / 2 + this.panY);
        ctx.scale(scale, scale);
        
        // Draw image centered
        const aspect = img.width / img.height;
        let drawWidth, drawHeight;
        if (aspect > 1) {
          drawHeight = size;
          drawWidth = size * aspect;
        } else {
          drawWidth = size;
          drawHeight = size / aspect;
        }
        
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();

        const croppedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        this.authService.updateProfile({ avatar: croppedBase64 });
        this.showCropModal = false;
        this.tempImage = null;
      }
    };
    img.src = this.tempImage!;
  }

  closeCropModal() {
    this.showCropModal = false;
    this.tempImage = null;
  }

  loadUploads() {
    const imagesJson = localStorage.getItem('my_gallery_images');
    this.uploadedImages = imagesJson ? JSON.parse(imagesJson) : [];
    this.stats.uploads = this.uploadedImages.length;
  }

  loadLikedImages() {
    const savedLikes = JSON.parse(localStorage.getItem('gallerie_likes') || '{}');
    const likedIds = Object.keys(savedLikes);
    this.stats.likes = likedIds.length;

    if (likedIds.length > 0) {
      this.isLoadingLiked = true;
      this.unsplashService.getImages(1, 10).subscribe({
        next: (images) => {
          this.likedImages = images.slice(0, Math.min(images.length, likedIds.length));
          this.isLoadingLiked = false;
        },
        error: () => this.isLoadingLiked = false
      });
    }
  }

  switchTab(tab: 'uploads' | 'liked') {
    this.activeTab = tab;
  }

  openModal(image: UnsplashImage) {
    this.selectedImage = image;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedImage = null;
    document.body.style.overflow = 'auto';
  }
}

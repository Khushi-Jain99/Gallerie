import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-gallery.component.html',
  styleUrl: './my-gallery.component.css'
})
export class MyGalleryComponent implements OnInit {
  images: any[] = [];
  isLoading: boolean = false;

  constructor() {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.isLoading = true;
    
    // Simulate loading for better UX
    setTimeout(() => {
      const imagesJson = localStorage.getItem('my_gallery_images');
      this.images = imagesJson ? JSON.parse(imagesJson) : [];
      this.isLoading = false;
    }, 500);
  }

  deleteImage(index: number) {
    if (confirm('Are you sure you want to delete this image?')) {
      this.images.splice(index, 1);
      localStorage.setItem('my_gallery_images', JSON.stringify(this.images));
    }
  }
}

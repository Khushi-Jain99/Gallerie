import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadedUrl: string | null = null;

  title: string = '';
  description: string = '';

  isUploading: boolean = false;
  message: string = '';
  isError: boolean = false;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.message = '';
      this.isError = false;
      this.uploadedUrl = null;
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      this.message = 'Please select an image first.';
      this.isError = true;
      return;
    }

    if (!this.title.trim()) {
      this.message = 'Please provide a title for your image.';
      this.isError = true;
      return;
    }

    this.isUploading = true;
    this.message = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', environment.cloudinaryUploadPreset);

    const cloudName = environment.cloudinaryCloudName;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    this.http.post(url, formData).subscribe({
      next: (response: any) => {
        this.uploadedUrl = response.secure_url;
        this.message = 'Upload successful!';
        this.isError = false;
        this.isUploading = false;
        this.saveToLocalStorage(this.uploadedUrl!, this.title, this.description);
        this.resetForm();
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.message = 'Upload failed. Check your Cloudinary configuration.';
        this.isError = true;
        this.isUploading = false;
      }
    });
  }

  saveToLocalStorage(url: string, title: string, description: string) {
    const imagesJson = localStorage.getItem('my_gallery_images');
    let images = imagesJson ? JSON.parse(imagesJson) : [];

    const newImage = {
      url,
      title,
      description,
      createdAt: new Date().toISOString()
    };

    images.unshift(newImage); // Add to the beginning
    localStorage.setItem('my_gallery_images', JSON.stringify(images));
  }

  resetForm() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.title = '';
    this.description = '';
  }
}

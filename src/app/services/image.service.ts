import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GalleryImage {
  _id?: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  userId: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImage(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getPublicImages(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.apiUrl}/images`);
  }

  getUserImages(userId: string): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.apiUrl}/my-images?userId=${userId}`);
  }
}

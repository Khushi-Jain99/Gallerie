import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    full: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    download: string;
  };
  alt_description: string;
  likes: number;
}

export interface UnsplashSearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  private apiUrl = 'https://api.unsplash.com';
  private accessKey = environment.unsplashApiKey;

  constructor(private http: HttpClient) {}

  getImages(page: number = 1, perPage: number = 20): Observable<UnsplashImage[]> {
    const params = new HttpParams()
      .set('client_id', this.accessKey)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<UnsplashImage[]>(`${this.apiUrl}/photos`, { params });
  }

  searchImages(query: string, page: number = 1, perPage: number = 20): Observable<UnsplashSearchResponse> {
    const params = new HttpParams()
      .set('client_id', this.accessKey)
      .set('query', query)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<UnsplashSearchResponse>(`${this.apiUrl}/search/photos`, { params });
  }
}

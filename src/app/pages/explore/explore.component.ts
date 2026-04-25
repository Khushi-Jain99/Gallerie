import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnsplashService, UnsplashImage } from '../../services/unsplash.service';
import { ImageCardComponent } from '../../components/image-card/image-card.component';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCardComponent, ImageModalComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit, OnDestroy {
  images: UnsplashImage[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  isLoading: boolean = false;
  selectedImage: UnsplashImage | null = null;
  private searchSubject = new Subject<string>();
  private scrollSubject = new Subject<void>();

  constructor(private unsplashService: UnsplashService) {}

  ngOnInit() {
    this.loadImages();

    // Search debounce
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(query => {
      console.log(`New search query: "${query}". Resetting state.`);
      this.searchQuery = query;
      this.currentPage = 1;
      this.images = [];
      if (query) {
        this.performSearch();
      } else {
        this.loadImages();
      }
    });

    // Scroll debounce
    this.scrollSubject.pipe(
      debounceTime(200)
    ).subscribe(() => {
      this.checkScroll();
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
    this.scrollSubject.complete();
  }

  loadImages() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    console.log(`[API Call] Fetching photos for page: ${this.currentPage}`);
    
    this.unsplashService.getImages(this.currentPage).subscribe({
      next: (data) => {
        this.images = [...this.images, ...data];
        this.isLoading = false;
        console.log(`[Success] Fetched ${data.length} photos. Total images: ${this.images.length}`);
      },
      error: (err) => {
        console.error('[Error] Failed to fetch images', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  performSearch() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    console.log(`[API Call] Searching for "${this.searchQuery}" - page: ${this.currentPage}`);
    
    this.unsplashService.searchImages(this.searchQuery, this.currentPage).subscribe({
      next: (response) => {
        this.images = [...this.images, ...response.results];
        this.isLoading = false;
        console.log(`[Success] Found ${response.results.length} results. Total images: ${this.images.length}`);
      },
      error: (err) => {
        console.error('[Error] Search failed', err);
        this.isLoading = false;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollSubject.next();
  }

  checkScroll() {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Trigger when 300px from bottom
    const threshold = 300;
    const isNearBottom = (windowHeight + scrollY) >= (documentHeight - threshold);

    if (isNearBottom && !this.isLoading) {
      this.currentPage++;
      console.log(`[Scroll] Near bottom detected. Moving to page: ${this.currentPage}`);
      if (this.searchQuery) {
        this.performSearch();
      } else {
        this.loadImages();
      }
    }
  }

  openModal(image: UnsplashImage) {
    this.selectedImage = image;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedImage = null;
    document.body.style.overflow = 'auto';
  }

  trackByFn(index: number, item: UnsplashImage) {
    return item.id;
  }
}

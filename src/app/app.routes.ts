import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { MyGalleryComponent } from './pages/my-gallery/my-gallery.component';
import { UploadComponent } from './pages/upload/upload.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'my-gallery', component: MyGalleryComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];

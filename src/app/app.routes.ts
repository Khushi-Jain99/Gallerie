import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { MyGalleryComponent } from './pages/my-gallery/my-gallery.component';
import { UploadComponent } from './pages/upload/upload.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'my-gallery', 
    component: MyGalleryComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'upload', 
    component: UploadComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];

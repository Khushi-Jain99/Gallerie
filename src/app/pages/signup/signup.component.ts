import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: '../login/login.component.css' // Reuse login styles
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.authService.signup(this.name, this.email, this.password)) {
      this.router.navigate(['/profile']);
    } else {
      this.error = 'Email already exists. Please login instead.';
    }
  }
}

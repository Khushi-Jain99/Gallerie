import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  location?: string;
  handle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor(private router: Router) {
    this.loadUser();
  }

  private loadUser() {
    const savedUser = localStorage.getItem('gallerie_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  login(email: string, password: string): boolean {
    // Mock login logic
    const users = JSON.parse(localStorage.getItem('gallerie_registered_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const { password, ...userWithoutPassword } = user;
      this.currentUser.set(userWithoutPassword);
      localStorage.setItem('gallerie_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  }

  signup(name: string, email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('gallerie_registered_users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      return false; // User already exists
    }

    const newUser: any = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      bio: 'New member of Gallerie community.',
      location: 'Earth',
      handle: '@' + name.toLowerCase().replace(/\s+/g, '_')
    };

    users.push(newUser);
    localStorage.setItem('gallerie_registered_users', JSON.stringify(users));
    
    // Auto login
    const { password: pw, ...userWithoutPassword } = newUser;
    this.currentUser.set(userWithoutPassword);
    localStorage.setItem('gallerie_user', JSON.stringify(userWithoutPassword));
    
    return true;
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('gallerie_user');
    this.router.navigate(['/login']);
  }

  updateProfile(updatedUser: Partial<User>) {
    const current = this.currentUser();
    if (current) {
      const newUser = { ...current, ...updatedUser };
      this.currentUser.set(newUser);
      localStorage.setItem('gallerie_user', JSON.stringify(newUser));
      
      // Update in registered users list too
      const users = JSON.parse(localStorage.getItem('gallerie_registered_users') || '[]');
      const index = users.findIndex((u: any) => u.id === current.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        localStorage.setItem('gallerie_registered_users', JSON.stringify(users));
      }
    }
  }
}

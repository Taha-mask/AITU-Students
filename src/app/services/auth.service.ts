import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Promise<boolean> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        // Mock user data
        const user: User = {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: email,
          phone: '1234567890',
          role: 'administrative',
          token: 'mock-jwt-token'
        };

        // Store user details and token in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        resolve(true);
      }, 1000);
    });
  }

  register(user: Omit<User, 'id' | 'token'>): Promise<boolean> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        console.log('Registered user:', user);
        resolve(true);
      }, 1000);
    });
  }

  logout() {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.token;
  }

  getToken(): string | null {
    const user = this.currentUserValue;
    return user?.token || null;
  }
}

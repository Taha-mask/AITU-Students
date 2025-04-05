import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  async onSubmit() {
    this.loading = true;
    this.error = '';

    try {
      const success = await this.authService.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.error = 'Invalid email or password';
      }
    } catch (err) {
      this.error = 'An error occurred during login';
      console.error('Login error:', err);
    } finally {
      this.loading = false;
    }
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}

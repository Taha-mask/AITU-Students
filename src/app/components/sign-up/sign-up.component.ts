import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;
  loading: boolean = false;
  error: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  // Getter methods for form controls
  get f() { return this.signupForm.controls; }

  async onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const success = await this.authService.register({
        firstName: this.f['firstName'].value,
        lastName: this.f['lastName'].value,
        email: this.f['email'].value,
        phone: this.f['phone'].value,
        password: this.f['password'].value,
        role: this.f['role'].value
      });

      if (success) {
        this.router.navigate(['/login']);
      } else {
        this.error = 'Registration failed';
      }
    } catch (err) {
      this.error = 'An error occurred during registration';
      console.error('Registration error:', err);
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Helper methods for error messages
  getErrorMessage(controlName: string): string {
    const control = this.f[controlName];
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return `${controlName} is required`;
    if (errors['email']) return 'Invalid email address';
    if (errors['minlength']) return `${controlName} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['pattern']) {
      if (controlName === 'password') {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
      if (controlName === 'phone') {
        return 'Phone number must be exactly 11 digits';
      }
    }
    if (errors['mismatch']) return 'Passwords do not match';
    
    return '';
  }
}

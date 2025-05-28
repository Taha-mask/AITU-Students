import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/firebase.service';
import { Student } from '../../interfaces/student';
import { TranslationService } from '../../services/translation.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  student: Student =
      {
        code: '123456',
        name: 'John Doe',
        phone: '1234567890',
        state: 'California',
        address: '123 Main St, Los Angeles, CA',
        nationalID: '987654321',
      }


  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    public translationService: TranslationService
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  async onSubmit() {

    if (this.loginForm.invalid) {
      return;
    
    }

    this.loading = true;
    this.error = '';

    try {
      const success = await this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
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

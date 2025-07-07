import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule     
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginCredentials = {
    username: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.errorMessage = '';
    this.authService.login(this.loginCredentials).subscribe({
      next: () => {
        if (this.authService.hasRole('Owner')) {
          this.router.navigate(['/admin']);
        } else {
          this.errorMessage = 'Access Denied. Currently only the admin login is allowed. Please wait for the staff login feature to be implemented.';
          this.authService.logout();
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password. Please try again.';
        console.error('Login failed:', err);
      }
    });
  }
}
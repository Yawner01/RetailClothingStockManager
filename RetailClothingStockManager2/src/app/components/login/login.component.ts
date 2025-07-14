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
        //Check for 'Owner' role
        if (this.authService.hasRole('Owner')) {
          this.router.navigate(['/admin']);
        } 
        // Path for 'Staff' role
        else if (this.authService.hasRole('Staff')) {
          this.router.navigate(['/staff']);
        } 
        // Inactive accounts
        else {
          this.errorMessage = 'Access Denied. Your account role does not permit login.';
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
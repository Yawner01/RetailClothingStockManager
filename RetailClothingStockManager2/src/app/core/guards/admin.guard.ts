import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.hasRole('Owner')) {
      return true; // Access granted
    } else {
      // If not an owner, send them back to the login page.
      this.router.navigate(['/login']);
      return false;
    }
  }
}
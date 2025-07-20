import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // This will hold the user's role after they log in, e.g., 'Owner' or 'Staff'.
  currentUserRole: string | null = null;
  currentUserUsername: string | null = null;

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/Auth/login`, credentials).pipe(
      tap(response => {
        if (response && response.role) {
          this.currentUserRole = response.role;
          this.currentUserUsername = response.username;
        }
      })
    );
  }

  logout() {
    this.currentUserRole = null;
    this.currentUserUsername = null;
    this.router.navigate(['/login']);
  }


  //Checks if a user is currently logged in.
  isLoggedIn(): boolean {
    return this.currentUserRole !== null;
  }

  //Checks if the current user has a specific role.
  hasRole(role: string): boolean {
    return this.currentUserRole === role;
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  userId: number;
  username: string;
  role: string;
  isEditing?: boolean; // Used to toggle the edit UI for a specific user
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiBaseUrl = 'http://localhost:5212/api'

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiBaseUrl}/Users`);
  }

  //Sends an update request for a specific user.

  updateUser(user: User): Observable<any> {
    //The request body only includes the properties that can be changed.
    const updatePayload = {
      username: user.username,
      role: user.role
    };
    return this.http.put(`${this.apiBaseUrl}/Users/${user.userId}`, updatePayload);
  }

  //Sends a delete request for a specific user.

  deleteUser(userId: number): Observable<any> {
    console.log('UserService: Deleting user...', userId);
    return new Observable(observer => observer.next({})); //need to add
  }
}
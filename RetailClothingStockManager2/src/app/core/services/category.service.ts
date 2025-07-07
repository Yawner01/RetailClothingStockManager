import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
    categoryId: number;
    catagoryName: string; 
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiBaseUrl = 'http://localhost:5212/api';

  constructor(private http: HttpClient) { }

//Fetches all product categories from the backend.

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiBaseUrl}/Categories`);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../core/services/user.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { HttpClient } from '@angular/common/http';
import { AnalyticsDashboardComponent } from '../analytics-dashboard/analytics-dashboard.component';

export interface Product {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
  status: string;
  category?: Category;
  isEditing?: boolean;
}
export interface Alert {
  alertId: number;
  productId: number;
  timestamp: string;
  status: string;
  product: Product;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AnalyticsDashboardComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  //FIlter properties 
  filteredProducts: Product[] = [];
  selectedCategoryId: number = 0;

  //Alert properties
  alerts: Alert[] = [];
  isLoadingAlerts = true;

  //User properties
  users: User[] = [];
  private userEditCache: { [key: number]: User } = {};

  //Product properties
  products: Product[] = [];
  private productEditCache: { [key: number]: Product } = {};

  //Category properties
  categories: Category[] = [];

  //State management
  isLoadingUsers = true;
  isLoadingCategories = true;
  isLoadingProducts = true;
  isAddProductVisible = false;

  isAddUserVisible = false;
  newUser = {
    username: '',
    password: '',
    role: 'Staff' // Default role for new users
  }

  //Form model
  newProduct = { name: '', price: 0, quantity: 0, categoryId: 0, status: 'In Stock' };

  private apiBaseUrl = 'http://localhost:5212/api';

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.getUsers();
    this.getCategories();
    this.getProducts();
    this.getAlerts();
  }

  //User Management
  getUsers(): void { this.isLoadingUsers = true; this.userService.getUsers().subscribe({ next: (data) => { this.users = data.map(user => ({ ...user, isEditing: false })); this.isLoadingUsers = false; }, error: (err) => { console.error('Error fetching users:', err); this.isLoadingUsers = false; } }); }
  startEdit(user: User): void { this.userEditCache[user.userId] = { ...user }; user.isEditing = true; }
  cancelEdit(user: User): void { Object.assign(user, this.userEditCache[user.userId]); user.isEditing = false; delete this.userEditCache[user.userId]; }
  saveUser(user: User): void { this.userService.updateUser(user).subscribe({ next: () => { user.isEditing = false; delete this.userEditCache[user.userId]; }, error: (err) => { console.error('Error updating user:', err); } }); }

   addUser(): void {
    if (!this.newUser.username || !this.newUser.password) {
      alert('Username and password are required.');
      return;
    }
    this.http.post(`${this.apiBaseUrl}/Users`, this.newUser).subscribe({
      next: () => {
        this.isAddUserVisible = false;
        this.getUsers();
        this.newUser = { username: '', password: '', role: 'Staff' };
      },
      error: (err) => {
        console.error('Error adding user:', err);
        alert(err.error || 'Failed to add user.');
      }
    });
  }

  //Category Management
  getCategories(): void { this.isLoadingCategories = true; this.categoryService.getCategories().subscribe({ next: (data) => { this.categories = data; this.isLoadingCategories = false; }, error: (err) => { console.error('Error fetching categories:', err); this.isLoadingCategories = false; } }); }

  //Product Management
  getProducts(): void {
    this.isLoadingProducts = true;
    this.http.get<Product[]>(`${this.apiBaseUrl}/Products`).subscribe({
      next: (data) => {
        this.products = data.map(product => ({ ...product, isEditing: false }));
        this.applyFilter(); //Applying filter options after getting data
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isLoadingProducts = false;
      }
    });
  }

  showAddProductForm(): void {
    this.isAddProductVisible = true;
  }

  addProduct(): void {
    if (!this.newProduct.name || this.newProduct.price <= 0 || this.newProduct.quantity < 0 || this.newProduct.categoryId === 0) {
      alert('Please fill out all fields and select a valid category.');
      return;
    }
    this.http.post(`${this.apiBaseUrl}/Products`, this.newProduct).subscribe({
      next: () => {
        this.isAddProductVisible = false;
        this.getProducts();
        this.newProduct = { name: '', price: 0, quantity: 0, categoryId: 0, status: 'In Stock' };
      },
      error: (err) => {
        console.error('Error adding product:', err);
        alert('Failed to add product.');
      }
    });
  }

  startEditProduct(product: Product): void {
    this.productEditCache[product.productId] = { ...product };
    product.isEditing = true;
  }

  cancelEditProduct(product: Product): void {
    Object.assign(product, this.productEditCache[product.productId]);
    product.isEditing = false;
    delete this.productEditCache[product.productId];
  }

  saveProduct(product: Product): void {
    const updatePayload = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId,
      status: product.status
    };
    this.http.put(`${this.apiBaseUrl}/Products/${product.productId}`, updatePayload).subscribe({
      next: () => {
        product.isEditing = false;
        delete this.productEditCache[product.productId];
        this.getProducts();
      },
      error: (err) => {
        console.error('Error updating product:', err);
      }
    });
  }

  //New filter methods 
  applyFilter(): void {
    if (this.selectedCategoryId == 0) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.categoryId == this.selectedCategoryId);
    }
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  getAlerts(): void {
    this.isLoadingAlerts = true;
    this.http.get<Alert[]>(`${this.apiBaseUrl}/Alerts`).subscribe({
      next: (data) => {
        this.alerts = data;
        this.isLoadingAlerts = false;
      },
      error: (err) => {
        console.error('Error fetching alerts:', err);
        this.isLoadingAlerts = false;
      }
    });
  }

  handleAlert(alert: Alert, newStatus: 'Acknowledged' | 'Rejected'): void {
    this.http.put(`${this.apiBaseUrl}/Alerts/${alert.alertId}/status`, { status: newStatus }).subscribe({
      next: () => {
        this.alerts = this.alerts.filter(a => a.alertId !== alert.alertId);
      },
      error: (err) => {
        console.error(`Error updating alert ${alert.alertId} to ${newStatus}:`, err);
      }
    });
  }
}
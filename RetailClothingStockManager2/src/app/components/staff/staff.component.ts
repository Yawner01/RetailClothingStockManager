import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../core/services/user.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { HttpClient } from '@angular/common/http';
import { AnalyticsDashboardComponent } from '../analytics-dashboard/analytics-dashboard.component';
import { environment } from '../../../environments/environment';

export interface Product {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
  status: string;
  category?: Category;
  isEditing?: boolean;
  isRequested?: boolean;
}

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, AnalyticsDashboardComponent],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  //FIlter properties 
  filteredProducts: Product[] = [];
  selectedCategoryId: number = 0;

  //Product properties
  products: Product[] = [];
  private productEditCache: { [key: number]: Product } = {};

  //Category properties
  categories: Category[] = [];

  isLoadingCategories = true;
  isLoadingProducts = true;
  isAddProductVisible = false;

  //Form model
  newProduct = { name: '', price: 0, quantity: 0, categoryId: 0, status: 'In Stock' };

  private apiBaseUrl = 'http://localhost:5212/api'

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.getCategories();
    this.getProducts();
  }

  //Category Management
  getCategories(): void { this.isLoadingCategories = true; this.categoryService.getCategories().subscribe({ next: (data) => { this.categories = data; this.isLoadingCategories = false; }, error: (err) => { console.error('Error fetching categories:', err); this.isLoadingCategories = false; } }); }

  //Product Management
  getProducts(): void {
    this.isLoadingProducts = true;
    this.http.get<Product[]>(`${this.apiBaseUrl}/Products`).subscribe({
      next: (data) => {
        this.products = data.map(product => ({ ...product, isEditing: false }));
        this.applyFilter();
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isLoadingProducts = false;
      }
    });
  }
  requestStock(product: Product): void {
    product.isRequested = true; 
    
    this.http.post(`${this.apiBaseUrl}/Alerts`, product.productId).subscribe({
      next: () => {
        console.log(`Stock request sent for ${product.name}`);
      },
      error: (err) => {
        console.error('Error sending stock request:', err);
        product.isRequested = false;
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
}
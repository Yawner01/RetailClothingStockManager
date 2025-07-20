import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { environment } from '../../../environments/environment';


export interface Product {
  productId: number;
  name: string;
  categoryId: number;
  quantity: number;
}

export interface Category {
  categoryId: number;
  catagoryName: string;
}

export interface AnalyticsSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  lowStockAlerts: number;
  lowestStockItems: Product[]; 
  stockPerCategory: { categoryName: string; totalQuantity: number; }[];
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  
  @Input() userRole: 'Owner' | 'Staff' | '' = '';

  summary: AnalyticsSummary | null = null;
  isLoading = true;
  activeView: 'stock' | 'users' = 'stock';

 //FIltering properties
  allProducts: Product[] = [];
  allCategories: Category[] = [];
  filteredLowestStockItems: Product[] = [];
  availableProductsForFilter: Product[] = [];
  selectedCategoryId: number = 0; // 0 for "All"
  selectedProductId: number = 0; // 0 for "All"

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSummary();
    this.fetchAllProducts(); 
    this.fetchAllCategories();
  }

  getSummary(): void {
    this.isLoading = true;
    this.http.get<AnalyticsSummary>(`${this.apiBaseUrl}/Analytics/summary`).subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoading = false;
        setTimeout(() => this.createPieChart(), 0);
      },
      error: (err) => {
        console.error('Error fetching analytics summary:', err);
        this.isLoading = false;
      }
    });
  }
  
  fetchAllProducts(): void {
    this.http.get<Product[]>(`${this.apiBaseUrl}/Products`).subscribe(data => {
      this.allProducts = data;
      this.availableProductsForFilter = this.allProducts;
      // Apply the initial filter once the full product list is available.
      this.applyFilters();
    });
  }

  fetchAllCategories(): void {
    this.http.get<Category[]>(`${this.apiBaseUrl}/Categories`).subscribe(data => {
      this.allCategories = data;
    });
  }

  onCategoryChange(): void {
    if (this.selectedCategoryId == 0) {
      this.availableProductsForFilter = this.allProducts;
    } else {
      this.availableProductsForFilter = this.allProducts.filter(p => p.categoryId == this.selectedCategoryId);
    }
    this.selectedProductId = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    let items = [...this.allProducts];

    // Filter by category if a specific category
    if (this.selectedCategoryId != 0) {
      items = items.filter(p => p.categoryId == this.selectedCategoryId);
    }

    // Further filter by product if a specific product
    if (this.selectedProductId != 0) {
      items = items.filter(p => p.productId == this.selectedProductId);
    }

    // Sort the final list by quantity to always show the lowest stock items at the top
    items.sort((a, b) => a.quantity - b.quantity);

    this.filteredLowestStockItems = items;
  }

  setView(view: 'stock' | 'users'): void {
    this.activeView = view;
    if (view === 'stock') {
      setTimeout(() => this.createPieChart(), 0);
    }
  }

  createPieChart(): void {
    if (!this.summary || !this.pieChartRef || !this.pieChartRef.nativeElement) {
      return;
    }
    const canvas = this.pieChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (canvas.chart) { canvas.chart.destroy(); }
    canvas.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.summary.stockPerCategory.map(item => item.categoryName),
        datasets: [{
          label: 'Stock Quantity',
          data: this.summary.stockPerCategory.map(item => item.totalQuantity),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Stock Quantity by Category' } } }
    });
  }
}
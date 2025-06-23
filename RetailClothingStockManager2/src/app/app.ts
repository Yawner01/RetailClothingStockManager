import { Component, OnInit } from '@angular/core'; // <-- Add OnInit
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false,
})
export class App implements OnInit { 
  title = 'Retail Stock Manager';

  products: any[] = [];
  
  newProduct = {
    name: '',
    price: 0,
    quantity: 0,
    categoryId: 1, //default to category 1 for now
    status: 'In Stock'
  };

  isAddProductVisible = false;

  private apiBaseUrl = 'http://localhost:5212/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getProducts();
  }

  showAddProductForm() {
    this.isAddProductVisible = true;
  }

  addProduct() {
    // validation
    if (!this.newProduct.name || this.newProduct.price <= 0 || this.newProduct.quantity <= 0) {
      alert('Please fill out all fields with valid values.');
      return;
    }

    this.http.post(`${this.apiBaseUrl}/Products`, this.newProduct)
      .subscribe({
        next: (response) => {
          console.log('Product added successfully!', response);
          this.isAddProductVisible = false;
          this.getProducts(); //refresh the product list
          this.newProduct = { name: '', price: 0, quantity: 0, categoryId: 1, status: 'In Stock' };
        },
        error: (err) => {
            console.error('Error adding product:', err);
            alert('Failed to add product. Check the console (F12) for more details.');
        }
      });
  }

  getProducts() {
    this.http.get<any[]>(`${this.apiBaseUrl}/Products`)
      .subscribe({
        next: (data) => {
          this.products = data;
          console.log('Products fetched:', this.products);
        },
        error: (err) => {
            console.error('Error fetching products:', err);
            alert('Failed to fetch products. Is the API running? Check the console (F12).');
        }
      });
  }
}
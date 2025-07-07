import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing-module';

// Bootstrap the root AppComponent and provide services application-wide
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), 
    provideHttpClient() 
  ]
}).catch(err => console.error(err));
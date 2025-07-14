import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { StaffComponent } from './components/staff/staff.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'staff', 
    component: StaffComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin', 
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: '/login' }
];
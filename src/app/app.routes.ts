import { Routes } from '@angular/router';

export const routes: Routes = [
  // Rute default (kosong) akan redirect ke halaman login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Rute untuk Login Page
  { path: 'login', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  // Rute untuk modul Employee, akan di-lazy load
  {
    path: 'employee',
    loadChildren: () => import('./employee/employee-module').then(m => m.EmployeeModule)
  },
  // Rute wildcard untuk halaman tidak ditemukan (opsional)
  { path: '**', redirectTo: 'login' } // Atau buat komponen NotFoundPage jika diinginkan
];
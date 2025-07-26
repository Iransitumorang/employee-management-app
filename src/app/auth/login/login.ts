import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  username: string = 'iransitumorang';
  password: string = 'iransitumorang';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    // Simulasi delay login
    setTimeout(() => {
      // Hardcoded credentials
      if (this.username === 'iransitumorang' && this.password === 'iransitumorang') {
        // Simpan status login (bisa menggunakan localStorage atau service)
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/employee']);
      } else {
        this.errorMessage = 'Username atau password salah!';
      }
      this.isLoading = false;
    }, 1000);
  }
}

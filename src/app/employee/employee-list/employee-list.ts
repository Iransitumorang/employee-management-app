import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee, EmployeeSearchParams, PaginationParams } from '../models/employee.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  isLoading = false;
  
  searchParams: EmployeeSearchParams = {
    status: 'All Status'
  };
  sortBy = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  


  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    
    const paginationParams: PaginationParams = {
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    this.employeeService.getEmployees(this.searchParams, paginationParams)
      .subscribe({
        next: (response) => {
          this.employees = response.data;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.isLoading = false;
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.loadEmployees();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEmployees();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  onAddEmployee(): void {
    this.router.navigate(['/employee/add']);
  }

  onProfile(): void {
    Swal.fire({
      title: 'Profile Information',
      html: `
        <div style="text-align: left;">
          <p><strong>Name:</strong> Admin User</p>
          <p><strong>Role:</strong> Administrator</p>
          <p><strong>Email:</strong> admin@company.com</p>
          <p><strong>Last Login:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#667eea'
    });
  }

  onLogout(): void {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('isLoggedIn');
        this.router.navigate(['/login']);
      }
    });
  }

  onEditEmployee(employee: Employee): void {
    this.router.navigate(['/employee/edit', employee.id]);
  }

  onDeleteEmployee(employee: Employee): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${employee.firstName} ${employee.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(employee.id).subscribe({
          next: (success) => {
            if (success) {
              Swal.fire({
                title: 'Deleted!',
                text: `Employee ${employee.firstName} ${employee.lastName} has been deleted.`,
                icon: 'success',
                confirmButtonColor: '#28a745',
                timer: 3000,
                timerProgressBar: true
              });
              this.loadEmployees();
            }
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete employee. Please try again.',
              icon: 'error',
              confirmButtonColor: '#dc3545'
            });
          }
        });
      }
    });
  }

  onViewDetail(employee: Employee): void {
    this.router.navigate(['/employee/detail', employee.id]);
  }

  private showNotificationMessage(message: string, type: 'success' | 'warning' | 'error'): void {
    Swal.fire({
      title: type === 'success' ? 'Success!' : type === 'warning' ? 'Warning!' : 'Error!',
      text: message,
      icon: type,
      timer: 3000,
      timerProgressBar: true
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(5, this.totalPages);
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    
    for (let i = 0; i < maxPages; i++) {
      pages.push(startPage + i);
    }
    
    return pages;
  }

  onFirstPage(): void {
    if (this.currentPage > 1) {
      this.onPageChange(1);
    }
  }

  onLastPage(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.totalPages);
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('id-ID');
  }

  get Math() {
    return Math;
  }
}

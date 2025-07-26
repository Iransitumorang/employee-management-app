import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee, EmployeeSearchParams, PaginationParams } from '../models/employee.model';

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
  
  searchParams: EmployeeSearchParams = {};
  sortBy = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  showNotification = false;
  notificationMessage = '';
  notificationType = '';

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

  onEditEmployee(employee: Employee): void {
    this.showNotificationMessage(`Edit employee ${employee.firstName} ${employee.lastName}`, 'warning');
  }

  onDeleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: (success) => {
          if (success) {
            this.showNotificationMessage(`Employee ${employee.firstName} ${employee.lastName} deleted successfully`, 'error');
            this.loadEmployees();
          }
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        }
      });
    }
  }

  onViewDetail(employee: Employee): void {
    this.router.navigate(['/employee/detail', employee.id]);
  }

  private showNotificationMessage(message: string, type: 'success' | 'warning' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
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

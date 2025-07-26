import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  imports: [CommonModule],
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.scss'
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = false;
  error = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.isLoading = true;
    this.error = '';

    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (isNaN(id)) {
      this.error = 'Invalid employee ID';
      this.isLoading = false;
      return;
    }

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employee = employee || null;
        if (!employee) {
          this.error = 'Employee not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.error = 'Error loading employee details';
        this.isLoading = false;
      }
    });
  }

  onOk(): void {
    this.router.navigate(['/employee']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}

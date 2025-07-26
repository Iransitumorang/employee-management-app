import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-add-edit-employee',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-employee.html',
  styleUrl: './add-edit-employee.scss'
})
export class AddEditEmployeeComponent implements OnInit {
  employee: Partial<Employee> = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    birthDate: new Date(),
    basicSalary: 0,
    status: 'Active',
    group: '',
    description: new Date()
  };

  groups: string[] = [];
  filteredGroups: string[] = [];
  showGroupDropdown = false;
  groupSearchText = '';
  
  isLoading = false;
  errors: { [key: string]: string } = {};

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.filteredGroups = this.groups;
  }

  loadGroups(): void {
    this.employeeService.getGroups().subscribe(groups => {
      this.groups = groups;
      this.filteredGroups = groups;
    });
  }

  onGroupSearch(): void {
    if (this.groupSearchText.trim() === '') {
      this.filteredGroups = this.groups;
    } else {
      this.filteredGroups = this.groups.filter(group =>
        group.toLowerCase().includes(this.groupSearchText.toLowerCase())
      );
    }
    this.showGroupDropdown = true;
  }

  onGroupSelect(group: string): void {
    this.employee.group = group;
    this.groupSearchText = group;
    this.showGroupDropdown = false;
  }

  onGroupInputFocus(): void {
    this.showGroupDropdown = true;
    this.filteredGroups = this.groups;
  }

  onGroupInputBlur(): void {
    setTimeout(() => {
      this.showGroupDropdown = false;
    }, 200);
  }

  validateForm(): boolean {
    this.errors = {};

    if (!this.employee.username?.trim()) {
      this.errors['username'] = 'Username is required';
    }

    if (!this.employee.firstName?.trim()) {
      this.errors['firstName'] = 'First name is required';
    }

    if (!this.employee.lastName?.trim()) {
      this.errors['lastName'] = 'Last name is required';
    }

    if (!this.employee.email?.trim()) {
      this.errors['email'] = 'Email is required';
    } else if (!this.isValidEmail(this.employee.email)) {
      this.errors['email'] = 'Please enter a valid email address';
    }

    if (!this.employee.birthDate) {
      this.errors['birthDate'] = 'Birth date is required';
    } else if (this.employee.birthDate > new Date()) {
      this.errors['birthDate'] = 'Birth date cannot be in the future';
    }

    if (!this.employee.basicSalary || this.employee.basicSalary <= 0) {
      this.errors['basicSalary'] = 'Basic salary must be greater than 0';
    }

    if (!this.employee.status?.trim()) {
      this.errors['status'] = 'Status is required';
    }

    if (!this.employee.group?.trim()) {
      this.errors['group'] = 'Group is required';
    }

    return Object.keys(this.errors).length === 0;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSave(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    const newEmployee: Omit<Employee, 'id'> = {
      username: this.employee.username!,
      firstName: this.employee.firstName!,
      lastName: this.employee.lastName!,
      email: this.employee.email!,
      birthDate: this.employee.birthDate!,
      basicSalary: this.employee.basicSalary!,
      status: this.employee.status!,
      group: this.employee.group!,
      description: this.employee.description!
    };

    this.employeeService.addEmployee(newEmployee).subscribe({
      next: (employee) => {
        this.isLoading = false;
        alert(`Employee ${employee.firstName} ${employee.lastName} added successfully!`);
        this.router.navigate(['/employee']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error adding employee:', error);
        alert('Error adding employee. Please try again.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/employee']);
  }

  get maxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}

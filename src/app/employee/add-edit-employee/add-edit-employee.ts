import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';
import Swal from 'sweetalert2';

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
  isEditMode = false;
  employeeId: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.filteredGroups = this.groups;
    this.checkEditMode();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = Number(id);
      this.loadEmployee();
    }
  }

  private loadEmployee(): void {
    if (!this.employeeId) return;
    
    this.isLoading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        if (employee) {
          this.employee = { ...employee };
          this.groupSearchText = employee.group;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        Swal.fire('Error!', 'Failed to load employee data.', 'error');
        this.isLoading = false;
      }
    });
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

    if (this.isEditMode && this.employeeId) {
      // Update existing employee
      const updatedEmployee: Partial<Employee> = {
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

      this.employeeService.updateEmployee(this.employeeId, updatedEmployee).subscribe({
        next: (employee) => {
          this.isLoading = false;
          if (employee) {
            Swal.fire({
              title: 'Updated!',
              text: `Employee ${employee.firstName} ${employee.lastName} has been updated successfully.`,
              icon: 'success',
              confirmButtonColor: '#ffc107',
              timer: 3000,
              timerProgressBar: true
            });
            this.router.navigate(['/employee']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating employee:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update employee. Please try again.',
            icon: 'error',
            confirmButtonColor: '#ffc107'
          });
        }
      });
    } else {
      // Add new employee
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
          Swal.fire({
            title: 'Added!',
            text: `Employee ${employee.firstName} ${employee.lastName} has been added successfully.`,
            icon: 'success',
            confirmButtonColor: '#28a745',
            timer: 3000,
            timerProgressBar: true
          });
          this.router.navigate(['/employee']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error adding employee:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to add employee. Please try again.',
            icon: 'error',
            confirmButtonColor: '#28a745'
          });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/employee']);
  }

  get maxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}

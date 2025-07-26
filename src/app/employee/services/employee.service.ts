import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Employee, EmployeeSearchParams, PaginationParams } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [];
  private groups = [
    'IT Development',
    'IT Support',
    'Human Resources',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Customer Service',
    'Research & Development',
    'Quality Assurance'
  ];

  constructor() {
    this.generateDummyData();
  }

  private generateDummyData(): void {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    
    for (let i = 1; i <= 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const birthDate = new Date(1980 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
      
      this.employees.push({
        id: i,
        username: `user${i}`,
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        birthDate: birthDate,
        basicSalary: 3000000 + Math.floor(Math.random() * 10000000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        group: this.groups[Math.floor(Math.random() * this.groups.length)],
        description: new Date()
      });
    }
  }

  getEmployees(
    searchParams: EmployeeSearchParams = {},
    paginationParams: PaginationParams = { page: 1, pageSize: 10 }
  ): Observable<{ data: Employee[], total: number, page: number, pageSize: number }> {
    let filteredData = [...this.employees];

    // Apply search filters (AND logic)
    if (searchParams.fullName) {
      filteredData = filteredData.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchParams.fullName!.toLowerCase())
      );
    }
    if (searchParams.email) {
      filteredData = filteredData.filter(emp => 
        emp.email.toLowerCase().includes(searchParams.email!.toLowerCase())
      );
    }
    if (searchParams.group) {
      filteredData = filteredData.filter(emp => 
        emp.group.toLowerCase().includes(searchParams.group!.toLowerCase())
      );
    }
    if (searchParams.status && searchParams.status !== 'All Status') {
      filteredData = filteredData.filter(emp => 
        emp.status.toLowerCase() === searchParams.status!.toLowerCase()
      );
    }

    // Apply sorting
    if (paginationParams.sortBy) {
      filteredData.sort((a, b) => {
        const aValue = (a as any)[paginationParams.sortBy!];
        const bValue = (b as any)[paginationParams.sortBy!];
        
        if (aValue < bValue) return paginationParams.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return paginationParams.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    const startIndex = (paginationParams.page - 1) * paginationParams.pageSize;
    const endIndex = startIndex + paginationParams.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return of({
      data: paginatedData,
      total: filteredData.length,
      page: paginationParams.page,
      pageSize: paginationParams.pageSize
    }).pipe(delay(300)); // Simulate API delay
  }

  getEmployeeById(id: number): Observable<Employee | undefined> {
    const employee = this.employees.find(emp => emp.id === id);
    return of(employee).pipe(delay(200));
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    const newEmployee: Employee = {
      ...employee,
      id: Math.max(...this.employees.map(emp => emp.id)) + 1
    };
    this.employees.push(newEmployee);
    return of(newEmployee).pipe(delay(500));
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee | undefined> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...employee };
      return of(this.employees[index]).pipe(delay(500));
    }
    return of(undefined).pipe(delay(500));
  }

  deleteEmployee(id: number): Observable<boolean> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  getGroups(): Observable<string[]> {
    return of(this.groups);
  }
} 
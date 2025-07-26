export interface Employee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: string;
  group: string;
  description: Date;
}

export interface EmployeeSearchParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  group?: string;
  status?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 
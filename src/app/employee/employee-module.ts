import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmployeeRoutingModule } from './employee-routing-module';
import { EmployeeListComponent } from './employee-list/employee-list';
import { AddEditEmployeeComponent } from './add-edit-employee/add-edit-employee';
import { EmployeeDetailComponent } from './employee-detail/employee-detail';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EmployeeRoutingModule,
    EmployeeListComponent,
    AddEditEmployeeComponent,
    EmployeeDetailComponent
  ]
})
export class EmployeeModule { }

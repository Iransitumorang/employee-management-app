import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list';
import { AddEditEmployeeComponent } from './add-edit-employee/add-edit-employee';
import { EmployeeDetailComponent } from './employee-detail/employee-detail';

const routes: Routes = [
  // Rute default untuk /employee (akan menampilkan daftar karyawan)
  { path: '', component: EmployeeListComponent },
  // Rute untuk menambahkan karyawan
  { path: 'add', component: AddEditEmployeeComponent },
  // Rute untuk mengedit karyawan
  { path: 'edit/:id', component: AddEditEmployeeComponent },
  // Rute untuk melihat detail karyawan
  { path: 'detail/:id', component: EmployeeDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
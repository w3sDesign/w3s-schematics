import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerRootComponent } from './customer-root/customer-root.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';


// See https://angular.io/guide/router#milestone-3-heroes-feature

const customerRoutes: Routes = [

  { path: 'customers/:id', component: CustomerDetailComponent },
  { path: 'customers', component: CustomerListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(customerRoutes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }




 // {
  //   path: '',
  //   // component: CustomerRootComponent,
  //   component: CustomerListComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: CustomerListComponent,
  //       children: [
  //         {
  //           path: ':id',
  //           component: CustomerDetailComponent
  //         },
  //         // {
  //         //   path: '',
  //         //   component: CustomerHomeComponent
  //         // }
  //       ]
  //     },
  //     {
  //       path: ':id',
  //       component: CustomerDetailComponent
  //     },
  //   ]
  // }



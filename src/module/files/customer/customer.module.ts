import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { CustomerRootComponent } from './customer-root/customer-root.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent, CustomerDetailDialogComponent } from './customer-detail/customer-detail.component';
import { CustomerFilterTemplateComponent } from './customer-filter-template/customer-filter-template.component';
import { CustomerInMemoryDataService } from './model/customer-in-memory-data.service';
import { CustomerRoutingModule } from './customer-routing.module';

import { CustomerService } from './model/customer.service';
import { HttpCustomerService } from './model/http-customer.service';
import { MockCustomerService } from './model/mock-customer.service';

import { CustomerFilterTemplateService } from './model/customer-filter-template.service';
import { HttpCustomerFilterTemplateService } from './model/http-customer-filter-template.service';
// import { MockCustomerFilterTemplateService } from './model/http-customer-filter-template.service';

// SharedModule includes (must include) SharedMaterialModule.
import { SharedModule } from '../shared/shared.module';

import { environment } from '../../environments/environment';


@NgModule({

  imports: [
    CommonModule,
    HttpClientModule,

    //  The HttpClientInMemoryWebApiModule module intercepts
    //  HTTP requests and returns simulated server responses.
    //  Remove it when a real server is ready to receive requests.
    environment.production
      ? []
      : HttpClientInMemoryWebApiModule
        .forFeature(CustomerInMemoryDataService, {
          delay: 350,
          dataEncapsulation: false
        }),

    SharedModule,

    CustomerRoutingModule,
  ],

  declarations: [
    CustomerRootComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    CustomerDetailDialogComponent,
    CustomerFilterTemplateComponent,
  ],

  entryComponents: [
    CustomerDetailDialogComponent,
  ],

  providers: [

    // Choose the right implementation.
    // ################################################################
    // Application code refers to an interface and is independent of
    // an implementation. For example:
    //  CustomerService is the interface (100% abstract class).
    //  HttpCustomerService and MockCustomerService are different implementations.

    { provide: CustomerService, useClass: HttpCustomerService },

    // {provide: CustomerService, useClass: MockCustomerService},

    { provide: CustomerFilterTemplateService, useClass: HttpCustomerFilterTemplateService },

    // {provide: CustomerFilterTemplateService, useClass: MockCustomerFilterTemplateService},

    CustomerInMemoryDataService,
    // Is the same as:
    // {provide: CustomerInMemoryDataService, useClass: CustomerInMemoryDataService},

  ],

  exports: [
    // CustomerListComponent,
    // CustomerDetailComponent,
    // CustomerDetailDialogComponent,
  ]
})

export class CustomerModule { }

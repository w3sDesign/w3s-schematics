import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import {
  ActivatedRoute, ActivatedRouteStub, asyncData, click, newEvent
} from '../../../testing';

import { Customer } from '../model/customer';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { CustomerModule } from '../customer.module';
import { CustomerRoutingModule } from '../customer-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomerService, HttpCustomerService } from '../model/http-customer.service';
import { HttpErrorHandler } from 'src/app/shared/http-error-handler.service';


/** Testing Vars */
let component: CustomerDetailComponent;
let fixture: ComponentFixture<CustomerDetailComponent>;
let activatedRoute: ActivatedRouteStub;
// let page: Page;


describe('CustomerDetailComponent', () => {

  beforeEach(async(() => {
    const routerSpy = createRouterSpy();
    TestBed.configureTestingModule({
      imports: [
        CustomerModule,
        CustomerRoutingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: routerSpy },

        { provide: CustomerService, useClass: HttpCustomerService },
        { provide: HttpErrorHandler, useClass: HttpErrorHandler }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // ? expect(component).toBeDefined();
    // ? expect(component).not.toBeNull();
  });

});


/** Helpers */
function createRouterSpy() {
  return jasmine.createSpyObj('Router', ['navigate']);
}


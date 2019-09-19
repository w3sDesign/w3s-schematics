import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Router } from '@angular/router';

import {
  ActivatedRoute, ActivatedRouteStub, asyncData, click, newEvent
} from '../../../testing';

import { CustomerModule } from '../customer.module';
import { CustomerListComponent } from './customer-list.component';
import { CustomerService } from '../model/customer.service';

import { mockCustomers } from '../model/mock-customers';
import { MockCustomerService } from '../model/mock-customer.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



/** Testing Vars */
const customers = mockCustomers;
let component: CustomerListComponent;
let fixture: ComponentFixture<CustomerListComponent>;
let page: Page;



describe('CustomerListComponent', () => {

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [CustomerModule, BrowserAnimationsModule],
      providers: [
        { provide: CustomerService, useClass: MockCustomerService },
        { provide: Router, useValue: routerSpy },
      ]
    })
      .compileComponents()
      .then(createComponent);
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('1st customer should match 1st mock customer', () => {
    const expectedCustomer = customers[0];
    const actualCustomer = page.customerRows[0].textContent;
    expect(actualCustomer).toContain(expectedCustomer.id.toString(), 'customer.id');
    expect(actualCustomer).toContain(expectedCustomer.name, 'customer.name');
  });

  it('should select customer on click', fakeAsync(() => {
    const expectedCustomer = customers[1];
    const row = page.customerRows[1];
    row.dispatchEvent(newEvent('click'));
    tick();
    expect(component.selectedCustomer).toEqual(expectedCustomer);
  }));

  it('should navigate to the select customer detail on click', fakeAsync(() => {
    const expectedCustomer = customers[1];
    const row = page.customerRows[1];
    row.dispatchEvent(newEvent('click'));
    tick();

    // The navigation spy has been called at least once.
    expect(page.navSpy.calls.any()).toBe(true, 'navigate spy called');

    const navArgs = page.navSpy.calls.first().args[0];
    expect(navArgs[0])

  }));


});



/**
 * ####################################################################
 * Helpers
 * ####################################################################
 */

function createComponent() {
  fixture = TestBed.createComponent(CustomerListComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {

  customerRows: HTMLTableRowElement[];

  navSpy: jasmine.Spy;

  constructor() {

    const rowNodes = fixture.nativeElement.querySelector('tbody')
      .querySelectorAll('tr');
    this.customerRows = Array.from(rowNodes);

    const routerSpy = fixture.debugElement.injector.get(Router);
    this.navSpy = routerSpy.navigate as jasmine.Spy;
  }

}


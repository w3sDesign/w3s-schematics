import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  ActivatedRoute, ActivatedRouteStub, asyncData, click, newEvent
} from '../../../testing';

import { Customer } from '../model/customer';
import { CustomerRootComponent } from './customer-root.component';
import { CustomerModule } from '../customer.module';
import { CustomerRoutingModule } from '../customer-routing.module';

/** RouterOutletStubComponent */
@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent {}

/** Testing Vars */
let component: CustomerRootComponent;
let fixture: ComponentFixture<CustomerRootComponent>;
let activatedRoute: ActivatedRouteStub;
// let page: Page;


describe('CustomerRootComponent', () => {

  beforeEach(async(() => {
    const routerSpy = createRouterSpy();
    TestBed.configureTestingModule({
      imports: [
        CustomerModule,
        CustomerRoutingModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        RouterOutletStubComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: routerSpy },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


/** Helpers */
function createRouterSpy() {
  return jasmine.createSpyObj('Router', ['navigate']);
}



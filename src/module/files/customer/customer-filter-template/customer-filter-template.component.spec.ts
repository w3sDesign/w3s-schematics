import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFilterTemplateComponent } from './customer-filter-template.component';

describe('CustomerFilterTemplateComponent', () => {
  let component: CustomerFilterTemplateComponent;
  let fixture: ComponentFixture<CustomerFilterTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerFilterTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFilterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

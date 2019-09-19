import { TestBed } from '@angular/core/testing';

import { HttpCustomerFilterTemplateService } from './http-customer-filter-template.service';

describe('HttpCustomerFilterTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpCustomerFilterTemplateService = TestBed.get(HttpCustomerFilterTemplateService);
    expect(service).toBeTruthy();
  });
});

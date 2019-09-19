/**
 * Based on https://github.com/angular/in-memory-web-api
 * /src/app/hero.service.spec.ts
 *
 */

 import { async, TestBed } from '@angular/core/testing';

import { concatMap, tap, map } from 'rxjs/operators';


import { Customer } from './customer';
import { CustomerService } from './customer.service';



// import { failure } from '../testing';
export function failure(err: any) {
  fail(JSON.stringify(err));
}

/**
 * Common tests for the CustomerService, whether implemented with Http or HttpClient
 * Assumes that TestBed has been configured appropriately before created and run.
 *
 * Tests with extended test expirations accommodate the default (simulated) latency delay.
 * Ideally configured for short or no delay.
 */
export class CustomerServiceCoreSpec {

  run() {

    describe('CustomerService core', () => {

      let customerService: CustomerService;

      beforeEach(function() {
        customerService = TestBed.get(CustomerService);
      });

      // it('can get customers', async(() => {
      //   customerService.getCustomers()
      //     .subscribe(
      //     customers => {
      //       // console.log(customers);
      //       expect(customers.length).toBeGreaterThan(0, 'should have customers');
      //     },
      //     failure
      //     );
      // }));

      it('can get customer w/ id=1', async(() => {
        customerService.getCustomer(1)
          .subscribe(
          customer => {
            // console.log(customer);
            expect(customer.name).toBe('Windstorm');
          },
          () => fail('getCustomer failed')
          );
      }));

      // it('should 404 when customer id not found', async(() => {
      //   const id = 123456;
      //   customerService.getCustomer(id)
      //     .subscribe(
      //     () => fail(`should not have found customer for id='${id}'`),
      //     err => {
      //       expect(err.status).toBe(404, 'should have 404 status');
      //     }
      //     );
      // }));

      // it('can add a customer', async(() => {
      //   customerService.createCustomer('FunkyBob').pipe(
      //     tap(customer => {
      //       // console.log(customer);
      //       expect(customer.name).toBe('FunkyBob');
      //     }),
      //     // Get the new customer by its generated id
      //     concatMap(customer => customerService.getCustomer(customer.id)),
      //   ).subscribe(
      //     customer => {
      //       expect(customer.name).toBe('FunkyBob');
      //     },
      //     err => failure('re-fetch of new customer failed')
      //     );
      // }), 10000);

      // it('can delete a customer', async(() => {
      //   const id = 1;
      //   customerService.deleteCustomer(id)
      //     .subscribe(
      //     (_: {}) => {
      //       expect(_).toBeDefined();
      //     },
      //     failure
      //     );
      // }));

      // it('should allow delete of non-existent customer', async(() => {
      //   const id = 123456;
      //   customerService.deleteCustomer(id)
      //     .subscribe(
      //     (_: {}) => {
      //       expect(_).toBeDefined();
      //     },
      //     failure
      //     );
      // }));

      // it('can search for customers by name containing "a"', async(() => {
      //   customerService.searchCustomers('a')
      //     .subscribe(
      //     (customers: Customer[]) => {
      //       expect(customers.length).toBe(3, 'should find 3 customers with letter "a"');
      //     },
      //     failure
      //   );
      // }));

      // it('can update existing customer', async(() => {
      //   const id = 1;
      //   customerService.getCustomer(id).pipe(
      //     concatMap(customer => {
      //       customer.name = 'Thunderstorm';
      //       return customerService.updateCustomer(customer);
      //     }),
      //     concatMap(() => {
      //       return customerService.getCustomer(id);
      //     })
      //   ).subscribe(
      //     customer => {
      //       console.log(customer);
      //       expect(customer.name).toBe('Thunderstorm');
      //     },
      //     err => fail('re-fetch of updated customer failed')
      //     );
      // }), 10000);

      // it('should create new customer when try to update non-existent customer', async(() => {
      //   const falseCustomer = new Customer(12321, 'DryMan');

      //   customerService.updateCustomer(falseCustomer)
      //     .subscribe(
      //     customer => {
      //       expect(customer.name).toBe(falseCustomer.name);
      //     },
      //     failure
      //     );
      // }));

    });
 }
}

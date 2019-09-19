// C:\Users\gfranke\dev\angular\ang-http-client-7.1.4\src\app\heroes\heroes.service.spec.ts

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Customer } from './customer';
import { HttpCustomerService } from './http-customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { MessageService } from '../../shared/message.service';

import { mockCustomers } from '../model/mock-customers';
import { QueryResult } from '../../shared/query-result';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';

// const customers = mockCustomers;

/**
 * ####################################################################
 * HttpCustomerService
 * ####################################################################
 */
describe('HttpCustomerService:', () => {


  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let customerService: HttpCustomerService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  let testUrl: string;


  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    TestBed.configureTestingModule({
      // Import the HttpClient mocking services.
      imports: [HttpClientTestingModule],
      // Provide both the service-under-test and its (spy) dependencies.
      providers: [
        HttpCustomerService,
        { provide: MatSnackBar, useValue: spy }
        // HttpErrorHandler,
        // MessageService,
        // MatSnackBar,
        // Overlay
      ]
    });

    // Inject the http and test controller.
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    // Inject both the service-under-test and its (spy) dependencies.
    customerService = TestBed.get(HttpCustomerService);
    snackBarSpy = TestBed.get(MatSnackBar);

    testUrl = customerService.customersUrl;
  });


  afterEach(() => {
    // Verifying that no requests remain outstanding.
    httpTestingController.verify();
  });



  /**
   * ##################################################################
   * HttpCustomerService: Get customer by id:
   * ##################################################################
   */
  describe('Get customer by id: ', () => {

  });



  /**
   * ##################################################################
   * HttpCustomerServiceSpec: Get all customers (no QueryParams):
   * ##################################################################
   */
  describe('Get all customers (no QueryParams):', () => {
    // let expectedQueryResult: QueryResult;

    const expectedQueryResult = {
      items: mockCustomers,
      totalCount: 0,
      errorMessage: ''
    } as QueryResult;

    const emptyQueryResult = {
      items: [],
      totalCount: 0,
      errorMessage: ''
    } as QueryResult;

    const expectedQueryResult1 = {
      items: [mockCustomers[0]],
      totalCount: 1,
      errorMessage: ''
    } as QueryResult;

    const expectedQueryResult2 = {
      items: [mockCustomers[0], mockCustomers[1]],
      totalCount: 2,
      errorMessage: ''
    } as QueryResult;

    // beforeEach(() => {
    // });


    // it('Should return expected query result (called once)', () => {
    it('Should return expected customers (called once).', () => {

      customerService.getCustomers().subscribe(
        res => expect(res.items).toEqual(expectedQueryResult.items, 'should return expected customers'),
        fail
      );
      // CustomerService should have made one http request to GET customers.
      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');
      // Respond with expected customers.
      req.flush(expectedQueryResult.items);
    });


    it('Should be OK returning no customers.', () => {

      customerService.getCustomers().subscribe(
        res => expect(res.items.length).toEqual(0, 'should have empty customers array'),
        fail
      );
      const req = httpTestingController.expectOne(testUrl);
      // Respond with no customers.
      req.flush(emptyQueryResult.items);
    });


    it('Should turn 404 http error into empty QueryResult.', () => {

      const emsg = '404 Page Not Found error';
      customerService.getCustomers().subscribe(
        res => expect(res.items.length).toEqual(0, 'should return empty QueryResult'),
        fail
        // res => fail('should have failed'),
        // error => expect(error.message).toContain(emsg)
      );
      const req = httpTestingController.expectOne(testUrl);
      // Respond with 404 and the error message in the body.
      req.flush(emsg, { status: 404, statusText: 'Not Found' });

    });


    it('Should return expected customers (called multiple times).', () => {
      customerService.getCustomers().subscribe();
      customerService.getCustomers().subscribe();
      customerService.getCustomers().subscribe(
        res => expect(res.items).toEqual(expectedQueryResult.items, 'should return expected customers'),
        fail
      );
      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getCustomers()');
      // Respond to each request with different expected customer results
      requests[0].flush(emptyQueryResult.items);
      requests[1].flush(expectedQueryResult1.items);
      requests[2].flush(expectedQueryResult.items);
    });
  });


  /**
   * ##################################################################
   * HttpCustomerServiceSpec: Update customer:
   * ##################################################################
   */
  describe('UpdateCustomer:', () => {


    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${testUrl}/?id=${id}`;
    const customer: Customer = mockCustomers[0]; // { id: 1, name: 'A' };


    it('Should update a customer and return it.', () => {

      customerService.updateCustomer(customer).subscribe(
        res => expect(res).toEqual(jasmine.objectContaining({ id: res.id }), 'should return the customer'),
        fail
      );
      // CustomerService should have made one request to PUT customer
      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(customer);
      // Expect server to return the customer after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: customer });

      req.event(expectedResponse);
    });


    it('Should turn 404 error into return of the updated customer.', () => {

      const emsg = '404 Page Not Found error';
      customerService.updateCustomer(customer).subscribe(
        res => expect(res).toEqual(customer, 'should return the customer'),
        fail
        // res => fail('should have failed'),
        // (error: HttpErrorResponse) => {
        //   expect(error.status).toEqual(404, 'status');
        //   expect(error.error).toEqual(emsg, 'message');
      );
      const req = httpTestingController.expectOne(testUrl);
      // respond with a 404 and the error message in the body
      req.flush(emsg, { status: 404, statusText: 'Not Found' });
    });


  });


  // TODO: test other CustomerService methods

});

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { tap, mergeMap, catchError, switchMap } from 'rxjs/operators';

import { Customer } from './customer';
import { CustomerService } from './customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { HttpUtilsService } from '../../shared/http-utils.service';
import { MessageService } from '../../shared/message.service';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';


/**
 * Service for accessing and maintaining customers
 * on a remote http server (via HTTP REST API).
 * ####################################################################
 * Implements the CustomerService interface.
 *
 * - See also https://github.com/angular/in-memory-web-api/blob/master/src/app/http-client-hero.service.ts
 */

@Injectable()
export class HttpCustomerService extends CustomerService {

  /** Http REST API */
  private customersUrl = 'api/customers';

  /** Http Header for create/update/delete methods */
  private cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler,
    private httpUtils: HttpUtilsService,
    private messageService: MessageService,
  ) {
    super();
  }


  /**
   * Creating a customer on the remote http server.
   * ##################################################################
   *
   * HTTP POST - ?Response (with the generated customer.id) expected.
   */

  createCustomer(customer: Customer): Observable<Customer> {

    // ===============================================================
    // Client side auto generating customer id (should be done server side).
    // Remove this for real server implementation.
    // ===============================================================
    const queryParams = new QueryParams();
    queryParams.pageSize = 9999;
    //  queryParams.sortField = 'id';
    //  queryParams.sortOrder = 'desc';

    // Getting all customers.
    return this.getCustomers(queryParams)
      .pipe(
        switchMap(res => {
          // Returns the highest customer id + 1
          customer.id = Math.max(...res.items.map(item => item.id)) + 1;

          const message = `Customer with id = ${customer.id} and name = "${customer.name}" has been created.`;

          return this.http.post<Customer>(this.customersUrl, customer, this.cudOptions)
            .pipe(
              tap(() => this.showMessage(message)),
              tap(() => this.logMessage(`[createCustomer()] ${message}`)),
              catchError(this.handleError<Customer>(message.replace('has been', 'can not be'))),
            );
        })

      );





  }


  /**
   * Deleting a customer on the remote http server.
   * ##################################################################
   * Returns an empty object.
   *
   * HTTP DELETE - Null response expected.
   */

  deleteCustomer(id: number): Observable<{}> {

    const message = `Customer ${id} deleted.`;

    return this.http.delete(this.customersUrl + `/${id}`, this.cudOptions)
      .pipe(
        tap(() => this.showMessage(message)),
        tap(() => this.logMessage(message)),
        catchError(this.handleError<Customer>(`Customer ${id} can not be deleted.`)),
      );
  }


  /**
   * Deleting multiple customers with the selected ids.
   * ##################################################################
   * Returns an empty object.
   *
   * HTTP DELETE - Null response expected.
   */

  deleteCustomers(ids: number[] = []): Observable<any> {

    const message = ids.length > 1 ?
      `Selected ${ids.length} customers deleted.` :
      `Customer ${ids[0]} deleted.`;
    const tasks$ = [];

    for (let i = 0; i < ids.length; i++) {
      tasks$.push(this.deleteOneCustomer(ids[i]));
    }

    return forkJoin(tasks$)
      .pipe(
        tap(() => this.showMessage(message)),
        tap(() => this.logMessage(message)),
        catchError(this.handleError<Customer>('deleteCustomers(ids)')),
      );

  }


  /** Delete one customer. */
  private deleteOneCustomer(id: number): Observable<any> {

    return this.http.delete(this.customersUrl + `/${id}`, this.cudOptions);

  }


  /**
   * Getting a customer from the remote http server.
   * ##################################################################
   */

  getCustomer(id: number): Observable<Customer> {

    return this.http.get<Customer>(this.customersUrl + `/${id}`)
      .pipe(
        catchError(this.handleError<Customer>(`Get customer id=${id}`))
      );
  }


  /**
   * Getting customers from the remote http server.
   * ##################################################################
   *
   * @param queryParams   The filter, sort, and page parameters.
   * @return queryResult  The filtered and sorted items (customer) array.
   *
   * The server should perform filtering, sorting, and paginating
   * and return the proper queryResult.
   *
   * This code emulates real server response by getting all customers from
   * the server and performing client-side filtering, sorting, and paginating
   * (done in the CustomerDatasource class).
   * Change this for real server implementation.
   *
   *
   * getCustomers() returns a QueryResult Observable;
   * http.get()     returns a Customer[] Observable.
   *
   * - mergeMap
   *   maps each value (Customer[]) emitted by the source observable
   *   to a new observable (queryResult) which is merged in the output observable.
   * - switchMap
   *   maps the *most recent*  value (Customer[]) emitted by source observable
   *   to a new observable (queryResult) which is merged in the output observable.
   *   It switches whenever a new value is emitted.
   */

  getCustomers(queryParams?: QueryParams): Observable<QueryResult> {

    // Getting all customers.
    return this.http.get<Customer[]>(this.customersUrl)
      .pipe(
        switchMap(res => {
          const queryResult = new QueryResult();
          queryResult.items = res;
          queryResult.totalCount = res.length;

          // Setting client-side querying
          // (searching/filtering/sorting/paging).
          // ==========================================================
          queryResult.clientSideQuerying = true;

          return of(queryResult);
        }),
        catchError(this.handleError<QueryResult>('http.get in getCustomers(queryParams)'))
      );



    // if (!queryParams) { queryParams = new QueryParams(); }

    // if (queryParams.searchTerm) {

    //   this.logMessage(
    //     `[getCustomers(queryParams) / searchTerm] queryParams = \n ${JSON.stringify(queryParams)}`
    //   );

    //   // Search term (for searching in all fields) is set.
    //   return this.http.get<Customer[]>(this.customersUrl)
    //     .pipe(
    //       switchMap(res => {
    //         // ===============================================================
    //         // Client side searching (should be done server side).
    //         // Remove this for real server implementation.
    //         // ===============================================================
    //         const queryResult = this.httpUtils.searchInAllFields(res, queryParams);
    //         // ===============================================================
    //         return of(queryResult);
    //       }),
    //       catchError(this.handleError<QueryResult>('http.get in getCustomers(queryParams.searchTerm)'))
    //     );

    // } else {

    //   this.logMessage(
    //     `[getCustomers(queryParams) / filters] queryParams = \n ${JSON.stringify(queryParams)}`
    //   );

    //   // Filters are set (or empty = select all).
    //   return this.http.get<Customer[]>(this.customersUrl)
    //     .pipe(
    //       switchMap(res => {
    //         // ===============================================================
    //         // Client side filtering and sorting (should be done server side).
    //         // Remove this for real server implementation.
    //         // ===============================================================
    //         const queryResult = this.httpUtils.filterAndSort(res, queryParams);
    //         // ===============================================================
    //         return of(queryResult);
    //       }),
    //       catchError(this.handleError<QueryResult>('http.get in getCustomers(queryParams)'))
    //     );

    // }

  }


  /**
   * Updating a customer on the remote http server.
   * ##################################################################
   * Returns the updated customer upon success.
   *
   * HTTP PUT - Null response expected.
   */

  updateCustomer(customer: Customer): Observable<Customer> {
    // const httpHeader = this.httpUtils.getHttpHeaders();

    const message = `Customer with id = ${customer.id} and name = "${customer.name}" has been updated.`;

    return this.http.put<Customer>(this.customersUrl, customer, this.cudOptions)
      .pipe(
        tap(() => this.showMessage(message)),
        tap(() => this.logMessage(message)),

        catchError(this.handleError<Customer>(message.replace('has been', 'can not be'))),
      );
  }



  // ##################################################################
  // Non public helper methods.
  // ##################################################################


  /** Handling http errors. */
  private handleError<T>(operationFailed: string) {
    return this.httpErrorHandler.handleError<T>('http-customer.service.ts', operationFailed);
  }

  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[########## http-customer.service.ts ##########] ' + message);
  }

  /** Showing user friendly message. */
  private showMessage(message: string) {
    return this.messageService.showMessage(message);
  }


}

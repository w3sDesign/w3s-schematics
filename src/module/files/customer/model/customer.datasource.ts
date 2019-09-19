import { CollectionViewer, DataSource } from '@angular/cdk/collections';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';

import { Customer } from './customer';
import { CustomerService } from './customer.service';

import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';
import { HttpUtilsService } from '../../shared/http-utils.service';
import { MessageService } from '../../shared/message.service';


/**
 * Component for encapsulating data retrieval for the data table.
 * ####################################################################
 *
 * The data table component does not know (is independent of)
 * where the data is coming from.
 *
 * The data table subscribes to an Observable provided by the data source
 * and automatically triggers an update every time new data is emitted.
 */

export class CustomerDataSource implements DataSource<any> {

  /** Accepting/emitting customer arrays. */
  private customersSubject = new BehaviorSubject<Customer[]>([]);

  public customers$ = this.customersSubject.asObservable();

  /** Subject for accepting and emitting loading true/false. */
  isLoading = new BehaviorSubject<boolean>(false);

  /** Subject for accepting and emitting the total number of queried customers. */
  totalNumberOfItems = new BehaviorSubject<number>(0);

  /** Needed e.g. for showing message: 'No customers found' */
  hasItems = false;


  constructor(
    private customerService: CustomerService,
    private httpUtils: HttpUtilsService,
    private messageService: MessageService,
  ) {
    this.totalNumberOfItems.subscribe(nr => (this.hasItems = nr > 0));
  }


  /**
   * Connecting the data table.
   * ##################################################################
   *
   * https://blog.angular-university.io/angular-material-data-table/
   *
   * This method will be called once by the data table at bootstrap time.
   * The data table subscribes to the observable that this method returns.
   * The observable emits the customers that should be displayed.
   * The data table renders a row for each object in the data array.
   */

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.customersSubject.asObservable();
  }

  /**
   * Disconnecting the data table.
   * ##################################################################
   */

  disconnect(collectionViewer: CollectionViewer): void {
    this.customersSubject.complete();
    this.isLoading.complete();
    this.totalNumberOfItems.complete();
  }


  /**
   * Getting the customers.
   * ##################################################################
   * Implemented by delegating to the customer service.
   * If the data arrives successfully, the new values (customers) are
   * emitted by calling next() on the subjects.
   * The connected (subscribed) data table renders the emitted values.
   */

  getCustomers(queryParams: QueryParams) {

    // ? if (!queryParams) { queryParams = new QueryParams(); }

    this.isLoading.next(true);

    // Delegating to the customer service.

    this.customerService.getCustomers(queryParams).pipe(

      switchMap((res1: QueryResult) => {

        // if (!res1.items || res1.items.length === 0) { return of(res1); }
        if (!res1.items) { return of(res1); }


        // Usually, the server is responsible for filtering/sorting/paging
        // and returns the proper QueryResult.
        // The customer service implementation sets clientSideQuerying to
        // true or false (default = false).

        if (!res1.clientSideQuerying) { return of(res1); }

        // ============================================================
        // Client side filtering/sorting/paging.
        // ============================================================

        if (queryParams.searchTerm) {

          // Searching/Sorting/Paging.
          // ==========================================================

          this.logMessage(
            `[getCustomers(queryParams) 1/3 searchTerm] queryParams = \n ${JSON.stringify(queryParams)}`
          );

          // TODO

          // ===============================================================
          //         // Client side searching (should be done server side).
          //         // Remove this for real server implementation.
          //         // ===============================================================
          //         const queryResult = this.httpUtils.searchInAllFields(res, queryParams);
          //         // ===============================================================
          //         return of(queryResult);

          const searchedItems = this.httpUtils.searchItems(
            res1.items, queryParams.searchTerm);

          const sortedItems = this.httpUtils.sortItems(
            searchedItems, queryParams.sortField, queryParams.sortOrder);

          const queryResult = this.httpUtils.createQueryResult(
            sortedItems, queryParams);

          return of(queryResult);






        } else if (queryParams.filter) {

          // Filtering/Sorting/Paging
          // ==========================================================

          this.logMessage(
            `[getCustomers(queryParams) 2/3 filter] queryParams = \n ${JSON.stringify(queryParams)}`
          );
          this.logMessage(
            `[getCustomers(queryParams) 2/3 filter] res1.items = \n ${JSON.stringify(res1.items)}`
          );

          const filteredItems = this.httpUtils.filterItems(
            res1.items, queryParams.filter);

          const sortedItems = this.httpUtils.sortItems(
            filteredItems, queryParams.sortField, queryParams.sortOrder);

          const queryResult = this.httpUtils.createQueryResult(
            sortedItems, queryParams);

          return of(queryResult);

        } else {

          // Sorting/Paging (no searchTerm/filters).
          // ==========================================================

          this.logMessage(
            `[getCustomers(queryParams) 3/3 sort] queryParams = \n ${JSON.stringify(queryParams)}`
          );

          const sortedItems = this.httpUtils.sortItems(
            res1.items, queryParams.sortField, queryParams.sortOrder);

            const queryResult = this.httpUtils.createQueryResult(
              sortedItems, queryParams);

              return of(queryResult);

            }

          }))

          // ==============================================================
          // Emitting the new values for rendering.
          // ==============================================================
          // Customer service returns a QueryResult observable.

          .subscribe((res: QueryResult) => {

            this.logMessage(
              `[subscibe] res.items = \n ${JSON.stringify(res.items)}`
            );

        // if (res.items || res.items.length > 0) {
        if (res.items) {

          this.customersSubject.next(res.items);

          this.totalNumberOfItems.next(res.totalCount);

          this.isLoading.next(false);
        }

      });

  }

  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[########## customer.datasource.ts ##########] ' + message);
  }

}

import { Customer } from './customer';
import { Observable } from 'rxjs';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';


/**
 * Service interface for accessing and maintaining customers.
 * ####################################################################
 * 100% abstract class (= interface).
 */

export abstract class CustomerService {

  /** Get the customer with the specified id. */
  abstract getCustomer(id: number): Observable<Customer>;

  /** Get the customers with the specified QueryParams. */
  abstract getCustomers(queryParams?: QueryParams): Observable<QueryResult>;

  /** Create the specified customer. */
  abstract createCustomer(customer: Customer): Observable<Customer>;

  /** Update the specified customer. */
  abstract updateCustomer(customer: Customer): Observable<Customer>;

  /** Delete the customer with the specified id. */
  abstract deleteCustomer(id: number): Observable<{}>;

  abstract deleteCustomers(ids: number[]): Observable<{}>;

}

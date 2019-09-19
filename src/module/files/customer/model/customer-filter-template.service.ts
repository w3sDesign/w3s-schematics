
import { Customer } from './customer';
import { Observable } from 'rxjs';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import { CustomerFilterTemplate } from './customer-filter-template';
import { QuestionBase } from '../../shared/dynamic-form/question-base';

/**
 * Service interface for accessing and maintaining customer filter templates.
 * ####################################################################
 * 100% abstract class (= interface)
 */

export abstract class CustomerFilterTemplateService {

  /** Create the specified customer filter template. */
  abstract createCustomerFilterTemplate(filterTemplate: CustomerFilterTemplate): Observable<CustomerFilterTemplate>;

  /** Get the customer filter template with the specified id. */
  abstract getCustomerFilterTemplate(id: number): Observable<CustomerFilterTemplate>;

  /** Get all customer filter templates. */
  abstract getCustomerFilterTemplates(): Observable<CustomerFilterTemplate[]>;

  /** Update the specified customer filter template. */
  abstract updateCustomerFilterTemplate(filterTemplate: CustomerFilterTemplate): Observable<CustomerFilterTemplate>;

}

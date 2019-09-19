import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { tap, mergeMap, catchError, switchMap } from 'rxjs/operators';

import { CustomerFilterTemplate } from './customer-filter-template';
import { CustomerFilterTemplateService } from './customer-filter-template.service';

import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { HttpUtilsService } from '../../shared/http-utils.service';
import { MessageService } from '../../shared/message.service';


/**
 * Service for accessing and maintaining customer filter templates
 * on a remote http server (via HTTP REST API).
 * ####################################################################
 */

@Injectable()
export class HttpCustomerFilterTemplateService extends CustomerFilterTemplateService {

  /** Http REST API */
  private customerFilterTemplatesUrl = 'api/customerFilterTemplates';

  /** Http Header for create/update/delete methods */
  private cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler,
    private messageService: MessageService,
  ) {
    super();
  }


  /**
   * Create the specified customer filter template on the http server.
   * ##################################################################
   * HTTP POST
   */

  createCustomerFilterTemplate(filterTemplate: CustomerFilterTemplate): Observable<CustomerFilterTemplate> {

    const message = `Filter template with id = ${filterTemplate.id} and name = "${filterTemplate.name}" has been created.`;

    return this.http.post<CustomerFilterTemplate>(this.customerFilterTemplatesUrl, filterTemplate, this.cudOptions)
      .pipe(
        tap(() => this.show(message)),
        tap(() => this.log(message)),
        catchError(this.handleError<CustomerFilterTemplate>(message.replace('has been', 'can not be'))),
      );
  }


  /**
   * Get the customer filter template with the specified id.
   * ##################################################################
   */

  getCustomerFilterTemplate(id: number): Observable<CustomerFilterTemplate> {

    return this.http.get<CustomerFilterTemplate>(this.customerFilterTemplatesUrl + `/${id}`)
      .pipe(
        catchError(this.handleError<CustomerFilterTemplate>(`Get customerFilterTemplate id=${id}`))
      );
  }


  /**
   * Get all customer filter templates.
   * ##################################################################
   */

  getCustomerFilterTemplates(): Observable<CustomerFilterTemplate[]> {

    return this.http.get<CustomerFilterTemplate[]>(this.customerFilterTemplatesUrl)
      .pipe(
        catchError(this.handleError<CustomerFilterTemplate[]>('getCustomerFilterTemplates()'))
      );
  }


  /**
   * Update the specified customer filter template on the http server.
   * ##################################################################
   * HTTP PUT
   */

  updateCustomerFilterTemplate(customerFilterTemplate: CustomerFilterTemplate): Observable<CustomerFilterTemplate> {

    const message = `CustomerFilterTemplate with id = ${customerFilterTemplate.id}
 and name = "${customerFilterTemplate.name}" has been updated.`;

    return this.http.put<CustomerFilterTemplate>(this.customerFilterTemplatesUrl, customerFilterTemplate, this.cudOptions)
      .pipe(
        tap(() => this.show(message)),
        tap(() => this.log(message)),

        catchError(this.handleError<CustomerFilterTemplate>(message.replace('has been', 'can not be'))),
      );
  }



  // ##################################################################
  // Private helper methods.
  // ##################################################################


  /** Handling http errors. */
  private handleError<T>(operationFailed: string) {
    return this.httpErrorHandler.handleError<T>('http-customer.service.ts', operationFailed);
  }

  /** Logging message to console. */
  private log(message: string) {
    return this.messageService.logMessage('[http-customer.service.ts] ' + message);
  }

  /** Showing a user friendly message. */
  private show(message: string) {
    return this.messageService.showMessage(message);
  }


}

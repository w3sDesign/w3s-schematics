import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, AfterViewInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragStart, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { fromEvent, merge, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

import { Customer } from '../model/customer';
import { CustomerDataSource } from '../model/customer.datasource';

import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { QueryParams } from '../../shared/query-params';
import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { CustomerDetailDialogComponent } from '../customer-detail/customer-detail.component';

import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from '../../shared/dynamic-form/dynamic-form-question.component';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { mockCustomerQuestions } from '../model/mock-customer-questions';

import { CustomerFilterTemplate } from '../model/customer-filter-template';

import { InputDialogComponent } from '../../shared/input-dialog/input-dialog.component';

import { DynamicFormOptions } from '../../shared/dynamic-form/dynamic-form-options';
import { mockCustomers } from '../model/mock-customers';


import { CustomerService } from '../model/customer.service';
import { HttpCustomerService } from '../model/http-customer.service';
import { MessageService } from '../../shared/message.service';
// import { FocusMonitor } from '@angular/cdk/a11y';

import * as moment from 'moment';
import { MomentDatePipe } from '../../shared/pipes/momentDate.pipe';
import { HttpUtilsService } from '../../shared/http-utils.service';



@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})

/**
 * Main component for customer data entry and management.
 * ####################################################################
 */

export class CustomerListComponent implements OnInit, AfterViewInit, OnChanges {

  showTestValues = true;
  // consoleLogStyle = 'color: blue; font-weight: 500; line-height: 20px;';

  /**
   * The data source object
   * - is responsible for retrieving and emitting the customer objects
   *   the table should display.
   */
  dataSource: CustomerDataSource;

  customers: Customer[] = [];
  selectedCustomer: Customer;
  selectedCustomerId: number;
  // new used instead of customers?
  // customers$: Observable<Customer[]>;

  /** activated = selected with user input */
  /** Values set in onQueryParamsChange() from filter-template component */
  // activatedFilterTemplateId: number;
  // activatedFilters: any;
  // activatedSearchTerm: string;

  // Most recently activated query params.
  activatedQueryParams: QueryParams;
  //////////////////////////////////


  // new From router / activated route
  // routeCustomerId: number;
  // routeFilterTemplateId: number;

  // customerQuestions: QuestionBase[] = mockCustomerQuestions.slice();

  /** All possible columns that can be displayed. */
  // TODO should be generated from questions
  availableColumns: string[] = [
    'select', 'id', 'name', 'type', 'status', 'comment', 'creationDate',
    'country', 'postalCode', 'city', 'street',
    'department', 'person', 'phone', 'email'
  ];

  /** Columns displayed in the data table. */
  /** = selected in the columnSelection table. */
  displayedColumns: string[] = [
    'select', 'id', 'name', 'country', 'city', 'phone', 'email'
  ];




  /** MatPaginator component for navigating between pages. */
  @ViewChild(MatPaginator, {static: false}) matPaginator: MatPaginator;

  /** MatSort directive for sorting table columns. */
  @ViewChild(MatSort, {static: false}) matSort: MatSort;

  // /** Searching in all fields. */
  // @ViewChild('searchInput') searchInput: ElementRef;

  /** Selecting customers (selecting specific table rows). */
  customerSelection = new SelectionModel<Customer>(true, []);

  /** Selecting columns (selecting which columns to display). */
  /** Args: allowMultiSelect, initialSelection */
  columnSelection = new SelectionModel<string>(true, this.displayedColumns);

  /** Table for column selection. */
  @ViewChild('columnSelectionTable', {static: false}) columnSelectionTable: MatTable<string[]>;

  /** Needed for drag and drop columns. */
  previousDragIndex: number;


  /** Create/Update/Delete buttons. */
  @ViewChild('crudButtons', { read: ViewContainerRef , static: false}) crudButtons;





  // Component constructor.
  // ##################################################################

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private formGroupService: DynamicFormGroupService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private httpUtils: HttpUtilsService,
  ) {

    this.dataSource = new CustomerDataSource(
      this.customerService, this.httpUtils, this.messageService);
    // this.filterTemplateQuestions = this.generateFilterTemplateQuestions();

    this.activatedQueryParams = new QueryParams();
  }


  // Component lifecycle hook.
  // ##################################################################
  // Called once after creating the component,
  // but before creating child components.

  ngOnInit() {

    this.logMessage(`[ngOnInit()] ########################################`);

    // Setting parameters from activated route
    // (from navigateToList() in CustomerDetailComponent).

    this.route.paramMap.pipe(
      switchMap((routeParams: ParamMap) => {

        // Setting selected customer id from activated route.

        // this.selectedCustomerId = +this.route.snapshot.paramMap.get('id');
        // = 0 when id is null (because + converts null to 0)

        this.selectedCustomerId = +routeParams.get('id');


        // Setting displayed columns from activated route.

        const dc: string = routeParams.get('displayedColumns');
        this.logMessage(
          `[ngOnInit()] routeParams.get('displayedColumns') = ${dc}`
        );
        if (dc) {
          this.displayedColumns = JSON.parse(dc);
          this.logMessage(
            `[ngOnInit()] routeParams / displayedColumns = ${JSON.stringify(this.displayedColumns)}`
          );
        }


        // Setting query params from activated route.

        const qp: string = routeParams.get('queryParams');
        this.logMessage(
          `[ngOnInit()] routeParams.get('queryParams') = ${qp}`
        );
        if (qp) {
          this.activatedQueryParams = JSON.parse(qp) as QueryParams;
          // this.dataSource.getCustomers(JSON.parse(qp) as QueryParams);
          // } else {
          //   this.dataSource.getCustomers(this.activatedQueryParams);
        }


        this.dataSource.getCustomers(this.activatedQueryParams);
        ////////////////////////////////////////////////////////

        return of(routeParams);
      })

    ).subscribe();




    // Setting this.customers object array.
    this.dataSource.customers$
      .subscribe(res => {
        this.customers = res;

        this.logMessage(
          `[ngOnInit() customers$.subscribe] this.customers = \n ${JSON.stringify(this.customers)}`
        );
      });

  }



  // Component lifecycle hook.
  // ##################################################################
  // Called once after creating the child components.

  ngAfterViewInit() {

    this.logMessage(`[ngAfterViewInit()] ========================================`);


    // TODO? Moving to view? (sortChange)="onSortChange"

    // Observing matSort (sortChange) event
    // emitted when either active sort or sort direction changes.

    this.matSort.sortChange
    .subscribe(() => {
      this.activatedQueryParams.sortField = this.matSort.active;
      this.activatedQueryParams.sortOrder = this.matSort.direction;
      // Reset to first page.
      this.activatedQueryParams.pageNumber = 0;
      this.matPaginator.pageIndex = 0;

      // Load data
      this.dataSource.getCustomers(this.activatedQueryParams);
    });


    // TODO? Moving to view? (page)="onPageChange"

    // Observing matPaginator (page) event
    // emitted when either page size or page index changes.

    this.matPaginator.page
      .subscribe(() => {
        this.activatedQueryParams.pageNumber = this.matPaginator.pageIndex;
        this.activatedQueryParams.pageSize = this.matPaginator.pageSize;

        this.dataSource.getCustomers(this.activatedQueryParams);
      });

  }


  // Component lifecycle hook.
  // ##################################################################
  // Called whenever data-bound input properties change.

  ngOnChanges() {

    this.logMessage(
      `[ngOnChanges()]`
    );

  }







  // ##################################################################
  // Component public member methods (in alphabetical order).
  // ##################################################################



  /** Whether number of selected customers matches total number of customers. */
  allCustomersSelected(): boolean {
    const selected = this.customerSelection.selected.length;
    const all = this.customers.length;
    return selected === all;
  }


  /** Whether number of selected columns matches total number of columns. */
  allColumnsSelected(): boolean {
    const selected = this.columnSelection.selected.length;
    const all = this.availableColumns.length;
    return selected === all;
  }


  /**
   * Create a customer (by updating an empty customer).
   * ##################################################################
   */

  createCustomer() {

    // Creating an empty customer with id = 0.
    // const customer = new Customer();

    // Updating this empty customer.
    // this.updateCustomer(customer);

    this.navigateToDetail(0);

  }




  /**
   * Delete selected customer(s).
   * ##################################################################
   */

  deleteCustomers() {
    if (this.customerSelection.isEmpty()) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Delete Customers',
          message: `Please select the customer(s) to delete.`,
          showActions: false
        }
      });
      return;
    }

    const numberOfSelections = this.customerSelection.selected.length;
    const customer_s = numberOfSelections <= 1 ? 'customer' : `${numberOfSelections} customers`;

    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Delete Customers',
        message: `Are you sure to permanently delete the selected ${customer_s}?`,
        showActions: true
      }
    });

    dialogRef.afterClosed()
      .subscribe(
        ok => {
          if (!ok) { return; }

          // Start deleting. Identify selected customers.
          const ids: number[] = [];
          for (let i = 0; i < numberOfSelections; i++) {
            ids.push(this.customerSelection.selected[i].id);
          }

          // Delete identified (selected) customers.
          /////////////////////////////////////////
          this.customerService.deleteCustomers(ids)
            .subscribe(
              () => {
                this.matPaginator.pageIndex = 0;
                this.dataSource.getCustomers(this.activatedQueryParams);
                this.customerSelection.clear();
              },
              // err handled in customerService
            );
        }
      );
  }


  /**
   * Drag and drop table columns
   * ##################################################################
   */

  dragStarted(event: CdkDragStart, index: number) {
    this.previousDragIndex = index;
  }
  dropListDropped(event: CdkDropList, index: number) {
    if (event) {
      moveItemInArray(this.availableColumns, this.previousDragIndex, index);
      this.setDisplayedColumns();
    }
  }

  // drop(event: CdkDragDrop<Customer[]>) {
  //   moveItemInArray(this.customers, event.previousDragIndex, event.currentIndex);
  // }
  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.availableColumns, event.previousDragIndex, event.currentIndex);
  // }






  /**
   * Getting most recently activated query parameters.
   * ##################################################################
   */

  // NIXgetQueryParams(): QueryParams {

  //   const queryParams = new QueryParams();

  //   queryParams.filterTemplateId = this.activatedFilterTemplateId;

  //   if (this.activatedFilters) { queryParams.filter = this.activatedFilters; }
  //   if (this.activatedSearchTerm) { queryParams.searchTerm = this.activatedSearchTerm; }

  //   queryParams.sortOrder = this.sort.direction;
  //   queryParams.sortField = this.sort.active;

  //   queryParams.pageNumber = this.matPaginator.pageIndex;
  //   queryParams.pageSize = this.matPaginator.pageSize;

  //   return queryParams;

  // }





  /**
 * Navigating to the CustomerDetailComponent.
 * ##################################################################
 */

  navigateToDetail(id: number, ids?: number[]) {

    this.router.navigate(['/customers', id, {
      ids: ids ? ids : null,
      displayedColumns: JSON.stringify(this.displayedColumns),
      queryParams: JSON.stringify(this.activatedQueryParams),
    }]);
  }





  /**
   * Filters and search term emitted by the filter-template component.
   * ##################################################################
   */

  onQueryParamsChange(params: QueryParams) {

    this.activatedQueryParams.filterTemplateId = params.filterTemplateId;
    this.activatedQueryParams.filter = params.filter;
    this.activatedQueryParams.searchTerm = params.searchTerm;

    this.activatedQueryParams.pageNumber = 0;

    // this.activatedFilterTemplateId = params.filterTemplateId;
    // this.activatedFilters = params.filter;
    // this.activatedSearchTerm = params.searchTerm;

    this.matPaginator.pageIndex = 0;

    this.logMessage(
      `[onQueryParamsChange()] this.activatedQueryParams.filter = \n ${JSON.stringify(this.activatedQueryParams.filter)}`
    );

    this.dataSource.getCustomers(this.activatedQueryParams);
    /////////////////////////////////////////

    this.customerSelection.clear();

  }




  /**
   * Sets which columns to display in the data table.
   * ##################################################################
   */

  setDisplayedColumns() {

    // Displayed columns ordered by their selection.
    // this.displayedColumns = this.columnSelection.selected;

    // Displayed columns ordered like available columns.
    this.displayedColumns = [];
    this.availableColumns.forEach((column, index) => {
      if (this.columnSelection.isSelected(column)) {
        this.displayedColumns.push(column);
      }
    });

    this.columnSelectionTable.renderRows();
  }


  /** Selects all customers if not all selected; otherwise clears selection. */
  toggleAllCustomers() {
    this.allCustomersSelected() ?
      this.customerSelection.clear() :
      this.customers.forEach(customer => this.customerSelection.select(customer));
  }


  /** Selects all columns if not all selected; otherwise clears selection. */
  toggleAllColumns() {
    this.allColumnsSelected() ?
      this.columnSelection.clear() :
      this.availableColumns.forEach(column => this.columnSelection.select(column));
  }


  /**
   * Update selected customers (by opening a modal dialog.
   * ##################################################################
   * TODO: multiple selections
   */

  ORIGupdateCustomer(customer?: Customer) {
    if (!customer) {
      if (this.customerSelection.isEmpty()) {
        this.dialog.open(MessageDialogComponent, {
          data: {
            title: 'Update Selected Customers',
            message:
              'Please select the customers to update.',
            showActions: false
          }
        });
        return;
      }
      customer = this.customerSelection.selected[0];
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = "auto"; 800px
    // dialogConfig.minHeight = "auto"; 200px
    // dialogConfig.maxHeight = "auto"; 800px
    dialogConfig.panelClass = 'w3s-dialog-panel'; // in global styles.scss
    dialogConfig.data = { customer };

    // Open modal dialog and load CustomerDetailDialogComponent.
    // ################################################################
    const dialogRef = this.dialog.open(CustomerDetailDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(
        res => {
          if (!res) { return; }
          this.matPaginator.pageIndex = 0;
          this.dataSource.getCustomers(this.activatedQueryParams);
          this.customerSelection.clear();
        }
      );
  }

  /**
   * New: Update selected customers (by navigating to detail component).
   * ##################################################################
   * TODO: multiple selections
   */

  updateCustomer(id?: number) {

    // (1) Update customer with the clicked row.id.

    if (id) {

      this.navigateToDetail(id);

      // this.router.navigate(['/customers', id, {
      //   displayedColumns: JSON.stringify(this.displayedColumns),
      //   queryParams: JSON.stringify(this.activatedQueryParams)
      // }]);

      return;
    }

    // (2) Update selected customers (no row.id).

    if (this.customerSelection.isEmpty()
      || !this.customerSelection.selected.length) {

      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Update Selected Customers',
          message:
            'Please select the customers to update.',
          showActions: false
        }
      });
      return;
    }

    // Update customers with the selected ids.

    const ids: number[] = [];
    for (let i = 0; i < this.customerSelection.selected.length; i++) {
      ids[i] = this.customerSelection.selected[i].id;
    }

    this.navigateToDetail(ids[0], ids);

    // this.router.navigate(['/customers', ids[0], {
    //   ids: ids,
    //   displayedColumns: JSON.stringify(this.displayedColumns),
    //   queryParams: JSON.stringify(this.activatedQueryParams)
    // }]);

  }






  // ##################################################################
  // Component non public member methods.
  // ##################################################################


  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[customer-list.component.ts] ' + message);
  }

  /** Showing a user friendly message. */
  private showMessage(message: string) {
    return this.messageService.showMessage('*** ' + message + ' ***');
  }





}

  // consoleLog(value: string) {
  //   if (this.showTestValues) {
  //     // console.log('%c##########' + value + ' = ' + eval(message), this.logStyle);

  //     console.log('%c########## ' + value + ' = ', 'color: blue; font-weight: 500;');

  //     // Does not appear in production code.
  //     // tslint:disable-next-line:no-eval
  //     console.log('%c' + eval(value), 'color: blue; font-weight: 400;');
  //   }
  // }


////////////// tests ////////////////
// import {interval} from 'rxjs';
// const numbers = interval(1000);
// numbers.subscribe(x => console.log(x));
///////////////////////////////////////


/**
   * Setting query parameters and getting customers from dataSource.
   * ##################################################################
   */

  // NIXgetCustomers(params?: QueryParams) {

  //   // Test
  //   // if (this.filterTemplateForm.form.value) {

  //   // (1) Setting queryParams.
  //   const queryParams = new QueryParams();

  //   if (params) {
  //     queryParams.searchTerm = params.searchTerm;
  //     queryParams.filter = params.filter;
  //   }

  //   // if (this.showTestValues) {
  //   //   console.log('%c########## queryParams [getCustomers()] = \n' +
  //   //     JSON.stringify(queryParams), 'color: darkblue');
  //   // }

  //   queryParams.sortOrder = this.sort.direction;
  //   // The id of the column being sorted.
  //   queryParams.sortField = this.sort.active;
  //   queryParams.pageNumber = this.matPaginator.pageIndex;
  //   queryParams.pageSize = this.matPaginator.pageSize;

  //   // (2) Getting customers from dataSource.
  //   this.dataSource.getCustomers(queryParams);
  //   /////////////////////////////////////////



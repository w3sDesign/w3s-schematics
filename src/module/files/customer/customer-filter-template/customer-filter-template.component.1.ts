//
// Change log
// ####################################################################
// Update activeFilterNames - moved to emitQueryParams()
// ####################################################################


// tslint:disable-next-line:max-line-length
import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, AfterViewInit, EventEmitter, Output } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragStart, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { fromEvent, merge, Observable, TimeoutError } from 'rxjs';
//
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

import { CustomerDataSource } from '../model/customer.datasource';
import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
//
import { Customer } from '../model/customer';
import { QueryParams } from '../../shared/query-params';

import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { CustomerDetailDialogComponent } from '../customer-detail/customer-detail.component';
import { Router } from '@angular/router';

import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from '../../shared/dynamic-form/dynamic-form-question.component';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { mockCustomerQuestions } from '../model/mock-customer-questions';

import { CustomerFilterTemplate } from '../model/customer-filter-template';

import { InputDialogComponent } from '../../shared/input-dialog/input-dialog.component';

import { DynamicFormOptions } from '../../shared/dynamic-form/dynamic-form-options';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { mockCustomers } from '../model/mock-customers';
import { MessageService } from '../../shared/message.service';

import { CustomerFilterTemplateService } from '../model/customer-filter-template.service';



@Component({
  selector: 'w3s-customer-filter-template',
  templateUrl: './customer-filter-template.component.html',
  styleUrls: ['./customer-filter-template.component.scss']
})

/**
 * Reusable component for filter template data entry and management.
 * ####################################################################
 * Emits a `QueryParam` object on user changes.
 */

export class CustomerFilterTemplateComponent implements OnInit, AfterViewInit {

  showTestValues = true;
  // consoleLogStyle = 'color: blue; font-weight: 500; line-height: 20px;';

  /** Emitting a queryParamsChange event for which parents can listen. */
  @Output() queryParamsChange = new EventEmitter<any>();


  /** All possible filters. */
  availableFilterNames: string[] =
    [
      'idFilter', 'nameFilter',
      'typeFilter', 'statusFilter', 'commentFilter', 'creationDateFilter',
      'countryFilter', 'postalCodeFilter', 'cityFilter', 'streetFilter',
      'departmentFilter', 'personFilter', 'phoneFilter', 'emailFilter'
    ];

  availableFilterLabels: string[]; // 'Id', 'Name', ...

  /** Filters in the filter template form. */
  // old = filtersToDisplay: string[] = [];
  selectedFilterNames: string[] = [];
  // [
  //   'idFilter', 'nameFilter',
  // ];

  /** Active filters from the most recent search. */
  activeFilterNames: string[] = [];

  activeFiltersMessage = '';


  /**
   * Reference to the filter template form.
   * Not set before AfterViewInit.
   */
  @ViewChild('filterTemplateForm', {static: false})
  filterTemplateForm: DynamicFormComponent;

  // filterTemplateFormValue: any = {};
  // filterTemplateForm.form.value used instead!

  filterTemplateFormOptions: DynamicFormOptions = {
    formFieldAppearance: 'standard'
  };

  /**
   * Filter template questions.
   * Automatically generated from existing customer questions.
   */
  filterTemplateQuestions: QuestionBase[];

  /** Filter templates */
  filterTemplates: CustomerFilterTemplate[]; // mockCustomerFilterTemplates;

  filterTemplateNames: string[] = [];

  selectedFilterTemplateName = 'standard';


  /**
   * Reference to the filter selection.
   */
  @ViewChild('selectingFiltersTable', {static: false})
  selectingFiltersTable: MatTable<string[]>;


  /**
   * Filter selection handling.
   * Args: allowMultiSelect, initialSelection.
   */
  filterSelection = new SelectionModel<string>(true, this.selectedFilterNames);


  /** Searching in all fields */
  // @ViewChild('searchInput') searchInput: ElementRef;

  searchInputModel = '';



  // ##################################################################
  // Constructor
  // ##################################################################

  constructor(
    private customerFTService: CustomerFilterTemplateService,
    private router: Router,
    private formGroupService: DynamicFormGroupService,
    private dialog: MatDialog,
    private messageService: MessageService,
  ) {

    this.filterTemplateQuestions = this.generateFilterTemplateQuestions(this.selectedFilterNames);

    this.availableFilterLabels = this.availableFilterNames.map(filter => filter.replace('Filter', ''));
  }




  // ##################################################################
  // OnInit
  // ##################################################################

  ngOnInit() {

    this.logMessage(
      `[ngOnInit()] this.activeFilterNames = \n ${JSON.stringify(this.activeFilterNames)}`
    );

    // Getting filter templates and performing onSelectFilterTemplate(name).
    // ################################################################

    this.customerFTService.getCustomerFilterTemplates()
      .subscribe(
        res => {
          this.filterTemplates = res;
          for (let i = 0; i < res.length; i++) {
            this.filterTemplateNames[i] = res[i].name;
          }
          this.selectedFilterTemplateName = 'standard';
          this.onSelectFilterTemplate(this.selectedFilterTemplateName);
        }
      );




  } // ngOnInit()




  // ##################################################################
  // AfterViewInit
  // ##################################################################

  ngAfterViewInit() {

    this.logMessage(
      `[ngAfterViewInit()] this.filterTemplateForm.form.value = \n ${JSON.stringify(this.filterTemplateForm.form.value)}`
    );

  }




  // ####################################################################
  // Other Methods
  // ####################################################################


  /**
   * ##################################################################
   * Create a filter template.
   * ##################################################################
   */

  createFilterTemplate(filterTemplate: CustomerFilterTemplate) {

    const dialogRef = this.dialog.open(InputDialogComponent, {
      data: {
        title: 'Save As',
        message: `Please enter the new filter template name:   `,
        name: '',
      }
    });

    dialogRef.afterClosed()
      .subscribe(
        name => {
          if (!name) { return; }

          filterTemplate.name = name;
          // Returns the highest filter template id + 1
          filterTemplate.id = Math.max(...this.filterTemplates.map(template => template.id)) + 1;

          // Create filter template.
          this.customerFTService.createCustomerFilterTemplate(filterTemplate)
            .subscribe(
              () => {
                this.customerFTService.getCustomerFilterTemplates()
                  .subscribe(
                    (res) => {
                      this.filterTemplates = res;
                      // this.consoleLog('JSON.stringify(this.filterTemplates');

                      this.filterTemplateNames = [];
                      for (let i = 0; i < res.length; i++) {
                        this.filterTemplateNames[i] = res[i].name;
                      }

                      this.selectedFilterTemplateName = filterTemplate.name;

                      // this.renderFilterTemplateForm(this.selectedFilterTemplateName);
                      this.filterTemplateForm.form.patchValue(filterTemplate);
                      ///////////////////////////////////////////////////////

                      this.emitQueryParams();


                      // TODO http should do that!
                      // Mock must be done manually!
                      // ########################################
                      // Also update the in memory filter templates (this.filterTemplates)
                      // and filter template names.
                      // TODO
                      // const idx = this.filterTemplates.findIndex(element => element.id === filterTemplate.id);
                      // this.filterTemplates[idx] = filterTemplate;
                    },
                    // err handled in customerFTService
                  );
              }
            );
        }
      );

  }





  /**
   * Emitting query parameters for which parents can listen.
   * ##################################################################
   * This is the only way for parent components to get the query parameters.
   */

  emitQueryParams() {

    // (1) Setting activeFilterNames (enabled form controls having a value).

    this.activeFilterNames = [];

    // Problems with form.value:
    // Includes disabled controls (id, name) when no enabled controls exist!?
    // { "id": 1, "name": "standard" }

    // form.value =
    // { "idFilter": ">20010", "nameFilter": "Foundation" }
    // form.getRawValue() =
    // { "id": 1, "name": "standard", "idFilter": ">20010", "nameFilter": "Foundation" }

    const obj = this.filterTemplateForm.form.value;
    // Object.keys(obj).forEach(key => {
    for (const key in obj) {
      if (key.includes('Filter') && obj[key]) {
        this.activeFilterNames.push(key);
      }
    }


    // (2) Setting queryParams.

    const queryParams = new QueryParams();

    if (this.activeFilterNames.length !== 0) {
      queryParams.filter = this.filterTemplateForm.form.value;
      this.searchInputModel = '';
    } else {
      // allFiltersEmpty()
      queryParams.searchTerm = this.searchInputModel;
    }


    // (3) Emitting queryParams.

    /////////////////////////////////////////
    this.queryParamsChange.emit(queryParams);
    /////////////////////////////////////////

    this.logMessage(
      `[emitQueryParams()] queryParams = \n ${JSON.stringify(queryParams)}`
    );


    // (4) Helpers for showing message.

    this.activeFiltersMessage = 'Currently no filters active.';

    if (queryParams.searchTerm) {
      this.activeFiltersMessage = `Searching in all fields: "${queryParams.searchTerm}"`;
    }

    if (queryParams.filter) {
      const nr = this.activeFilterNames.length;
      this.activeFiltersMessage = (nr === 0) ? 'Currently no filters active.'
        : (nr === 1) ? 'Currently 1 filter active: ' : `Currently ${nr} filters active: `;
    }


  }





  /**
   * Generating filter template questions for selectedFilterNames
   * (from customer questions).
   * ##################################################################
   */

  generateFilterTemplateQuestions(selectedFilterNames: string[]): QuestionBase[] {

    // if (!this.selectedFilterNames) {
    //   return {} as QuestionBase[];
    // }

    const fromQuestions = mockCustomerQuestions.filter(q => {
      return selectedFilterNames.includes(q.name + 'Filter');
    });

    // Questions without formArray questions.
    const questions = [];
    fromQuestions.forEach(q => {
      if (q.controlType !== 'formArray') {
        questions.push(q);
      }
    });

    const filterTemplateQuestions = questions.map(q => {

      const obj = {};

      obj['name'] = q.name + 'Filter';
      obj['controlType'] = 'textbox';
      // obj['inputType'] = 'textarea';
      obj['inputType'] = 'text';

      // obj['label'] = '';
      obj['hint'] = 'Filter by ' + q.label;
      // TODO
      if (q.inputType === 'number') {
        obj['toolTip'] = 'For example: 1000 (equal), <1000 (lower), >1000 (greater), 1000-2000 (between)';
      } else {
        obj['toolTip'] = '';
      }

      return obj;

    });

    const obj1 = { name: 'id', controlType: 'textbox', inputType: 'number', isDisabled: true };
    const obj2 = { name: 'name', controlType: 'textbox', inputType: 'string', isDisabled: true };

    filterTemplateQuestions.unshift(obj1, obj2); // add to the beginning


    return filterTemplateQuestions as QuestionBase[];
  }


  /**
   * Generating filter template form.
   * ##################################################################
   */

  generateFilterTemplateForm(questions: QuestionBase[]) {

    // this.filterTemplateForm.form = this.formGroupService.createFormGroup(questions);
    this.filterTemplateForm.createForm(questions);

    // this.getCustomers();

    this.logMessage(
      `[generateFilterTemplateForm()] this.filterTemplateForm.form.value = \n ${JSON.stringify(this.filterTemplateForm.form.value)}`
    );

    // this.onFilterTemplateFormValueChanges();
  }







  // onClearFilters() {
  //   // this.filterTemplateForm.form.reset();
  //   this.onSelectFilterTemplate('');

  // }




  /**
   * Event Handler that reacts on `mat-select` `selectionChange` events.
   * ##################################################################
   * The `selectionChange` event is emitted when the selected value has been changed by the user.
   *
   * @param name The name of the filter template.
   *


   *  filterTemplates = array of filterTemplate objects.
   *  filterTemplate = { idFilter: '>20010', nameFilter: 'Foundation' }
   *  selectedFilterNames = [idFilter, nameFilter]
   *
   *  The empty filterTemplate is the standard filterTemplate with empty filters.
   */

  onSelectFilterTemplate(name: string) {

    if (name) {
      this.searchInputModel = '';
    }


    // (1) Setting selectedFilterNames from selected filter template.

    const filterTemplate = this.filterTemplates.find(ft => ft.name === name);
    if (!filterTemplate) { return; }

    this.selectedFilterNames = [];

    Object.keys(filterTemplate).forEach((filterKey) => { // idFilter, nameFilter
      if (filterKey.includes('Filter')) {
        this.selectedFilterNames.push(filterKey);
      }
    });

    this.logMessage(
      `[onSelectFilterTemplate(name)] this.selectedFilterNames = \n ${JSON.stringify(this.selectedFilterNames)}`
    );


    // (2) Generating filterTemplate questions.
    this.filterTemplateQuestions = this.generateFilterTemplateQuestions(this.selectedFilterNames);

    // this.logMessage(
    //   `[onSelectFilterTemplate(name)] this.filterTemplateQuestions = \n ${JSON.stringify(this.filterTemplateQuestions)}`
    // );


    // (3) Generating filterTemplateForm.
    this.generateFilterTemplateForm(this.filterTemplateQuestions);


    // (4) Render filter template form.
    // this.renderFilterTemplateForm(name);
    this.filterTemplateForm.form.patchValue(filterTemplate);


    // (5) Emit QueryParams
    this.emitQueryParams();


    // (6) Set/Update selected filters.
    this.filterSelection.clear();
    this.selectedFilterNames.forEach(filter => this.filterSelection.select(filter));

    this.selectingFiltersTable.renderRows();


  }




  /**
   * Event Handler that reacts on selecting or deselecting a filter.
   * ##################################################################
   * The event is emitted when the checkbox's `checked` value changes.
   */

  onSelectFilter(name: string) {

    this.searchInputModel = '';

    const formValueSave = this.filterTemplateForm.form.value;


    // (1) Setting selectedFilterNames from selected (checked) filters.

    this.selectedFilterNames = [];

    this.availableFilterNames.forEach((filter, index) => {
      if (this.filterSelection.isSelected(filter)) {
        this.selectedFilterNames.push(filter);
      }
    });

    this.logMessage(
      `(1)[onSelectFilter()] this.selectedFilterNames = \n ${JSON.stringify(this.selectedFilterNames)}`
    );
    this.logMessage(
      `(1)[onSelectFilter()] this.filterSelection.selected = \n ${JSON.stringify(this.filterSelection.selected)}`
    );


    // (2) Generating filterTemplate questions for the selectedFilterNames.
    this.filterTemplateQuestions = this.generateFilterTemplateQuestions(this.selectedFilterNames);


    // (3) Generate filterTemplateForm.
    this.generateFilterTemplateForm(this.filterTemplateQuestions);


    // (4) Render filter template form
    // this.renderFilterTemplateForm(this.selectedFilterTemplateName);

    // analog this.customerForm.form.patchValue(this.customer);
    // this.filterTemplateForm.setFormValue(formValueSave);
    this.filterTemplateForm.form.patchValue(formValueSave);


    // (5) Emit QueryParams
    this.emitQueryParams();


  }



  onSearchInputChange() {

    if (this.selectedFilterTemplateName !== '') {
      this.selectedFilterTemplateName = '';
      this.onSelectFilterTemplate('');
    } else {
      this.emitQueryParams();
    }
  }






  /**
   * Renders the specified filter template form.
   * ##################################################################
   *
   * @param name The name of the filter template.
   */

  // renderFilterTemplateForm(name: string) {

  //   const filterTemplate = this.filterTemplates.find(ft => ft.name === name);
  //   if (!filterTemplate) { return; }

  //   // this.filterTemplateForm.setFormValue(filterTemplate);

  //   this.filterTemplateForm.form.patchValue(filterTemplate);
  //   /////////////////////////////////////////////////////

  // }




  // /**
  //  * Filter template form commit.
  //  */
  // onFilterTemplateFormSubmit(value) {
  //   this.filterTemplateFormValue = value;
  //   // this.selectedFilterTemplate = value;
  //   this.getCustomers();
  // }


  // searchCustomers() {
  //   this.filterTemplateFormValue = this.filterTemplateForm.form.value;
  //   this.getCustomers();
  // }


  // /**
  //  * ##################################################################
  //  * Filter configuration.
  //  * ##################################################################
  //  */
  // filterConfig(isGeneralSearch: boolean = true): any {
  //   const filter: any = {};
  //   const searchText: string = this.searchInput.nativeElement.value;

  //   // if (this.filterByStatus && this.filterByStatus.length > 0) {
  //   //   filter.status = +this.filterByStatus;
  //   // }

  //   // if (this.filterByType && this.filterByType.length > 0) {
  //   //   filter.type = +this.filterByType;
  //   // }

  //   // filter = this.filterForm.value;
  //   // filter.name = this.filterByName ? this.filterByName : searchText;
  //   // filter.country = this.filterByCountry ? this.filterByCountry : searchText;
  //   // filter.postalCode = this.filterByPostalCode ? this.filterByPostalCode : searchText;

  //   // if (!isGeneralSearch) {
  //   //   return filter;
  //   // }

  //   // filter.city = this.filterByCity ? this.filterByCity : searchText;


  //   return filter;
  // }






  /**
   * ##################################################################
   * Update selected customers (by opening a modal dialog.
   * TODO: multiple selections
   * ##################################################################
   */
  // updateCustomer(customer?: Customer) {
  //   if (!customer) {
  //     if (this.rowSelection.isEmpty()) {
  //       this.dialog.open(MessageDialogComponent, {
  //         data: {
  //           title: 'Update Selected Customers',
  //           message:
  //             'Please select the customers to update.',
  //           showActions: false
  //         }
  //       });
  //       return;
  //     }
  //     customer = this.rowSelection.selected[0];
  //   }

  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   // dialogConfig.height = "auto"; 800px
  //   // dialogConfig.minHeight = "auto"; 200px
  //   // dialogConfig.maxHeight = "auto"; 800px
  //   dialogConfig.panelClass = 'w3s-dialog-panel'; // in global styles.scss
  //   dialogConfig.data = { customer };

  //   // Open modal dialog and load CustomerDetailDialogComponent.
  //   // ################################################################
  //   const dialogRef = this.dialog.open(CustomerDetailDialogComponent, dialogConfig);

  //   dialogRef.afterClosed()
  //     .subscribe(
  //       res => {
  //         if (!res) { return; }
  //         this.getCustomers();
  //       }
  //     );
  // }


  /**
   * ##################################################################
   * Update a filter template.
   * ##################################################################
   */
  updateFilterTemplate(filterTemplate: CustomerFilterTemplate) {

    if (!this.selectedFilterTemplateName) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Save Filter Template',
          message: 'No filter template selected. Try Save As.',
          showActions: 'cancel',
        }
      });
      return;
    }

    if (this.filterTemplateForm.isEmpty) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Save Filter Template',
          message: 'Nothing to save. All filters are empty.',
          showActions: 'cancel',
        }
      });
      return;
    }



    this.customerFTService.updateCustomerFilterTemplate(filterTemplate)
      .subscribe(
        () => {
          // MOck: update the in memory filter templates (this.filterTemplates).
          // const idx = this.filterTemplates.findIndex(element => element.id === filterTemplate.id);
          // this.filterTemplates[idx] = filterTemplate;

          this.customerFTService.getCustomerFilterTemplates()
            .subscribe(
              (res) => {
                this.filterTemplates = res;

                this.emitQueryParams();
              }
            );

        },
      );

  }



  // ##################################################################
  // Helpers
  // ##################################################################

  /** Whether number of selected filters matches total number of filters. */
  allFiltersSelected(): boolean {
    const selected = this.filterSelection.selected.length;
    const all = this.availableFilterNames.length;
    return selected === all;
  }

  /** Selects all filters if not all selected; otherwise clears selection. */
  masterToggle3() {
    this.allFiltersSelected() ?
      this.filterSelection.clear() :
      this.availableFilterNames.forEach(filter => this.filterSelection.select(filter));
  }


  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[customer-filter-template.component.ts] ' + message);
  }

  /** Showing a user friendly message. */
  private showMessage(message: string) {
    return this.messageService.showMessage('*** ' + message + ' ***');
  }




  NIXonFilterTemplateFormValueChanges() {

    // Update activeFilterNames when a form control value changes.
    // Updates too often - moved to emitQueryParams()!

    this.filterTemplateForm.form.valueChanges.subscribe(val => {

      this.activeFilterNames = [];
      // const obj = this.filterTemplateForm.form.value;
      for (const key in val) {
        if (val[key]) {
          this.activeFilterNames.push(key);
        }
      }
    });

  }


}



    // Subscribing to searchInput changes.
    // ################################################################
    // Creating an observable from searchInput keyup events and
    // Whenever a 'keyup' event is emitted, a data load will be triggered.

    // fromEvent(this.searchInput.nativeElement, 'keyup')
    //   .pipe(
    //     // Wait 300ms after each keystroke before considering the term.
    //     debounceTime(300),

    //     // ignore new term if same as previous term
    //     // eliminating duplicate values
    //     distinctUntilChanged(),

    //     // switchMap((res) => {

    //     //   this.getCustomers();
    //     //   // Reset to first page.
    //     //   this.paginator.pageIndex = 0;

    //     // })

    //     tap(() => {
    //       this.paginator.pageIndex = 0;
    //       this.getCustomers();
    //     })
    //   )
    //   .subscribe();

    // // .subscribe(() => {

    // //   // getCustomers without queryParams.
    // //   // this.onClearFilters();
    // //   this.getCustomers();
    // //   // Reset to first page.
    // //   this.paginator.pageIndex = 0;
    // // });


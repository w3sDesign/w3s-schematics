/**
 * CustomerDetailComponent
 * and
 * CustomerDetailDialogComponent extends CustomerDetailComponent.
 */
import {
  Component, OnInit, Inject, ElementRef, ViewChild, ChangeDetectionStrategy, AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { CustomerService } from '../model/customer.service';
// import { HttpCustomerService } from '../model/http-customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { TypesUtilsService } from '../../shared/types-utils.service';
import { Customer } from '../model/customer';
import { countries } from '../../shared/countries';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { mockCustomerQuestions } from '../model/mock-customer-questions';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { DynamicFormOptions } from '../../shared/dynamic-form/dynamic-form-options';
// import { questionsConfig } from '../model/customer.config';
import { MessageService } from '../../shared/message.service';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import * as moment from 'moment';



// changeDetection: ChangeDetectionStrategy.OnPush
@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})

/**
 * Reusable detail component for creating and updating customers.
 * ####################################################################
 * Communicates with other components (the main List component)
 * via router navigation.
 */

export class CustomerDetailComponent implements OnInit, AfterViewInit {

  showTestValues = true;

  // customer: Customer | Observable<Customer>;
  customer$: Observable<Customer>;
  customer: Customer;

  // customerForm: FormGroup; // = static form
  // hasErrors = false;
  // hasChanged = false;

  title: string;

  // loadingAfterSubmit: boolean = false;
  // @ViewChild("nameInput") nameInput: ElementRef;

  countries: any[] = countries;

  // dialogRef: MatDialogRef<CustomerDetailDialogComponent>;
  matDialogData: any;


  /** Reference to the dynamic form component */
  // Not set before AfterViewInit.
  @ViewChild('customerForm', { static: false })
  customerForm: DynamicFormComponent;

  /** Questions for generating the dynamic form. */
  // TODO? Loading from server must be before app! APP-INITIALIZE?
  customerQuestions: QuestionBase[] = mockCustomerQuestions;

  /** Data group names (e.g. 'Basic Data', 'Addresses'). */
  dataGroupNames: string[] = [];



  // Compare <w3s-dynamic-form [ngClass]="customerFormClass"
  // customerFormClass: any = {
  //   'flex-box': true,
  // };


  /** Filter templates */
  // customers: Customer[]; // mockCustomerFilterTemplates;

  // customerFormValue: any = {};

  customerFormOptions: DynamicFormOptions = {
    formFieldAppearance: 'fill'
  };


  routeIds: string;
  routeDisplayedColumns: string;
  routeQueryParams: string;

  // test MatDatepicker
  date: FormControl;

  // Component constructor.
  // ##################################################################

  constructor(
    // public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    // data object from open.dialog(): data = { customer }
    // @Inject(MAT_DIALOG_DATA) public matDialogData: any,

    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private httpErrorHandler: HttpErrorHandler,
    private typesUtilsService: TypesUtilsService,
    private formGroupService: DynamicFormGroupService,
    private messageService: MessageService,
  ) {
    /** Setting data group names. */
    for (let i = 0; i < 100; i++) {
      const idx = this.customerQuestions.findIndex(question => question.group === i + 1);
      if (idx === -1) { break; }
      this.dataGroupNames[i] = this.customerQuestions[idx].groupName;
    }
  }


  // Component lifecycle hook.
  // ##################################################################
  // Called once after creating the component,
  // but before creating child components.

  //  @ViewChild customerForm not set before AfterViewInit!

  ngOnInit() {

    this.logMessage(`[ngOnInit()] ########################################`);

    this.logMessage(
      `(1)[ngOnInit()] this.route = \n ${this.route}`
    );

    // Loading customer data.
    // Updating form must be done in ngAfterViewInit.

    // Getting customer id from activated route.
    this.customer$ = this.route.paramMap.pipe(
      switchMap((routeParams: ParamMap) => {

        // Needed in navigateToList().
        this.routeIds = routeParams.get('ids');
        this.routeDisplayedColumns = routeParams.get('displayedColumns');
        this.routeQueryParams = routeParams.get('queryParams');

        if (+routeParams.get('id') === 0) {
          this.title = 'Create Customer';
          return of(new Customer());
          ///////////////////////////////////////////////////////////////

        } else {

          this.title = 'Update Customer';
          return this.customerService.getCustomer(+routeParams.get('id'));
          ///////////////////////////////////////////////////////////////

        }

      })
    );


    this.customer$.subscribe(
      res => {
        this.customer = res;

        // Error handler service (in customer service) returns {} in case
        // of an error (e.g. if the customer is not found).
        // So we need to check if the customer is defined, not null;
        // and not {} by checking the customer.id.

        // if (this.customer && this.customer.id >= 0) {
        if (this.customer && this.customer.id > 0) {

          // Updating form

          this.logMessage(
            `1[ngOnInit()] this.customer = \n ${JSON.stringify(this.customer)}`
          );

          setTimeout(() => {

            this.logMessage(
              `2[ngOnInit()] this.customer = \n ${JSON.stringify(this.customer)}`
            );

            const cd = this.customerForm.form.get('creationDate');

            // cd.disable({ emitEvent: false });

            // Update form (?except creationDate).
            this.customerForm.form.patchValue(this.customer);

            // cd.enable({ emitEvent: false });
            // cd.markAsPristine();

            // Set creation date with a moment (needed by matDatepicker).
            // strict mode true/false
            cd.setValue(moment(this.customer.creationDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], false));

            this.addFormArrays(this.customer);

          });
        }


      });


  }


  // Component lifecycle hook.
  // ##################################################################
  // Called once after creating the child components.

  ngAfterViewInit() {

    this.logMessage(`[ngAfterViewInit()] ========================================`);

    // this.customerForm.form.valueChanges.subscribe(val => {
    //   this.customerFormHasChanged = true;
    // });






  }


  // ##################################################################
  // Component public member methods (in alphabetical order).
  // ##################################################################


  /**
   * Adding formArrays if existent (like additional addresses/contacts).
   * ##################################################################
   * (analog to DynamicFormQuestionComponent).
   */

  addFormArrays(customer: Customer) {

    this.customerQuestions.forEach(question => {
      if (question.controlType === 'formArray' && customer[question.name]) {

        const l = customer[question.name].length;
        if (l > 0) {
          for (let i = 0; i < l; i++) {

            // Creating a FormGroup for each *nested* question.
            const formGroup = this.formGroupService.createFormGroup(question.nestedQuestions);

            // Adding this new FormGroup to the FormArray.
            const formArray = this.customerForm.form.get(question.name) as FormArray;
            formArray.push(formGroup);

          }
          const cd = this.customerForm.form.get('creationDate');

          // cd.disable({ emitEvent: false });

          // Update form (?except creationDate).
          this.customerForm.form.patchValue(this.customer);

          // cd.enable({ emitEvent: false });
          // cd.markAsPristine();

          // Set creation date with a moment (needed by matDatepicker).
          // strict mode true/false
          cd.setValue(moment(this.customer.creationDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], false));


          // this.customerForm.form.patchValue(customer);
        }

      }
    });

  }


  /**
   * Creating a new customer (delegating to customer service).
   * ##################################################################
   */

  createCustomer() {

    const customer: Customer = this.customerForm.form.getRawValue();

    const cd = this.customerForm.form.get('creationDate');
    // cd.value is a moment
    customer.creationDate = cd.value.format('YYYY-MM-DD');

    this.customerService.createCustomer(customer)
      .subscribe(res => {
        this.navigateToList(customer);
      });

  }



  /**
   * Navigating back to the CustomerListComponent.
   * ##################################################################
   *  https://angular.io/guide/router#navigating-back-to-the-list-component
   */

  navigateToList(customer?: Customer) {

    this.router.navigate(['/customers', {
      id: customer ? customer.id : null,
      ids: this.routeIds,
      displayedColumns: this.routeDisplayedColumns,
      queryParams: this.routeQueryParams,
    }]);

  }


  // onAlertClose($event) {
  //   this.hasErrors = false;
  // }



  /** Two update variants: */

  /**
   * 1. Customer form commit. TO DO Create or update customer.
   * onDynamicFormSubmit
   * ##################################################################
   */

  onCustomerFormSubmit() {

    // this.updateCustomer(this.customerForm.form.value);


    // this.updateCustomer(this.customer);

  }


  /**
   * 2. SaveDyn button. TO DO Create or update customer.
   * ##################################################################
   */
  // saveDyn() {
  //   this.updateCustomer(this.customerForm.form.value);

  // }



  /**
   * OLD Build form (static version).
   * ##################################################################
   */
  // buildForm() {
  //   this.title = this.customer.id ? 'Update Customer' : 'Create Customer';

  //   this.customerForm = this.formBuilder.group({
  //     id: [this.customer.id],
  //     name: [this.customer.name, Validators.required],
  //     type: [this.customer.type.toString(), Validators.required],
  //     status: [this.customer.status.toString(), Validators.required],
  //     // Addresses
  //     country: [this.customer.country, Validators.required],
  //     postalCode: [this.customer.postalCode, Validators.required],
  //     city: [this.customer.city, Validators.required],
  //     street: [this.customer.street, Validators.required],
  //     // Contacts
  //     department: [this.customer.department],
  //     person: [this.customer.person],
  //     phone: [this.customer.phone, Validators.required],
  //     email: [this.customer.email, [Validators.required, Validators.email]]
  //   });
  //   // this.customer.dob = this.typesUtilsService.getDateFromString(this.customer.dateOfBbirth);
  // }

  /** UI */
  // getTitle(): string {
  //   return this.customer.id ? "Update Customer" : "Create Customer";

  // if (this.customer.id > 0) {
  //   return `Update Customer: ${this.customer.id} / ${this.customer.name}` ;
  // }
  // return "Create Customer";
  // }

  // isControlInvalid(controlName: string): boolean {
  //   const control = this.customerForm.controls[controlName];
  //   const result = control.invalid && control.touched;
  //   return result;
  // }

  /** ACTIONS */
  prepareCustomer(): Customer {
    const controls = this.customerForm.controls;
    const preparedCustomer = new Customer();

    preparedCustomer.id = this.customer.id;
    preparedCustomer.name = controls['name'].value;
    preparedCustomer.type = controls['type'].value;
    preparedCustomer.status = controls['status'].value;
    // Addresses
    preparedCustomer.country = controls['country'].value;
    preparedCustomer.postalCode = controls['postalCode'].value;
    preparedCustomer.city = controls['city'].value;
    preparedCustomer.street = controls['street'].value;
    // Contacts
    preparedCustomer.department = controls['department'].value;
    preparedCustomer.person = controls['person'].value;
    preparedCustomer.phone = controls['phone'].value;
    preparedCustomer.email = controls['email'].value;
    // console.log("preparedCustomer", preparedCustomer);

    return preparedCustomer;
  }

  // save() {

  //   this.hasErrors = false;
  //   // this.loadingAfterSubmit = false;
  //   const controls = this.customerForm.form.controls;
  //   /** check form */
  //   if (this.customerForm.form.invalid) {
  //     Object.keys(controls).forEach(controlName =>
  //       controls[controlName].markAsTouched()
  //     );
  //     this.hasErrors = true;
  //     return;
  //   }

  //   const editedCustomer: Customer = this.prepareCustomer();

  //   if (editedCustomer.id > 0) {
  //     this.updateCustomer(editedCustomer);
  //   } else {
  //     this.createCustomer(editedCustomer);
  //   }
  // }


  /**
   * Update customer (delegating to customer service).
   * ##################################################################
   */

  updateCustomer() {

    const customer: Customer = this.customerForm.form.getRawValue();

    const cd = this.customerForm.form.get('creationDate');
    // cd.value is a moment
    customer.creationDate = cd.value.format('YYYY-MM-DD');


    this.customerService.updateCustomer(customer)
      .subscribe(res => {

        this.logMessage(
          `1[updateCustomer()] customer = \n ${JSON.stringify(customer)}`
        );

        this.navigateToList(customer);
      });
  }




  // ##################################################################
  // Component non public member methods.
  // ##################################################################


  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[customer-detail.component.ts] ' + message);
  }

  /** Showing a user friendly message. */
  private showMessage(message: string) {
    return this.messageService.showMessage('*** ' + message + ' ***');
  }

}




/**
 * ####################################################################
 * CustomerDetailDialogComponent
 * ####################################################################
 *   Called from CustomerListComponent via:
 *     dialog.open(CustomerDetailDialogComponent, dialogConfig);
 *     and dialogConfig.data = { customer }
 * ####################################################################
 */
export class CustomerDetailDialogComponent extends CustomerDetailComponent implements OnInit, AfterViewInit {

  // /** Reference to the dynamic form component */
  // @ViewChild(DynamicFormComponent)
  // dynFormComponent: DynamicFormComponent;


  constructor(
    public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    // data object from open.dialog(): data = { customer }
    @Inject(MAT_DIALOG_DATA) public matDialogData: any,

    formBuilder: FormBuilder,

    router: Router,
    route: ActivatedRoute,
    customerService: CustomerService,
    httpErrorHandler: HttpErrorHandler,
    typesUtilsService: TypesUtilsService,
    formGroupService: DynamicFormGroupService,
    messageService: MessageService,
  ) {
    super(formBuilder, router, route, customerService, httpErrorHandler, typesUtilsService, formGroupService, messageService);
    // this.isDialogComponent = true;
  }


  ngOnInit() { }


  ngAfterViewInit() {

    this.customer = this.matDialogData.customer;


    // @ViewChild customerForm not set before AfterViewInit!
    this.customerForm.form.patchValue(this.customer);

    this.addFormArrays(this.customer);

  }


  navigateToList(customer?: Customer) {

    this.dialogRef.close({
      customer,
      isEdit: true
    });

  }
}

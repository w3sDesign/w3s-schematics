/**
 * CustomerDetailComponent
 * and
 * CustomerDetailDialogComponent extends CustomerDetailComponent.
 */
import {
  Component, OnInit, Inject, ElementRef, ViewChild, ChangeDetectionStrategy
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpCustomerService } from '../model/http-customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { TypesUtilsService } from '../../shared/types-utils.service';
import { Customer } from '../model/customer';
import { countries } from '../../shared/countries';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

// changeDetection: ChangeDetectionStrategy.OnPush
@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  // customer: Customer | Observable<Customer>;
  customer$: Observable<Customer>;
  customer: Customer;

  customerForm: FormGroup;
  hasErrors = false;
  isLoading = false;
  title = '';

  // loadingAfterSubmit: boolean = false;
  // @ViewChild("nameInput") nameInput: ElementRef;

  countries: any[] = countries;

  // dialogRef: MatDialogRef<CustomerDetailDialogComponent>;
  data: any;

  constructor(
    // public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    // data object from open.dialog(): data = { customer }
    // @Inject(MAT_DIALOG_DATA) public data: any,

    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: HttpCustomerService,
    private httpErrorHandler: HttpErrorHandler,
    private typesUtilsService: TypesUtilsService
  ) {
    // this.isDialogComponent = false;
  }

  /** LOAD DATA */
  ngOnInit() {
    // if (this.isDialogComponent) {
    //   this.customer = this.data.customer;
    //   this.buildForm();
    // } else {

    // this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) =>
    //     this.customerService.getCustomer(+params.get('id'))),
    //   tap(res => this.customer = res),
    //   tap(res => console.log(res)),
    //   tap(() => this.buildForm())
    // )
    //   .subscribe(x => console.log(x));

    if (this.route) {
      this.customer$ = this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.customerService.getCustomer(+params.get('id'))));

      this.customer$.subscribe(
        res => {
          // console.log(res);
          this.customer = res;
          this.buildForm();
        }
      );
    }

    //   // /* Server loading imitation. Remove this on real code */
    //   // this.isLoading = true;
    //   // setTimeout(() => {
    //   //   this.isLoading = false;
    //   // }, 500);
  }


  buildForm() {
    this.title = this.customer.id ? 'Update Customer' : 'Create Customer';

    this.customerForm = this.formBuilder.group({
      id: [this.customer.id],
      name: [this.customer.name, Validators.required],
      type: [this.customer.type.toString(), Validators.required],
      status: [this.customer.status.toString(), Validators.required],
      // Addresses
      country: [this.customer.country, Validators.required],
      postalCode: [this.customer.postalCode, Validators.required],
      city: [this.customer.city, Validators.required],
      street: [this.customer.street, Validators.required],
      // Contacts
      department: [this.customer.department],
      person: [this.customer.person],
      phone: [this.customer.phone, Validators.required],
      email: [this.customer.email, [Validators.required, Validators.email]]
    });
    // this.customer.dob = this.typesUtilsService.getDateFromString(this.customer.dateOfBbirth);
  }

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
    preparedCustomer.type = +controls['type'].value;
    preparedCustomer.status = +controls['status'].value;
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

  save() {

    this.hasErrors = false;
    // this.loadingAfterSubmit = false;
    const controls = this.customerForm.controls;
    /** check form */
    if (this.customerForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasErrors = true;
      return;
    }

    const editedCustomer = this.prepareCustomer();

    if (editedCustomer.id > 0) {
      this.updateCustomer(editedCustomer);
    } else {
      this.createCustomer(editedCustomer);
    }
  }



  returnToList(customer?: Customer) {
    this.router.navigate(['/customers']);
    // this.router.navigate(['/customers', {id: customer.id}]);
    // this.router.navigate(['/customers', row.id]);
    // if (this.dialogRef) {
    //   this.dialogRef.close({
    //     customer,
    //     isEdit: true
    //   });
    // }
  }

  /**
   * Update customer (delegating to customer service).
   * @param customer
   */
  updateCustomer(customer: Customer) {
    // this.loadingAfterSubmit = true;
    this.isLoading = true;

    this.customerService.updateCustomer(customer)
      .subscribe(res => {
        /* Server loading imitation. Remove this on real code */
        this.isLoading = false;
        this.returnToList(customer);
      });
  }

  /**
   * Create new Customer (delegating to customer service).
   * @param customer
   */
  createCustomer(customer: Customer) {
    // this.loadingAfterSubmit = true;
    this.isLoading = true;

    this.customerService.createCustomer(customer)
      .subscribe(res => {
        this.isLoading = false;
        this.returnToList(customer);
      });
  }

  onAlertClose($event) {
    this.hasErrors = false;
  }
}




/**
 * Called from CustomerListComponent via:
 * dialog.open(CustomerDetailDialogComponent, dialogConfig);
 * and dialogConfig.data = { customer }
 */
export class CustomerDetailDialogComponent extends CustomerDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    // data object from open.dialog(): data = { customer }
    @Inject(MAT_DIALOG_DATA) public data: any,

    formBuilder: FormBuilder,

    router: Router,
    route: ActivatedRoute,
    customerService: HttpCustomerService,
    httpErrorHandler: HttpErrorHandler,
    typesUtilsService: TypesUtilsService
  ) {
    super(formBuilder, router, route, customerService, httpErrorHandler, typesUtilsService);
    // this.isDialogComponent = true;
  }

  ngOnInit() {
    this.customer = this.data.customer;
    this.buildForm();
  }

  returnToList(customer?: Customer) {
    this.dialogRef.close({
      customer,
      isEdit: true
    });

  }
}

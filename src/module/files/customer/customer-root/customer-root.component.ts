/**
 * CustomerRootComponent is the root of the customer feature area,
 * just as AppComponent is the root of the entire app.
 *
 * It is a shell for the customer management feature area,
 * just as the AppComponent is a shell to manage the high-level workflow
 *
 * (https://angular.io/guide/router#a-crisis-center-with-child-routes).
 *
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-root',
  templateUrl: './customer-root.component.html',
  styleUrls: ['./customer-root.component.scss']
})
export class CustomerRootComponent { }

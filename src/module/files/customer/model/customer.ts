import * as moment from 'moment';
import { Moment } from 'moment';

export interface Address {
  // type?: AddressType = other;
  country: string;
  postalCode: string;
  city: string;
  street: string;
}
export interface Contact {
  // type?: ContactType = other;
  department: string;
  person: string;
  phone: string;
  email: string;
}

// TODO
export type CustomerType = 'business' | 'individual' | 'other' | '';
export type CustomerStatus = 'active' | 'suspended' | 'pending' | '';

export type AddressType = 'shipping' | 'billing' | 'other';


/**
 * Customer data definition.
 * ####################################################################
 */

export class Customer {
  // Basic Data
  id = 0;
  name = '';
  type?: CustomerType = '';
  status?: CustomerStatus = '';

  homepage ?= '';
  comment ?= '';
  creationDate ?: string;


  // Main address
  country ?= '';
  postalCode ?= '';
  city ?= '';
  street ?= '';

  // Additional Addresses
  addAddresses?: Address[];

  // Main contact
  department ?= '';
  person ?= '';
  phone ?= '';
  email ?= '';

  // Additional Contacts
  addContacts?: Contact[];
}




/**
 * Customer filter template data definition.
 * ####################################################################
 * Includes all fields from `Customer`.
 */

export class CustomerFilterTemplate {

  id = 0;
  name = '';

  // Basic Data
  idFilter ?= '';
  nameFilter ?= '';
  typeFilter ?= '';
  statusFilter ?= '';
  commentFilter ?= '';
  creationDateFilter ?= '';

  // Main Address
  countryFilter ?= '';
  postalCodeFilter ?= '';
  cityFilter ?= '';
  streetFilter ?= '';

  // Main contact
  departmentFilter ?= '';
  personFilter ?= '';
  phoneFilter ?= '';
  emailFilter ?= '';
}


// export const customerFilterMap = {
//   customerId: 'id',
//   customerName: 'name',
//   customerStreet: 'addresses[0].street',
//   customerPostalCode: 'addresses[0].postalCode',
//   customerCity: 'addresses[0].city',
//   customerCountry: 'addresses[0].country',
// };




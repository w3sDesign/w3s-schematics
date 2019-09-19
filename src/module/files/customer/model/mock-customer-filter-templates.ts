import { CustomerFilterTemplate } from './customer-filter-template';

export const mockCustomerFilterTemplates: CustomerFilterTemplate[] = [
  {
    // Empty filter template.
    id: 0,
    name: '',
  },
  {
    id: 1,
    name: 'standard',

    idFilter: '>20010',
    nameFilter: 'Foundation',

  },

  {
    id: 2,
    name: 'myTemplate',

    nameFilter: 'consulting',
    countryFilter: 'state',
    postalCodeFilter: '',
  },

];

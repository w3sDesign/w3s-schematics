import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { betweenDateValidator } from '../../shared/form-validators/between-date.directive';
import { Validators } from '@angular/forms';

import * as moment from 'moment';
////////////////////
moment.locale('de');
////////////////////

export const mockCustomerQuestions: QuestionBase[] = [

  // Group 1: Basic Data

  {
    name: 'id',
    defaultValue: 0,
    label: 'Id',
    tooltip: 'Auto-generated unique number',
    controlType: 'textbox',
    inputType: 'number',
    group: 1,
    groupName: 'Basic Data',
    order: 110,
    isRequired: true,
    // isDisabled: false,
    isReadonly: true,
  },
  {
    name: 'name',
    defaultValue: '',
    label: 'Name',
    tooltip: 'Full company name',
    controlType: 'textbox',
    // inputType: 'textarea',
    inputType: 'text',
    group: 1,
    groupName: 'Basic Data',
    order: 120,
    isRequired: true,

    // Validators array.
    validators: [
      Validators.required,
    ],
    validationErrors: {
      'required': 'Name required.',
    },

  },
  {
    name: 'type',
    defaultValue: 'business',
    label: 'Customer Type',
    controlType: 'dropdown',
    inputType: '',
    group: 1,
    groupName: 'Basic Data',
    order: 130,
    isRequired: true,

    validators: [
      Validators.required,
    ],
    validationErrors: {
      'required': 'Customer type required.',
    },


    options: [
      { key: 'business', value: 'Business' },
      { key: 'individual', value: 'Individual' },
      { key: 'other', value: 'Other' },
    ],
  },

  {
    name: 'status',
    defaultValue: 'active',
    label: 'Customer Status',
    controlType: 'dropdown',
    inputType: '',
    group: 1,
    groupName: 'Basic Data',
    order: 140,
    isRequired: true,

    validators: [
      Validators.required,
    ],
    validationErrors: {
      'required': 'Customer status required.',
    },

    options: [
      { key: 'active', value: 'Active' },
      { key: 'suspended', value: 'Suspended' },
      { key: 'pending', value: 'Pending' },
      // { key: 'unproven', value: 'Unproven' }
    ],
  },

  {
    name: 'comment',
    defaultValue: '',
    label: 'Comment',
    controlType: 'textbox',
    inputType: 'textarea',
    group: 1,
    groupName: 'Basic Data',
    order: 150,
  },

  {
    name: 'creationDate',
    defaultValue: '',
    label: 'Creation Date',
    controlType: 'textbox',
    inputType: 'date',
    group: 1,
    groupName: 'Basic Data',
    order: 160,
    isRequired: true,

    validators: [
      Validators.required,
      betweenDateValidator(moment('1970-01-01'), moment()),
    ],
    // Error code
    validationErrors: {
      // errorCode: errorMessage
      'required': 'Date required.',
      // TODO format('L') not needed!?
      'betweenDate': `Date not between ${moment('1970-01-01').format('L')} and ${moment().format('L')}.`
    },

  },


  // Group 2: Main Address

  {
    name: 'country',
    defaultValue: 'Austria',
    label: 'Country',
    controlType: 'dropdown',
    inputType: '',
    group: 2,
    groupName: 'Main Address',
    order: 210,
    isRequired: true,

    validators: [
      Validators.required,
    ],
    validationErrors: {
      'required': 'Country required.',
    },



    options: [
      { key: 'Albania', value: 'Albania' },
      { key: 'Algeria', value: 'Algeria' },
      { key: 'Argentina', value: 'Argentina' },
      { key: 'Armenia', value: 'Armenia' },
      { key: 'Australia', value: 'Australia' },
      { key: 'Austria', value: 'Austria' },
      { key: 'Belgium', value: 'Belgium' },
      { key: 'Bolivia', value: 'Bolivia' },
      { key: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina' },
      { key: 'Brazil', value: 'Brazil' },
      { key: 'Bulgaria', value: 'Bulgaria' },
      { key: 'Canada', value: 'Canada' },
      { key: 'Chile', value: 'Chile' },
      { key: 'China', value: 'China' },
      { key: 'Colombia', value: 'Colombia' },
      { key: 'Croatia', value: 'Croatia' },
      { key: 'Cuba', value: 'Cuba' },
      { key: 'Cyprus', value: 'Cyprus' },
      { key: 'Czech Republic', value: 'Czech Republic' },
      { key: 'Denmark', value: 'Denmark' },
      { key: 'Egypt', value: 'Egypt' },
      { key: 'Finland', value: 'Finland' },
      { key: 'France', value: 'France' },
      { key: 'Georgia', value: 'Georgia' },
      { key: 'Germany', value: 'Germany' },
      { key: 'Greece', value: 'Greece' },
      { key: 'Hungary', value: 'Hungary' },
      { key: 'Iceland', value: 'Iceland' },
      { key: 'India', value: 'India' },
      { key: 'Indonesia', value: 'Indonesia' },
      { key: 'Iran', value: 'Iran' },
      { key: 'Iraq', value: 'Iraq' },
      { key: 'Ireland', value: 'Ireland' },
      { key: 'Israel', value: 'Israel' },
      { key: 'Italy', value: 'Italy' },
      { key: 'Japan', value: 'Japan' },
      { key: 'Korea, Republic of', value: 'Korea, Republic of' },
      { key: 'Liberia', value: 'Liberia' },
      { key: 'Liechtenstein', value: 'Liechtenstein' },
      { key: 'Lithuania', value: 'Lithuania' },
      { key: 'Luxembourg', value: 'Luxembourg' },
      { key: 'Macedonia', value: 'Macedonia' },
      { key: 'Malta', value: 'Malta' },
      { key: 'Mexico', value: 'Mexico' },
      { key: 'Moldova, Republic of', value: 'Moldova, Republic of' },
      { key: 'Monaco', value: 'Monaco' },
      { key: 'Mongolia', value: 'Mongolia' },
      { key: 'Morocco', value: 'Morocco' },
      { key: 'Netherlands', value: 'Netherlands' },
      { key: 'Norway', value: 'Norway' },
      { key: 'Oman', value: 'Oman' },
      { key: 'Pakistan', value: 'Pakistan' },
      { key: 'Peru', value: 'Peru' },
      { key: 'Philippines', value: 'Philippines' },
      { key: 'Poland', value: 'Poland' },
      { key: 'Portugal', value: 'Portugal' },
      { key: 'Romania', value: 'Romania' },
      { key: 'Russian Federation', value: 'Russian Federation' },
      { key: 'Saudi Arabia', value: 'Saudi Arabia' },
      { key: 'Serbia and Montenegro', value: 'Serbia and Montenegro' },
      { key: 'Slovakia', value: 'Slovakia' },
      { key: 'Slovenia', value: 'Slovenia' },
      { key: 'South Africa', value: 'South Africa' },
      { key: 'Spain', value: 'Spain' },
      { key: 'Sweden', value: 'Sweden' },
      { key: 'Switzerland', value: 'Switzerland' },
      { key: 'Thailand', value: 'Thailand' },
      { key: 'Tunisia', value: 'Tunisia' },
      { key: 'Turkey', value: 'Turkey' },
      { key: 'Ukraine', value: 'Ukraine' },
      { key: 'United Arab Emirates', value: 'United Arab Emirates' },
      { key: 'United Kingdom', value: 'United Kingdom' },
      { key: 'United States', value: 'United States' },
      { key: 'Uruguay', value: 'Uruguay' },
      { key: 'Venezuela', value: 'Venezuela' },
      { key: 'Viet Nam', value: 'Viet Nam' },
      { key: 'Yemen', value: 'Yemen' },
      { key: 'Zambia', value: 'Zambia' },
    ]
  },
  {
    name: 'postalCode',
    defaultValue: '',
    label: 'Postal Code',
    controlType: 'textbox',
    inputType: 'text',
    group: 2,
    groupName: 'Main Address',
    order: 220,
    isRequired: true,

    validators: [
      Validators.required,
    ],
    validationErrors: {
      'required': 'PostalCode required.',
    },

  },
  {
    name: 'city',
    defaultValue: '',
    label: 'City',
    controlType: 'textbox',
    inputType: 'text',
    group: 2,
    groupName: 'Main Address',
    order: 230,
    isRequired: true,

    validators: [
      Validators.required,
    ],
    validationErrors: {
      'required': 'City required.',
    },

  },
  {
    name: 'street',
    defaultValue: '',
    label: 'Street',
    controlType: 'textbox',
    inputType: 'text',
    group: 2,
    groupName: 'Main Address',
    order: 240,
    isRequired: true,

    validators: [
      Validators.required,
    ],
    validationErrors: {
      'required': 'Street required.',
    },

  },


  // Additional Addresses

  {
    name: 'addAddresses',
    defaultValue: '',
    controlType: 'formArray',
    group: 3,
    groupName: 'Additional Addresses',
    nestedQuestions: [
      {
        name: 'country',
        defaultValue: '',
        label: 'Country',
        controlType: 'textbox',
        inputType: 'text',
        // group: 2,
        order: 310,
        // isRequired: false,
        // isDisabled: false,
      },
      {
        name: 'postalCode',
        defaultValue: '',
        label: 'Postal Code',
        controlType: 'textbox',
        inputType: 'text',
        // group: 2,
        order: 320,
        // isRequired: false,
        // isDisabled: false,
      },
      {
        name: 'city',
        defaultValue: '',
        label: 'City',
        controlType: 'textbox',
        inputType: 'text',
        // group: 2,
        order: 330,
        // isRequired: false,
        // isDisabled: false,
      },
      {
        name: 'street',
        defaultValue: '',
        label: 'Street',
        controlType: 'textbox',
        inputType: 'text',
        // group: 2,
        order: 340,
        // isRequired: false,
        // isDisabled: false,
      },
    ]
  },


  // Group 5: Main Contact

  {
    name: 'department',
    defaultValue: '',
    label: 'Contact Department',
    controlType: 'textbox',
    inputType: 'text',
    group: 4,
    groupName: 'Main Contact',
    order: 410,
  },

  {
    name: 'person',
    defaultValue: '',
    label: 'Contact Person',
    controlType: 'textbox',
    inputType: 'text',
    group: 4,
    groupName: 'Main Contact',
    order: 420,
  },

  {
    name: 'phone',
    defaultValue: '',
    label: 'Phone',
    controlType: 'textbox',
    inputType: 'text',
    group: 4,
    groupName: 'Main Contact',
    order: 430,

  },

  {
    name: 'email',
    defaultValue: '',
    label: 'Email',
    controlType: 'textbox',
    inputType: 'email',
    group: 4,
    groupName: 'Main Contact',
    order: 440,
    isRequired: true,

    validators: [
      Validators.required,
      Validators.email,
    ],
    validationErrors: {
      'required': 'Email required.',
      'email': 'Not a valid email.',
    },

  },

  // Group 6: Additional Contacts


];





// TODO !?

// export class CustomerFilterTemplateQuestions {

//   getQuestions(): QuestionBase[] {

//     const questions: QuestionBase[] = [
//      .....
//     ];

//     return questions.sort((a, b) => a.order - b.order);
//   }
// }

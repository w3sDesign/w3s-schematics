import { CustomerFilterTemplate } from './customer-filter-template';
import { QuestionBase } from '../../shared/dynamic-form/question-base';

////////////////////////////////////////////////////////////////////
/// NIX used! - is generated!
////////////////////////////////////////////////////////////////////

export const mockCustomerFilterTemplateQuestions: QuestionBase[] = [
  {
    name: 'id',
    defaultValue: 0,
    label: 'Template Id',
    controlType: 'textbox',
    inputType: 'number',
    group: 0, // no grouping
    order: 1,
    isRequired: false,
    isDisabled: true,
  },
  {
    name: 'name',
    defaultValue: 'standard',
    label: 'Template Name',
    controlType: 'textbox',
    inputType: 'text',
    group: 0,
    order: 2,
    isRequired: false,
    isDisabled: true,
  },

  {
    name: 'customerId',
    defaultValue: '', // this.test.defaultValue,
    label: 'Filter by Customer Id',
    controlType: 'textbox',
    inputType: 'text',
    group: 0,
    order: 10,
    isRequired: false,
    isDisabled: false,
  },
  {
    name: 'customerName',
    defaultValue: '',
    label: 'Filter by Customer Name',
    controlType: 'textbox',
    inputType: 'text',
    group: 1,
    order: 20,
    isRequired: false,
    isDisabled: false,
  },

// Addresses
{
  name: 'customerPostalCode',
  defaultValue: '',
  label: 'Filter by Postal Code',
  controlType: 'textbox',
  inputType: 'textarea',
  group: 0,
  order: 30,
  isRequired: false,
  isDisabled: false,
},
{
  name: 'customerCity',
  defaultValue: '',
  label: 'Filter by City',
  controlType: 'textbox',
  inputType: 'textarea',
  group: 0,
  order: 30,
  isRequired: false,
  isDisabled: false,
},

  // {
  //   name: 'customerEmail',
  //   defaultValue: '',
  //   label: 'Filter by Email',
  //   controlType: 'textbox',
  //   inputType: 'text',
  //   order: 40,
  //   isRequired: false,
  // },
  // {
  //   name: 'customerStatus',
  //   defaultValue: '',
  //   label: 'Filter by Status',
  //   controlType: 'dropdown',
  //   inputType: '',
  //   order: 50,
  //   isRequired: false,

  //   options: [
  //     { key: 'solid', value: 'Solid' },
  //     { key: 'great', value: 'Great' },
  //     { key: 'good', value: 'Good' },
  //     { key: 'unproven', value: 'Unproven' }
  //   ],
  // }

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

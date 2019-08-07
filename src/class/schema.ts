export interface Schema {
  name: string;
  path?: string;
  project?: string;
  spec?: boolean;
  skipTests?: boolean;
  type?: string;
  lintFix?: boolean;
}

//   }
//     spec: {
//       type: 'boolean',
//       description: 'When true (the default), generates a  "spec.ts" test file for the new class.',
//       'default': true,
//       'x-deprecated': 'Use "skipTests" instead.'
//     },
//     skipTests: {
//       type: 'boolean',
//       description: 'When true, does not create "spec.ts" test files for the new class.',
//       'default': false,
//       'x-user-analytics': 12
//     },
//     type: {
//       type: 'string',
//       description: 'Adds a developer-defined type to the filename, in the format "name.type.ts".',
//       'default': ''
//     },
//     lintFix: {
//       type: 'boolean',
//       'default': false,
//       description: 'When true, applies lint fixes after generating the class.',
//       'x-user-analytics': 15
//     }
//   },
//   required: [
//     'name'
//   ]
// }

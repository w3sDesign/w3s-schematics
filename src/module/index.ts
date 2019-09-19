// gf Copy from @schematics/angular/module/index.ts

import { Path, normalize, strings } from '@angular-devkit/core';

import {
  Rule,
  SchematicsException,
  Tree,
  apply,
  applyTemplates,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  schematic,
  url,
  FileEntry,
  forEach,
} from '@angular-devkit/schematics';

import * as ts from '../third_party/github.com/Microsoft/TypeScript/lib/typescript';
// import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { addImportToModule, addRouteDeclarationToModule } from '../utility/ast-utils';
// import { addImportToModule, addRouteDeclarationToModule } from '@schematics/angular/utility/ast-utils';

import { InsertChange } from '../utility/change';
// import { InsertChange } from '@schematics/angular/utility/change';

import { buildRelativePath, findModuleFromOptions } from '../utility/find-module';
// import { buildRelativePath, findModuleFromOptions } from '@schematics/angular/utility/find-module';

import { applyLintFix } from '../utility/lint-fix';
// import { applyLintFix } from '@schematics/angular/utility/lint-fix';

import { parseName } from '../utility/parse-name';
// import { parseName } from '@schematics/angular/utility/parse-name';

import { createDefaultPath } from '../utility/workspace';
// import { createDefaultPath } from '@schematics/angular/utility/workspace';

import { RoutingScope, Schema as ModuleOptions } from './schema';


/////////////////////////////////////////////////
// function replacer(match: string): string {
//   if (match.charAt(0) === 'UPPERCASE') {
//     return options.name.charAt(0).toUpperCase() + name.substr(1);
//   } else {
//     return name;
//   }
// }

function replace1(options: ModuleOptions): Rule {

  // The forEach function returns a rule function that accepts a tree,
  // applies the defined operator function to every file of the tree,
  // and returns the new tree.
  return forEach(

    // File operator function that accepts a file entry,
    // transforms file content and path,
    // and returns the transformed file entry.
    entry => {


      // const nameRe = /customer/g; // OK

      // const nameRe = /\${options.referenceName}/g;
      // const nameRe = new RegExp('${options.referenceName}', 'g');
      // const nameRe = new RegExp('customer', 'g'); // OK
      const name = `(${options.referenceName})`; //'customer';
      const nameRe = new RegExp(name, 'gi');

      const contentStr = entry.content.toString('utf-8');


      return {
        // content: Buffer.from(contentStr.replace(nameRe, options.name)),
        content: Buffer.from(
          contentStr.replace(nameRe, (match) => {
            if (match.charAt(0).match(/[A-Z]/)) {
              return options.name.charAt(0).toUpperCase() + options.name.substr(1);
            } else {
              return options.name;
            }
          })
        ),

        // path: entry.path.replace(nameRe, options.name),
        path:
          entry.path.replace(nameRe, (match) => {
            if (match.charAt(0).match(/[A-Z]/)) {
              return options.name.charAt(0).toUpperCase() + options.name.substr(1);
            } else {
              return options.name;
            }
          })

      } as FileEntry;

    });

}

export default function (options: ModuleOptions): Rule {

  return async (host: Tree) => {

    if (!options.name) {
      throw new SchematicsException('Option (name) is required.');
    }

    if (options.path === undefined) {
      options.path = await createDefaultPath(host, options.project as string);
    }

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;


    // console.log(`########## JSON.stringify(tree) = \n${JSON.stringify(tree)}`);
    console.log(`########## url('./files') = \n${url('./files')}`);
    console.log(`########## options.referenceName = ${options.referenceName}`);


    const templateSource = apply(url('./files'), [

      // applyTemplates({
      //   ...strings,
      //   ...options,
      // }),

      replace1(options),

      move(parsedPath.path),

    ]);

    console.log(`########## templateSource2 = \n${templateSource}`);


    return chain([

      mergeWith(templateSource),

    ]);

  };
}

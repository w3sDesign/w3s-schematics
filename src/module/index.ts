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

// test
import { parse } from 'url';

// import * as ts from '../third_party/github.com/Microsoft/TypeScript/lib/typescript';
// import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import * as ts from 'typeScript/lib/typescript';

import {
  addImportToModule,
  addRouteDeclarationToModule,
} from '../utility/ast-utils';
// import { addImportToModule, addRouteDeclarationToModule } from '@schematics/angular/utility/ast-utils';

import { InsertChange } from '../utility/change';
// import { InsertChange } from '@schematics/angular/utility/change';

import {
  buildRelativePath,
  findModuleFromOptions,
} from '../utility/find-module';
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

// helper rule factory
function replace1(options: ModuleOptions): Rule {
  // The forEach function returns a rule function that accepts a tree,
  // applies the defined operator function to every file of the tree,
  // and returns the new tree.
  return forEach(
    // File operator function that accepts a file entry,
    // transforms file content and path,
    // and returns the transformed file entry.
    (entry: FileEntry) => {
      // const refNameRe = /customer/g; // OK

      // const refNameRe = /\${options.referenceName}/g;
      // const refNameRe = new RegExp('${options.referenceName}', 'g');
      // const refNameRe = new RegExp('customer', 'g'); // OK
      const refName = `(${options.referenceName})`; // 'customer'
      const refNameRe = new RegExp(refName, 'gi');

      const newName = `(${options.name})`; // 'salesOrder'
      const newNameRe = new RegExp(newName, 'gi');

      const STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
      // i.e. salesOrder -> sales-order
      const dasherizedNewName = options.name
        .replace(STRING_DECAMELIZE_REGEXP, '$1-$2')
        .toLowerCase();

      //
      // file content
      //

      const contentStr = entry.content
        .toString('utf-8')
        .replace(refNameRe, (match) => {
          if (match.charAt(0).match(/[A-Z]/)) {
            return (
              options.name.charAt(0).toUpperCase() +
              options.name.substr(1)
            );
          } else {
            return options.name;
          }
        })

        // .replace(refNameRe, (match) => {
        //   return options.name
        //     .replace(STRING_DECAMELIZE_REGEXP, '$1-$2')
        //     .toLowerCase();
        // })


        .replace(/sss/g, 'sses') // addresses

        // import file names
        // /salesOrder -> /sales-order
        .replace(/\/\${options.name}/g, `/${dasherizedName}`);
        
      // });

      //
      // file path
      //

      
      const pathStr = entry.path
        // .replace(refNameRe, (match) => {
        //   if (match.charAt(0).match(/[A-Z]/)) {
        //     return (
        //       options.name.charAt(0).toUpperCase() +
        //       options.name.substr(1)
        //     );
        //   } else {
        //     return options.name;
        //   }
        // })

        // i.e. product -> product
        // i.e. salesOrder -> sales-order
        // i.e. salesOrderItems -> sales-order-items
        .replace(refNameRe, (match) => {
          return options.name
            .replace(STRING_DECAMELIZE_REGEXP, '$1-$2')
            .toLowerCase();
        })

        .replace(/sss/g, 'sses');

      //

      return {
        // content: Buffer.from(contentStr.replace(refNameRe, options.name)),
        content: Buffer.from(
          // contentStr.replace(refNameRe, (match) => {
          //   let str;
          //   if (match.charAt(0).match(/[A-Z]/)) {
          //     // return options.name.charAt(0).toUpperCase() + options.name.substr(1);
          //     str = options.name.charAt(0).toUpperCase() + options.name.substr(1);
          //   } else {
          //     str = options.name;
          //   }
          //   return str.replace('sss','sses'); // Addresses
          // })
          contentStr
        ),

        // path: entry.path.replace(refNameRe, options.name),
        path: pathStr,
        // entry.path.replace(refNameRe, (match) => {
        //   let str;
        //   if (match.charAt(0).match(/[A-Z]/)) {
        //     str = options.name.charAt(0).toUpperCase() + options.name.substr(1);
        //   } else {
        //     str = options.name;
        //   }
        //   return str.replace('sss','sses'); // Addresses
        // })
      } as FileEntry;
    }
  );
}

export default function (options: ModuleOptions): Rule {
  return async (host: Tree) => {
    // name of the generated feature module
    if (!options.name) {
      throw new SchematicsException('Option --name is required.');
    }

    // path to store the generated module
    // if (options.path === undefined) {
    //   options.path = await createDefaultPath(host, options.project as string);
    // }
    if (!options.path) {
      throw new SchematicsException('Option --path is required.');
    }
    // if (options.module) {
    //   options.module = findModuleFromOptions(host, options);
    // }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    // console.log(`########## JSON.stringify(tree) = \n${JSON.stringify(tree)}`);
    // console.log(`########## url('./files') = \n${url('./files')}`);
    // console.log(`########## options.referenceName = ${options.referenceName}`);

    // test
    const urlString =
      '../../../w3s-reference-app01/src/app/customers';
    const parsedUrl = parse(
      '../../../w3s-reference-app01/src/app/customers'
    );

    console.log(
      '%c################',
      'color: blue',
      'w3s-schematics src/module/index.ts',

      '\n urlString = ',
      urlString,

      '\n parsedUrl = ',
      parsedUrl
    );

    // const templateSource = apply(url('./files'), [
    // when called from w3s-reference-app01 project root:
    // const templateSource = apply(url('../../../w3s-reference-app01/src/app/customers'), [ // OK?
    const templateSource = apply(url(urlString), [
      //
      // exclude model!
      filter((path: Path) => !path.match(/model/)),
      filter((path: Path) => !path.match(/foo/)),
      filter((path: Path) => !path.match(/sync/)),

      // include
      // /\/services\/|\-detail\.component|\-entry\.component|\-filter\-template\.component|\-list\.component|\-root\.component/
      // /\/services\/|\-detail\.component|\-entry\.component|\-filter\-template\.component|\-list\.component|\-root\.component|\.module/
      // /\/services\/|\-detail\.component|\-entry\.component|\-filter\-template\.component|\-list\.component|\-root\.component|\-view\.component|\.module/
      // /\-routing\.module/
      filter(
        (path: Path) =>
          !!path.match(
            /\/services\/|\-detail\.component|\-entry\.component|\-filter\-template\.component|\-list\.component|\-root\.component/
          )
      ),

      // including view components
      // filter((path: Path) => !!path.match(/\-view\.component/)),

      // applyTemplates({
      //   ...strings,
      //   ...options,
      // }),

      replace1(options),

      move(parsedPath.path),
    ]);

    // console.log(`########## templateSource2 = \n${templateSource}`);

    return chain([mergeWith(templateSource)]);
  };
}


// import file names
        // /salesOrder -> /sales-order
        // .replace(/\/\${options.name}/g, `/${dasherizedName}`);
import { Rule, Tree, url } from '@angular-devkit/schematics';


export function helloWorld(options: any): Rule {
  // return (tree: Tree, context: SchematicContext) => {
  return (tree: Tree) => {
    tree.create(options.name, 'Hello world!!!!!!!!');

    console.log(`########## JSON.stringify(tree) = \n${JSON.stringify(tree)}`);

    // console.log('################# tree =', tree);
    // const msg = '###############################';
    // console.log(msg, tree);
    // console.dir(tree);

    // const url1 = url('./files');

    console.log(`########## url('./files') = \n${url('./files')}`);


    return tree;
  };
}


import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


export function menu(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}

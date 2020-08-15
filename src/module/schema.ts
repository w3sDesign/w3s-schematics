// original schema.json from @schematics/angular/module
// gf 11.08.2019 Generated from schema.json
//               with: https://app.quicktype.io/

// name?: string; --> name: string; !!
// Because in schema.json:
// "required": [
//   "name"
// ]


/**
 * Creates a new generic NgModule definition in the given or default project.
 */
export interface Schema {
  /**
   * The name of the reference NgModule.
   */
  referenceName?: string;
  /**
   * The name of the NgModule.
   */
  name: string;
  /**
   * The path at which to create the NgModule, relative to the workspace root.
   */
  path?: string;
  /**
   * When true, the new NgModule imports "CommonModule".
   */
  commonModule?: boolean;
  /**
   * When true, creates the new files at the top level of the current project root.
   */
  flat?: boolean;
  /**
   * When true, applies lint fixes after generating the module.
   */
  lintFix?: boolean;
  /**
   * The declaring NgModule.
   */
  module?: string;
  
  /**
   * The name of the project.
   */
  project?: string;
  /**
   * Creates lazy loaded routing module. Requires --module option.
   */
  route?: string;
  /**
   * When true, creates a routing module.
   */
  routing?: boolean;
  /**
   * The scope for the new routing module.
   */
  routingScope?: RoutingScope;
}

/**
* The scope for the new routing module.
*/
export enum RoutingScope {
  Child = "Child",
  Root = "Root",
}

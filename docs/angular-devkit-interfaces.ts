// GF DOCU
// Interfaces used in @angular-devkit and @schematics
//

export interface FileEntry {
  readonly path: Path;
  readonly content: Buffer;
}

// FileOperator is a function that accepts and returns a FileEntry.
export type FileOperator = (entry: FileEntry) => FileEntry | null;

export type AsyncFileOperator = (tree: FileEntry) => Observable<FileEntry | null>;

export interface FilePredicate<T> {
  (path: Path, entry?: Readonly<FileEntry> | null): T;
}

// Rule is a function that accepts and returns a tree (or returns another Rule).
export type Rule = (tree: Tree, context: SchematicContext) =>
  Tree | Observable<Tree> | Rule | Promise<void> | Promise<Rule> | void;

// RuleFactory is a function that creates a Rule.
export type RuleFactory<T extends object> = (options: T) => Rule;

// Source is a function that accepts a context and returns (generates) a tree.
export type Source = (context: SchematicContext) => Tree | Observable<Tree>;

export type PathTemplateValue = boolean | string | number | undefined;
export type PathTemplatePipeFunction = (x: string) => PathTemplateValue;
export type PathTemplateData = {
  [key: string]: PathTemplateValue | PathTemplateData | PathTemplatePipeFunction,
// string index signature
};

export interface PathTemplateOptions {
  interpolationStart: string;
  interpolationEnd: string;
  pipeSeparator?: string;
}


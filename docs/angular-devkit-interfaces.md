# GF DOCU * TO DELETE *

# @angular-devkit Interfaces

## Interfaces used in @angular-devkit and @schematics

#### [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer)

Prior to the introduction of [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) in ECMAScript 2015 (ES6), the JavaScript language had no mechanism for reading or manipulating streams of binary data. The Buffer class was introduced as part of the Node.js API to enable interaction with octet streams in TCP streams, file system operations, and other contexts. 

With TypedArray now available, the Buffer class implements the Uint8Array API in a manner that is more optimized and suitable for Node.js. The Buffer class is within the global scope.  

`Buffer.from(string[, encoding])` returns a new Buffer that contains a copy of the provided string.

#### [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)  

A TypedArray object describes an array-like view of an underlying binary data buffer.  
Since ECMAScript 2015 (ES6).

#### Source

A Source is a function that generates a tree.  

`Source = (context: SchematicContext) => Tree | Observable<Tree>;`

#### Rule

A Rule is a function that transforms a tree (or returns another Rule).

`Rule = (tree: Tree, context: SchematicContext) =>
                     Tree | Observable<Tree> | Rule | Promise<void> | Promise<Rule> | void;
`

#### RuleFactory

A RuleFactory is a function that creates a Rule.
RuleFactory = (options) => Rule;

#### FileOperator

A FileOperator is a function that applies changes synchronously to a passed FileEntry.

```typescript
FileOperator = (entry: FileEntry) => FileEntry | null;
```


```typescript
export interface FileEntry {
  readonly path: Path;
  readonly content: Buffer;
}
export interface FilePredicate<T> {
  (path: Path, entry?: Readonly<FileEntry> | null): T;
}
```

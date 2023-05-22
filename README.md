## Complete File System Cache v1.3.0 Documentation

<p align="center">
  <a href="https://www.npmjs.com/package/complete-file-system-cache" target="_blank"><img src="https://img.shields.io/npm/v/complete-file-system-cache.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/complete-file-system-cache" target="_blank"><img src="https://img.shields.io/npm/l/complete-file-system-cache.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/package/complete-file-system-cache" target="_blank"><img src="https://img.shields.io/npm/dm/complete-file-system-cache.svg" alt="NPM Downloads" /></a>
</p>

### Table of contents

- [Installation](#Installation)
- [Description](#Description)
- [Usage example](#Usage-example)
- [API](#API)
  - [Types](#Types)
  - [CompleteFileSystemCache properties](#CompleteFileSystemCache-properties)
    - [cachedFileSystem](#cachedFileSystem)
  - [CompleteFileSystemCache methods](#CompleteFileSystemCache-methods)
    - [constructor(projectRootDir)](#constructorProjectRootDir)
    - [cacheFileSystem()](#cacheFileSystem)
    - [reloadFileSystemCache()](#reloadFileSystemCache)
    - [search(includedPathSegments, excludedPathSegments, ignoreCase)](#searchIncludedPathSegments-excludedPathSegments-ignoreCase)
    - [cleanCache](#cleanCache)

### Installation

```console
npm i complete-file-system-cache
```

### Description

Caches every file that exists in the file system and stores the whole
file system files, where you want it to store and based on that it can
do fast search in the cached content.

### Usage example

```ts
import { CompleteFileSystemCache } from 'complete-file-system-cache'
import { join } from 'path'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const completeFileSystemCache = new CompleteFileSystemCache(__dirname)
completeFileSystemCache.cacheFileSystem()
const results = completeFileSystemCache.search(
  ['/Users/datomarjanidze'],
  ['.git', 'node_modules', '.cache', '.angular']
)
```

### API

#### Types

```ts
export type FilePaths = string[]
```

#### CompleteFileSystemCache properties

##### cachedFileSystem

- `FileSystemCache`

Returns the `FileSystemCache` if it exists.

#### CompleteFileSystemCache methods

##### constructor(projectRootDir)

- `projectRootDir: string` This directory path will be used to store the
  file system cache.

##### cacheFileSystem()

- Returns: `void`

Creates a file system cache if it already does not exist.

##### reloadFileSystemCache()

- Returns: `void`

Recreates the file system cache.

##### search(includedPathSegments, excludedPathSegments, ignoreCase)

- `includedPathSegments: string[] | RegExp` Path segments which should
  be included from the search results.
- `excludedPathSegments: string[]` **Default:** `[]` Path segments
  which should be excluded from the search results.
- `ignoreCase` **Default:** `true` Executes case insensitive search,
  if the provided argument is `true`.
- Returns: `FilePaths`

##### cleanCache()

- Returns: `void`

Cleans the cache.

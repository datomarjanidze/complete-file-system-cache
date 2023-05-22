import { join, extname } from 'node:path'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from 'node:fs'

import { FilePaths } from './types'

const COMPLETE_FILES_SYSTEM_CACHE_FOLDER_NAME = '.complete-file-system-cache'

class CompleteFileSystemCache {
  private projectRootDir: string
  private cacheFolderPath: string

  constructor(projectRootDir: string) {
    this.projectRootDir = projectRootDir
    this.cacheFolderPath = join(
      this.projectRootDir,
      COMPLETE_FILES_SYSTEM_CACHE_FOLDER_NAME
    )
  }

  cacheFileSystem(): void {
    if (
      !existsSync(this.cacheFolderPath) ||
      !readdirSync(this.cacheFolderPath).length ||
      readdirSync(this.cacheFolderPath).length !== readdirSync('/').length
    ) {
      this.cleanCache()
      mkdirSync(this.cacheFolderPath)
      readdirSync('/').forEach((path, index) => {
        const filePaths: FilePaths = this.readDirRecursively(join('/', path))
        writeFileSync(
          join(this.cacheFolderPath, String(index)),
          JSON.stringify(filePaths)
        )
      })
    }
  }

  reloadFileSystemCache(): void {
    this.cleanCache()
    this.cacheFileSystem()
  }

  getCachedFilePaths(index: string): null | FilePaths {
    if (existsSync(join(this.cacheFolderPath, String(index)))) {
      try {
        return JSON.parse(
          readFileSync(join(this.cacheFolderPath, String(index))).toString()
        )
      } catch (error) {
        return null
      }
    } else return null
  }

  cleanCache(): void {
    if (existsSync(this.cacheFolderPath))
      rmSync(this.cacheFolderPath, { recursive: true })
  }

  search(
    includedPathSegments: string[] | RegExp,
    excludedPathSegments: string[] = [],
    ignoreCase = true
  ): string[] {
    const cbForStringArray = (path: string) =>
      (includedPathSegments as string[]).every((includedPathSegment) =>
        path.includes(includedPathSegment)
      )
    const ignoreCaseCbForStringArray = (path: string) =>
      (includedPathSegments as string[]).every((includedPathSegment) =>
        path.toLowerCase().includes(includedPathSegment.toLowerCase())
      )
    const cbForRegExp = (path: string) =>
      (includedPathSegments as RegExp).test(path)
    const ignoreCaseCbForRegExp = (path: string) =>
      (includedPathSegments as RegExp).test(path.toLowerCase())
    let cb: (path: string) => boolean

    if (ignoreCase) {
      if (Array.isArray(includedPathSegments)) cb = ignoreCaseCbForStringArray
      else if (includedPathSegments instanceof RegExp)
        cb = ignoreCaseCbForRegExp
    } else {
      if (Array.isArray(includedPathSegments)) cb = cbForStringArray
      else if (includedPathSegments instanceof RegExp) cb = cbForRegExp
    }

    return (
      this.getCacheDirectoryItems()?.reduce((acc: FilePaths, path) => {
        const filePaths: FilePaths = this.getCachedFilePaths(path) || []

        acc.push(
          ...filePaths
            .filter(
              (path) =>
                !excludedPathSegments.some((excludedPathSegment) =>
                  path.includes(excludedPathSegment)
                )
            )
            .filter(cb)
        )

        return acc
      }, []) || []
    )
  }

  private getCacheDirectoryItems(): null | string[] {
    if (existsSync(this.cacheFolderPath))
      return readdirSync(this.cacheFolderPath)
    else return null
  }

  private readDirRecursively(
    path: string,
    filePaths: FilePaths = []
  ): FilePaths {
    if (!extname(path)) {
      try {
        readdirSync(path).forEach((directory) =>
          this.readDirRecursively(join(path, directory), filePaths)
        )
      } catch (error) {}
    } else filePaths.push(path)

    return filePaths
  }
}

export { CompleteFileSystemCache, FilePaths }

import { glob } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { Compiler, RspackPluginInstance } from '@rspack/core';
import { clearIncludesCache } from '../handlebars/includes.ts';

export interface ExternalFileWatcherPluginOptions {
  files?: string[];
}

export default class ExternalFileWatcherPlugin implements RspackPluginInstance {
  private static readonly PLUGIN_NAME = 'rspack-plugin-external-file-watcher';
  private readonly patterns: string[];

  // In-memory cache across rebuilds
  private cachedFiles: Set<string> | null = null;
  private cachedDirs: Set<string> | null = null;

  constructor({ files = [] }: ExternalFileWatcherPluginOptions = {}) {
    this.patterns = files;
  }

  apply(compiler: Compiler): void {
    if (this.patterns.length === 0) {
      return;
    }

    // Invalidate glob cache when directory/context dependencies change in watch mode,
    // and clear the {{includes}}/{{markdown}} caches (handlebars/includes.ts) whenever
    // one of the files or directories we're watching actually changed - not on every
    // rebuild, since most rebuilds are triggered by unrelated .ts source changes.
    compiler.hooks.watchRun.tap(ExternalFileWatcherPlugin.PLUGIN_NAME, (comp) => {
      if (!this.cachedFiles || !this.cachedDirs) {
        return;
      }

      const changedFiles = [...(comp.modifiedFiles ?? []), ...(comp.removedFiles ?? [])];

      const watchedFileChanged = changedFiles.some((file) => this.cachedFiles?.has(file));
      const watchedDirChanged = changedFiles.some((file) => this.cachedDirs?.has(file));

      if (watchedFileChanged || watchedDirChanged) {
        clearIncludesCache();
      }

      if (watchedDirChanged) {
        this.cachedFiles = null;
        this.cachedDirs = null;
      }
    });

    // Tap promise for async non-blocking execution during compilation
    compiler.hooks.afterCompile.tapPromise(
      ExternalFileWatcherPlugin.PLUGIN_NAME,
      async (compilation) => {
        // Only run glob scan if cache is empty or invalidated
        if (!this.cachedFiles || !this.cachedDirs) {
          const { files, dirs } = await this.resolveFilesAndDirs();
          this.cachedFiles = files;
          this.cachedDirs = dirs;
        }

        // 1. Tell Rspack to watch individual resolved files
        for (const file of this.cachedFiles) {
          compilation.fileDependencies.add(file);
        }

        // 2. Tell Rspack to watch parent directories for newly created/deleted files
        for (const dir of this.cachedDirs) {
          compilation.contextDependencies.add(dir);
        }
      }
    );
  }

  private async resolveFilesAndDirs(): Promise<{
    files: Set<string>;
    dirs: Set<string>;
  }> {
    const filesToWatch = new Set<string>();
    const filesToExclude = new Set<string>();

    for (const pattern of this.patterns) {
      const isExclusion = pattern.startsWith('!');
      const targetPattern = isExclusion ? pattern.slice(1) : pattern;

      const matches: string[] = [];
      // Native Node async glob generator
      for await (const match of glob(targetPattern)) {
        matches.push(match);
      }

      const targetSet = isExclusion ? filesToExclude : filesToWatch;
      for (const match of matches) {
        targetSet.add(resolve(match));
      }
    }

    // Apply exclusions
    for (const excluded of filesToExclude) {
      filesToWatch.delete(excluded);
    }

    // Extract unique parent directories for Rspack context watching
    const dirsToWatch = new Set<string>();
    for (const file of filesToWatch) {
      dirsToWatch.add(dirname(file));
    }

    return { files: filesToWatch, dirs: dirsToWatch };
  }
}
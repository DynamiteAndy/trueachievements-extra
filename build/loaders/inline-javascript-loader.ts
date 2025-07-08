import type { LoaderContext } from '@rspack/core';
import { minify } from 'oxc-minify';

export interface InlineJavascriptLoaderOptions {
  compress?: boolean;
  includedPaths?: Array<string | RegExp>;
}

// Global regex for buildScript template literals
const SCRIPT_REGEX = /buildScript\s*=\s*\(\)\s*:\s*HTMLScriptElement\s*=>\s*{[\s\S]*?`([^`]+)`/g;

export default async function inlineJavascriptLoader(
  this: LoaderContext<InlineJavascriptLoaderOptions>,
  source: string
): Promise<string> {
  try {
    const { compress = false, includedPaths } = this.getOptions() ?? {};

    if (!compress || !isPathIncluded(this.resourcePath, includedPaths)) {
      return source;
    }

    const matches = Array.from(source.matchAll(SCRIPT_REGEX));
    if (matches.length === 0) {
      return source;
    }

    const minifiedScripts = await Promise.all(
      matches.map(async (match) => {
        const rawScript = match[1];
        const minified = await minify('minify.js', rawScript);

        return minified.code
          .replace(/\\/g, '\\\\')
          .replace(/`/g, '\\`')
          .replace(/\$/g, '\\$');
      })
    );

    let output = '';
    let lastIndex = 0;

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const matchIndex = match.index!;
      const fullMatch = match[0];
      const rawScript = match[1];
      const minifiedScript = minifiedScripts[i];

      output += source.slice(lastIndex, matchIndex);

      const reconstructedMatch = fullMatch.replace(rawScript, () => minifiedScript);
      output += reconstructedMatch;

      lastIndex = matchIndex + fullMatch.length;
    }

    output += source.slice(lastIndex);
    return output;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    this.emitError(new Error(`[inline-js-loader] ${err.message}`));
    return source;
  }
}

function isPathIncluded(
  path: string,
  includedPaths?: Array<string | RegExp>
): boolean {
  if (!includedPaths || includedPaths.length === 0) return false;

  return includedPaths.some((included) =>
    typeof included === 'string'
      ? path === included
      : included instanceof RegExp
        ? included.test(path)
        : false
  );
}
import type { LoaderContext } from '@rspack/core';

export default function sassToStringLoader(
  this: LoaderContext<unknown>,
  content: string
): string {
  return `export default ${JSON.stringify(content)};`;
}
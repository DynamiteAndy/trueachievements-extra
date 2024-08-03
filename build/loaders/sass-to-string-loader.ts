import { LoaderContext } from '@rspack/core';

export default function (this: LoaderContext<never>, source: string) {
  return `const styles = \`${source}\`;
    export default styles;
  `;
}

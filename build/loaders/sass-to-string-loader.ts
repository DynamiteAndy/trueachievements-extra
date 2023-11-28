import type { LoaderContext } from 'webpack';

export default function (this: LoaderContext<unknown>, source: string) {
  return `const styles = \`${source}\`;
    export default styles;
  `;
}

import { fileURLToPath } from 'node:url';

import { transform } from 'lightningcss';
import { compile } from 'sass';

import { loadMarkdown } from '../../build/loaders/markdown-loader.ts';

interface ResolveContext {
  resolve: (source: string, importer?: string, options?: { skipSelf: boolean }) => Promise<{ id: string } | null>;
}

// Compiles the imports rspack's loaders handle: .scss to CSS and .md to HTML, as the build does. A stylesheet goes
// through sass and then lightningcss's minifier, as build/rspack.base.conf.ts's loaders take it, so a spec reads the CSS
// that ships
export default () => {
  const scssRegex = /\.scss$/;
  const mdRegex = /\.md$/;
  // A .scss import becomes this virtual module, so Vite's and Vitest's own CSS steps (which turn every stylesheet
  // into an empty string in specs) never see it
  const scssPrefix = '\0ta-x-scss:';
  // As build/rspack.base.conf.ts gives sass-loader
  const loadPaths = [fileURLToPath(new URL('../../src/scss', import.meta.url))];

  return {
    name: 'vitest-web',
    enforce: 'pre' as const,

    async resolveId(this: ResolveContext, source: string, importer?: string) {
      if (!scssRegex.test(source)) {
        return null;
      }

      // Ending in .js, as an id ending in .scss is still blanked
      const resolved = await this.resolve(source, importer, { skipSelf: true });
      return resolved ? `${scssPrefix}${resolved.id}.js` : null;
    },

    load(id: string) {
      if (!id.startsWith(scssPrefix)) {
        return null;
      }

      // From the file, with the build's load path, so its @use and @import resolve as they do in the build
      const filename = id.slice(scssPrefix.length, -'.js'.length);
      const { code } = transform({ filename, code: Buffer.from(compile(filename, { loadPaths }).css), minify: true });
      return `export default ${JSON.stringify(code.toString())};`;
    },

    async transform(code: string, id: string) {
      const [path, query] = id.split('?');

      if (mdRegex.test(path)) {
        return {
          code: `export default ${JSON.stringify(await loadMarkdown(code, query ? `?${query}` : ''))};`
        };
      }
    }
  };
};

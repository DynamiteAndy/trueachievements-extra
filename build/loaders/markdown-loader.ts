import htmlnano, { presets } from 'htmlnano';

import type { LoaderContext } from '@rspack/core';

import { documentationSections, latestChangelog, renderMarkdown } from '../helpers/markdown.ts';

import type { Documentation } from '../helpers/markdown.ts';

// A sanitised fragment has no styles, scripts or SVG, so their minifiers (and the optional packages they need) stay off; no
// config file lookup, so the output depends on this file alone
const MINIFY_OPTS = {
  skipConfigLoading: true,
  minifyCss: false,
  minifySvg: false,
  minifyJs: false
} as const;

const minify = async (html: string): Promise<string> => (await htmlnano.process(html, MINIFY_OPTS, presets.safe)).html;

// Imports a markdown file as an HTML string, rendered at build time so marked and sanitize-html don't ship in the
// userscript. `CHANGELOG.md?latest` gives only the latest version's changes, with a link to the rest;
// `?sections` (FEATURE-DOCUMENTATION.md, CREDITS.md) its intro and each top-level section apart
export const loadMarkdown = async (markdown: string, resourceQuery = ''): Promise<string | Documentation> => {
  if (resourceQuery === '?sections') {
    const { intro, sections } = documentationSections(markdown);

    return {
      intro: await minify(intro),
      sections: await Promise.all(sections.map(async ({ title, html }) => ({ title, html: await minify(html) })))
    };
  }

  return minify(resourceQuery === '?latest' ? latestChangelog(markdown) : renderMarkdown(markdown));
};

export default async function markdownLoader(this: LoaderContext<unknown>, content: string): Promise<string> {
  return `export default ${JSON.stringify(await loadMarkdown(content, this.resourceQuery))}`;
}

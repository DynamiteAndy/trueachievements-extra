import { extname } from 'node:path';
import minifyHtml from '@minify-html/node';
import type { LoaderContext } from '@rspack/core';
import Handlebars from '../handlebars/index.ts';

export const MINIFY_OPTS = {
  minify_doctype: true,
  allow_noncompliant_unquoted_attribute_values: false,
  keep_closing_tags: true,
  keep_html_and_head_opening_tags: false,
  allow_removing_spaces_between_attributes: true,
  keep_comments: false,
  minify_css: true,
  minify_js: true,
  remove_bangs: true,
  remove_processing_instructions: true,
} as const;

const CONTEXT_REGEX = /{{!--\s*@context\s+(?:(\w+)\s+)?(.+?)\s*--}}/g;

export default async function htmlLoader(
  this: LoaderContext<unknown>,
  content: string
): Promise<string> {
  try {
    let result = content;

    if (extname(this.resourcePath) === '.hbs') {
      const contexts = await buildContext(this, content);
      const cleaned = content.replace(CONTEXT_REGEX, '');
      const compiled = Handlebars.compile(cleaned);

      result = compiled(contexts);
    }

    const minified = minifyHtml
      .minify(Buffer.from(result), MINIFY_OPTS)
      .toString();

    return `export default ${JSON.stringify(minified)}`;
  } catch (error) {
    this.emitError(error instanceof Error ? error : new Error(String(error)));
    return `export default ${JSON.stringify('')}`;
  }
}

async function buildContext(
  loaderContext: LoaderContext<unknown>,
  content: string
): Promise<Record<string, unknown>> {
  const matches = Array.from(content.matchAll(CONTEXT_REGEX));
  if (matches.length === 0) return {};

  const resolveTasks = matches.map(async (match) => {
    const [, namespace, relPathRaw] = match;
    const relPath = relPathRaw.trim().replace(/^['"]|['"]$/g, '');

    try {
      const exports = (await loaderContext.importModule(relPath)) as Record<string, unknown>;
      const modData = exports?.default ?? exports;

      return { namespace, modData };
    } catch (error) {
      loaderContext.emitWarning(
        new Error(`[html-loader] Failed to import context file "${relPath}": ${error}`)
      );

      return null;
    }
  });

  const resolved = await Promise.all(resolveTasks);
  const contexts: Record<string, unknown> = {};

  for (const item of resolved) {
    if (!item?.modData) continue;

    if (item.namespace) {
      contexts[item.namespace] = item.modData;
    } else {
      Object.assign(contexts, item.modData);
    }
  }

  return contexts;
}
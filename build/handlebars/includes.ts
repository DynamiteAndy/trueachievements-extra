import fs from 'node:fs';
import { dirname } from 'node:path';
import Handlebars from 'handlebars';
import { Marked } from 'marked';
import { mangle } from 'marked-mangle';
import sanitizeHtml from 'sanitize-html';
import packageJson from '../../package.json' with { type: 'json' };
import getPath from '../helpers/get-path-by-alias.ts';
import { isHandlebarsOptions } from '../helpers/handlebars.ts';

// ---------------------------------------------------------------------------
// Singletons & Caches
// ---------------------------------------------------------------------------

// Pre-configure Marked once at module level (prevents memory leaks)
const markedInstance = new Marked();
markedInstance.use(mangle());

// Module-level caches for template compilation & file I/O
const fileCache = new Map<string, string>();
const templateCache = new Map<string, Handlebars.TemplateDelegate>();

const getCompiledTemplate = (filePath: string): Handlebars.TemplateDelegate => {
  let compiled = templateCache.get(filePath);
  if (!compiled) {
    let content = fileCache.get(filePath);
    if (!content) {
      content = fs.readFileSync(filePath, 'utf8');
      fileCache.set(filePath, content);
    }
    compiled = Handlebars.compile(content);
    templateCache.set(filePath, compiled);
  }

  return compiled;
};

export const clearIncludesCache = (): void => {
  fileCache.clear();
  templateCache.clear();
};

const safeMinifyJson = (jsonStr: string): string => {
  try {
    return JSON.stringify(JSON.parse(jsonStr));
  } catch {
    return jsonStr;
  }
};

// ---------------------------------------------------------------------------
// Registrations & Export Handlers
// ---------------------------------------------------------------------------

export const includes = (): void => {
  Handlebars.registerHelper(
    'includes',
    function (this: unknown, filePath: string, options: Handlebars.HelperOptions) {
      if (!filePath) return;

      const actualPath = getPath(filePath, options.data?.parentPartialDirectory);
      const domTemplate = getCompiledTemplate(actualPath);

      // Copy options.hash immutably
      const customContext: Record<string, unknown> = { ...options.hash };

      if (typeof customContext['render-condition'] === 'string') {
        customContext['render-condition'] = safeMinifyJson(customContext['render-condition']);
      }

      if (typeof customContext['helper-render-condition'] === 'string') {
        customContext['helper-render-condition'] = safeMinifyJson(customContext['helper-render-condition']);
      }

      customContext['partialContent'] = options.fn ? options.fn(this) : undefined;

      return new Handlebars.SafeString(
        domTemplate(customContext, { data: { parentPartialDirectory: dirname(actualPath) } })
      );
    }
  );
};

export const markdown = (): void => {
  Handlebars.registerHelper(
    'markdown',
    function (filePath: string, arg2?: unknown, arg3?: unknown, arg4?: unknown) {
      if (!filePath) {
        return;
      }

      let render = false;
      let wrapperClass = '';
      let options: Handlebars.HelperOptions;

      if (isHandlebarsOptions(arg2)) {
        options = arg2;
      } else if (isHandlebarsOptions(arg3)) {
        render = Boolean(arg2);
        options = arg3;
      } else if (isHandlebarsOptions(arg4)) {
        render = Boolean(arg2);
        wrapperClass = String(arg3 ?? '');
        options = arg4;
      } else {
        return;
      }

      render = options.hash?.render ?? render;
      wrapperClass = options.hash?.wrapperClass ?? wrapperClass;

      const actualPath = getPath(filePath, options.data?.parentPartialDirectory);

      let rawMarkdown = fileCache.get(actualPath);
      if (!rawMarkdown) {
        rawMarkdown = fs.readFileSync(actualPath, 'utf8');
        fileCache.set(actualPath, rawMarkdown);
      }

      const parsedHtml = markedInstance.parse(rawMarkdown, { async: false }) as string;
      const sanitizedHtml = sanitizeHtml(parsedHtml);

      const formattedListHtml = sanitizedHtml.replace(
        /<li>([\s\S]*?)<\/li>/g,
        '<li><span class="ta-x-markdown-marker">➤</span><p>$1</p></li>'
      );

      const wrappedHtml = `<div class="${wrapperClass}">${formattedListHtml}</div>`;

      if (render) {
        const domTemplate = Handlebars.compile(wrappedHtml);
        return new Handlebars.SafeString(
          domTemplate(options.hash, { data: { parentPartialDirectory: dirname(actualPath) } })
        );
      }

      if (options.data?.root) {
        options.data.root.markdown = wrappedHtml;
      }
    }
  );
};

export const changelog = (): void => {
  Handlebars.registerHelper('changelog', (_, options: Handlebars.HelperOptions) => {
    const markdownContent: string = options.data?.root?.markdown ?? '';
    if (!markdownContent) {
      throw new Error('changelog helper: expected options.data.root.markdown to be populated by {{markdown}} helper');
    }

    const ulEndIndex = markdownContent.indexOf('</ul>');
    if (ulEndIndex === -1) {
      throw new Error('changelog helper: expected markdown to contain a <ul> element');
    }

    const baseUrl = packageJson?.url ?? '';
    const changelogUrl = baseUrl ? `${baseUrl}/blob/main/CHANGELOG.md` : '#';
    const changelogLinkHtml = `<a class="ta-x-settings-menu-changelog-link" href="${changelogUrl}">See the full changelog here</a>`;
    const truncatedHtml = `${markdownContent.slice(0, ulEndIndex + 5)}\n${changelogLinkHtml}\n</div>`;

    const domTemplate = Handlebars.compile(truncatedHtml);
    return new Handlebars.SafeString(domTemplate(options.hash));
  });
};

export default { includes, markdown, changelog };
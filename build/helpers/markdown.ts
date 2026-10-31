import { Marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

import type { Tokens } from 'marked';

import packageJson from '../../package.json' with { type: 'json' };

// The project's markdown (CHANGELOG, CREDITS, FEATURE-DOCUMENTATION), with each list item given the settings menu's ➤
// marker. An item is one line of text, as the marker's <p> holds it: a blank line or a nested list in one would put
// block elements in that <p>, which the browser breaks apart into empty paragraphs, so the build stops instead
const marked = new Marked({
  async: false,
  renderer: {
    listitem(item) {
      if (item.loose || item.tokens.some((token) => token.type !== 'text')) {
        throw new Error(
          `markdown: keep each list item to one line of text, with no blank line or nested list: "${item.text}"`
        );
      }

      return `<li><span class="ta-x-markdown-marker">➤</span><p>${this.parser.parse(item.tokens)}</p></li>\n`;
    }
  }
});

// The marker's class is the only one kept
const sanitise = (html: string): string => sanitizeHtml(html, { allowedClasses: { span: ['ta-x-markdown-marker'] } });

export const renderMarkdown = (markdown: string): string => sanitise(marked.parse(markdown, { async: false }));

interface DocumentationSection {
  title: string;
  html: string;
}

export interface Documentation {
  intro: string;
  sections: DocumentationSection[];
}

// A markdown file split at its top-level headings: the first (the title) and what follows it is the intro, each later
// one a section (the documentation's settings tabs, the credits' libraries) with its title apart from its HTML, which
// the settings menu shows as an accordion
export const documentationSections = (markdown: string): Documentation => {
  const tokens = marked.lexer(markdown);
  const starts = tokens.flatMap((token, index) => (token.type === 'heading' && token.depth === 1 ? [index] : []));
  if (starts.length < 2) {
    throw new Error('documentationSections: expected a title and at least one section heading');
  }

  const render = (from: number, to?: number): string => sanitise(marked.parser(tokens.slice(from, to)));

  return {
    intro: render(0, starts[1]),
    sections: starts.slice(1).map((start, index) => ({
      title: (tokens[start] as Tokens.Heading).text,
      html: render(start + 1, starts[index + 2])
    }))
  };
};

// The changelog up to the end of its first list (the latest version), then a link to the whole changelog
export const latestChangelog = (markdown: string): string => {
  const tokens = marked.lexer(markdown);
  const firstListIndex = tokens.findIndex((token) => token.type === 'list');
  if (firstListIndex === -1) {
    throw new Error('latestChangelog: expected the changelog to contain a <ul> element');
  }

  const latest = sanitise(marked.parser(tokens.slice(0, firstListIndex + 1)));
  const changelogUrl = `${packageJson.url}/blob/main/CHANGELOG.md`;

  return `${latest}<a class="ta-x-settings-menu-changelog-link" href="${changelogUrl}">See the full changelog here</a>\n`;
};

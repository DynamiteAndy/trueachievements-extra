// Condenses a page captured from the live site into a fixture, the same way every time (live-site.md, "Capturing a
// fixture"): it sanitises the markup as the skill's in-page helper does, keeps only the parts under test with their
// ancestors, cuts repeated rows down to the ones picked, and starts the file with its capture header. Run from the
// command line with `pnpm fixture:condense` (condense-cli.ts); the function itself is specced in condense.spec.ts.
import { Window } from 'happy-dom';

export type CondenseOptions = {
  // The page it was captured from, and when (YYYY-MM-DD)
  page: string;
  date: string;
  // What the fixture is for, and what was cut: the rest of the header comment
  note: string;
  // The parts under test (CSS selectors); everything else goes, apart from their ancestors. All of the page if empty
  keep?: string[];
  // Repeated rows cut to the ones picked: `selector` matches the rows, `indices` the ones kept (0-based, in page order)
  rows?: { selector: string; indices: number[] }[];
  // Hidden inputs a spec needs, by name; every other hidden input goes
  keepHidden?: string[];
  // Query parameters a spec needs, by name, kept on the links that have them (a sale's buy link keeps `u`, the store
  // address it reads); every other parameter goes
  keepQuery?: string[];
};

// Our own class names: ta-x-, and the js- and mce- (TinyMCE) forms of it. Matched by whole class, so a site class
// that only contains the letters (meta-xbox) stays
const ours = /^(js-|mce-)?ta-x-/;

// Attribute values longer than this are dropped (tracking data, inline images, encoded state)
const longValue = 300;

// A link's address without its query, bar the parameters named (in the order the link has them)
const withoutQuery = (href: string, keepQuery: string[], keptQuery: Set<string>): string => {
  const at = href.indexOf('?');
  const kept = new URLSearchParams();
  for (const [name, value] of new URLSearchParams(href.slice(at + 1))) {
    if (keepQuery.includes(name)) {
      kept.append(name, value);
      keptQuery.add(name);
    }
  }
  const path = href.slice(0, at);
  return kept.size ? `${path}?${kept}` : path || '#';
};

// The skill's sanitising rules: our own elements, scripts and hidden inputs (bar the named ones) gone; links with a
// query (bar the named parameters) or a javascript: URL made safe; event handlers, query-like data attributes and
// over-long values gone
const sanitise = (root: Element, keepHidden: string[], keepQuery: string[]): void => {
  root.querySelectorAll('script, noscript').forEach((element) => element.remove());
  const hidden = [...root.querySelectorAll('input[type="hidden"]')];
  const missing = keepHidden.filter((name) => !hidden.some((input) => input.getAttribute('name') === name));
  if (missing.length) {
    throw new Error(`no hidden input is named ${missing.join(', ')}`);
  }
  for (const input of hidden) {
    if (!keepHidden.includes(input.getAttribute('name') ?? '')) {
      input.remove();
    }
  }
  for (const element of root.querySelectorAll('[class]')) {
    if ([...element.classList].some((name) => ours.test(name))) {
      element.remove();
    }
  }
  const keptQuery = new Set<string>();
  root.querySelectorAll('*').forEach((element) => {
    for (const { name, value } of Array.from(element.attributes)) {
      // A kept parameter can make a link longer than the limit (a store address), so links are checked first
      if (name === 'href' && value.trim().toLowerCase().startsWith('javascript:')) {
        element.setAttribute('href', '#');
      } else if (name === 'href' && value.includes('?')) {
        element.setAttribute('href', withoutQuery(value, keepQuery, keptQuery));
      } else if (name.startsWith('on') || value.length > longValue) {
        element.removeAttribute(name);
      } else if (name.startsWith('data-') && /[?&=]/.test(value)) {
        element.removeAttribute(name);
      }
    }
  });
  const unused = keepQuery.filter((name) => !keptQuery.has(name));
  if (unused.length) {
    throw new Error(`no link has a query parameter named ${unused.join(', ')}`);
  }
};

// Everything outside the kept parts goes; their ancestors stay, without their other children
const keepOnly = (body: Element, selectors: string[]): void => {
  const kept = selectors.flatMap((selector) => [...body.querySelectorAll(selector)]);
  if (kept.length === 0) {
    throw new Error(`nothing matches ${selectors.join(', ')}`);
  }
  const needed = new Set<Element>();
  for (const element of kept) {
    for (let node: Element | null = element; node && node !== body; node = node.parentElement) {
      needed.add(node);
    }
  }
  const prune = (parent: Element): void => {
    // A copy: removing children from the live list while going through it would skip some
    for (const child of Array.from(parent.children)) {
      if (kept.some((element) => element === child)) {
        continue;
      }
      if (needed.has(child)) {
        prune(child);
      } else {
        child.remove();
      }
    }
    // Text between the elements that went (whitespace, labels) goes too, unless the parent is kept whole
    for (const node of Array.from(parent.childNodes)) {
      if (node.nodeType === 3 && !kept.some((element) => element === parent)) {
        node.remove();
      }
    }
  };
  prune(body);
};

export const condense = (
  html: string,
  { page, date, note, keep = [], rows = [], keepHidden = [], keepQuery = [] }: CondenseOptions
): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`date should be YYYY-MM-DD, not ${date}`);
  }
  // The page's whole encoded state: never part of a fixture
  if (keepHidden.includes('__VIEWSTATE')) {
    throw new Error('__VIEWSTATE is never kept');
  }
  const window = new Window();
  const { document } = window;
  document.write(html);

  sanitise(document.documentElement as unknown as Element, keepHidden, keepQuery);
  for (const { selector, indices } of rows) {
    const all = [...document.querySelectorAll(selector)];
    const missing = indices.filter((index) => index >= all.length);
    if (missing.length) {
      throw new Error(`${selector} has ${all.length} rows (0 to ${all.length - 1}), so no row ${missing.join(', ')}`);
    }
    all.forEach((row, index) => {
      if (!indices.includes(index)) {
        row.remove();
      }
    });
  }
  if (keep.length) {
    keepOnly(document.body as unknown as Element, keep);
  }

  const header = [`${page}, captured ${date}.`, ...note.trim().split('\n')].map((line) => `  ${line}`).join('\n');
  const body = document.body.innerHTML.trim();
  // Not awaited: the window was only for parsing, and nothing needs it closed before the markup is returned
  void window.happyDOM.close();
  return `<!--\n${header}\n-->\n<html>\n  <body>\n    ${body}\n  </body>\n</html>\n`;
};

import { readFixture } from './fixtures';

// Features mark the page with classes and attributes on <html> and <body> (e.g. the staff pages' body class), which
// would otherwise carry over into the next test's page
const clearAttributes = (element: Element): void => {
  [...element.attributes].forEach(({ name }) => element.removeAttribute(name));
};

// Takes <body> off the page, as it is when our script starts (document-start). Call the function it returns to have
// the parser add it back; setHtml puts one back too, should a test end without it
export const withoutBody = (): (() => HTMLElement) => {
  const body = document.body;
  body.remove();

  return () => document.documentElement.appendChild(body);
};

// Where happy-dom starts each spec file: a page that's none of the site's
const defaultUrl = 'http://localhost:3000/';

// Loads a captured page (`@ta-x-test-views/…`) as the page under test, at `opts.url`
export const setHtml = (path: string, opts?: { url?: string }): void => {
  if (!document.body) {
    document.documentElement.appendChild(document.createElement('body'));
  }

  clearAttributes(document.documentElement);
  clearAttributes(document.body);
  document.body.innerHTML = readFixture(path);

  // Always at an address, so a test without one doesn't run at the last test's
  window.location.href = opts?.url ?? defaultUrl;
};

// The page still being parsed, as it is when our document-start script runs (happy-dom's document is always parsed).
// Returns what finishing the parse does: the parser's DOMContentLoaded
export const stillParsing = (): (() => void) => {
  const readyState = vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');

  return () => {
    readyState.mockReturnValue('interactive');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  };
};

// Arriving at the page from `referrer`, by a plain navigation unless `type` says otherwise (a reload, say)
export const arriveFrom = (referrer: string, type: NavigationTimingType = 'navigate'): void => {
  vi.spyOn(document, 'referrer', 'get').mockReturnValue(referrer);
  vi.spyOn(performance, 'getEntriesByType').mockReturnValue([{ type } as PerformanceNavigationTiming]);
};

// Records each `type` event on the page as `read` describes it, before anything else sees it, until the test ends.
// `cancel` stops the event's default action, for a link that would load a page
export const recordEvents = <T>(type: string, read: (event: Event) => T, { cancel = false } = {}): T[] => {
  const recorded: T[] = [];
  const listening = new AbortController();
  document.addEventListener(
    type,
    (event) => {
      recorded.push(read(event));
      if (cancel) {
        event.preventDefault();
      }
    },
    { capture: true, signal: listening.signal }
  );
  onTestFinished(() => listening.abort());

  return recorded;
};

// The ids of an element's children, in order, or their class where they have no id
export const ids = (element: Element): string[] => [...element.children].map((child) => child.id || child.className);

// The prefixes components give useUniqueId, whose ids count up across the page, so a remount gets new ones
const uniqueIdPrefixes = [
  'ta-x-ask-form-field',
  'ta-x-accordion-content',
  'ta-x-accordion-header',
  'group',
  'playstation-trophies-svg',
  'xbox-achievements-svg'
];

// Markup with useUniqueId's counts taken off, for comparing the page before and after a component mounts again
export const withoutUniqueIds = (html: string): string =>
  uniqueIdPrefixes.reduce((markup, prefix) => markup.replaceAll(new RegExp(`\\b${prefix}-\\d+`, 'g'), prefix), html);

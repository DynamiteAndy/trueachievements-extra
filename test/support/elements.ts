import * as taxPage from '@ta-x-page';
import { HideableRowAttributes as hideableRowAttributes } from '@ta-x-ui';

// A value a spec needs, failing the test when it's null or undefined (a lookup kept nullable for another test's absence
// check, a mock's call, an optional method)
export const required = <T>(value: T | null | undefined): T => {
  if (value === null || value === undefined) {
    throw new Error(`Expected a value, got ${String(value)}`);
  }

  return value;
};

type Root = ParentNode | null | undefined;

// The element a selector finds, failing the test with the selector when there's none. Specs use it for elements that
// must be there, so a missing one reads "No element matches …" rather than a TypeError on null. Typed as querySelector
// is: a bare tag name gives its element type (find('select') is an HTMLSelectElement). The root may itself be a lookup
// that found nothing: the test fails saying so
export function find<K extends keyof HTMLElementTagNameMap>(selector: K, root?: Root): HTMLElementTagNameMap[K];
export function find<T extends Element = HTMLElement>(selector: string, root?: Root): T;
export function find(selector: string, root: Root = document): Element {
  if (!root) {
    throw new Error(`Nothing to look for ${selector} in`);
  }

  const element = root.querySelector(selector);
  if (!element) {
    throw new Error(`No element matches ${selector}`);
  }

  return element;
}

// The element a selector finds whose text, trimmed, is `text`, failing the test when there's none: for a link or button
// known only by what it says
export const findByText = <T extends Element = HTMLElement>(
  selector: string,
  text: string,
  root: Root = document
): T => {
  if (!root) {
    throw new Error(`Nothing to look for ${selector} "${text}" in`);
  }

  const element = [...root.querySelectorAll<T>(selector)].find((candidate) => candidate.textContent.trim() === text);
  if (!element) {
    throw new Error(`No ${selector} reads "${text}"`);
  }

  return element;
};

// waitForElement as it is, except that these selectors are never found: it answers null at once rather than waiting
// out its timeout
export const neverFinds = (...selectors: string[]): void => {
  const waitForElement = taxPage.waitForElement;
  vi.spyOn(taxPage, 'waitForElement').mockImplementation(async (selector, ...args) =>
    selectors.includes(selector) ? null : waitForElement(selector, ...args)
  );
};

// The ids of the tab panels shown within `root` (useTabs marks the shown one data-tab-visible: ui/tabs/attributes.ts),
// failing the test when the root is missing
export const visibleTabs = (root: Root = document): string[] => {
  if (!root) {
    throw new Error(`Nothing to look for tab panels in: ${String(root)}`);
  }

  return [...root.querySelectorAll('[data-tab-visible]')].map((panel) => panel.id);
};

// Each thread row on a forum page, in order: 'true' where hidden, else 'shown'
export const hiddenThreads = (): string[] =>
  [...document.querySelectorAll<HTMLLIElement>('main li:not(.header)')].map(
    (thread) => thread.getAttribute(hideableRowAttributes.rowHidden) ?? 'shown'
  );

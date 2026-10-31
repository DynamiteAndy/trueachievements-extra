import sheet from '@ta-x-scss/index.scss';
import { setHtml, tick, withoutBody } from '@ta-x-test';

import { rootClass } from './constants';
import { stylesheet } from './stylesheet';

describe('stylesheet', () => {
  const addStyle = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('GM_addStyle', addStyle);
    addStyle.mockReset();
    setHtml('@ta-x-test-views/empty.html');
  });

  test('the sheet is the compiled CSS, scoped to the root class', () => {
    expect(sheet).toContain(`.${rootClass}`);
    expect(sheet).not.toContain('@use');
  });

  // Keyframes aren't scoped by the root class: a page or an extension defining one of the same name would replace ours
  test('names every animation for the script', () => {
    const names = [...sheet.matchAll(/@keyframes\s+([\w-]+)/g)].map(([, name]) => name);

    expect(names).not.toEqual([]);
    expect(names.filter((name) => !name.startsWith('ta-x-'))).toEqual([]);
  });

  // Asked for less motion, the slides and the accordions jump. The element under the header has a slide of its own at a
  // higher specificity, so it's named too
  test('takes the slides and the accordions transitions away for reduced motion', () => {
    const css = sheet.replace(/\s+/g, ' ');
    // Each reduced-motion rule's selectors, one by one (a substring check would take `.ta-x-y-hide` from
    // `.ta-x-sticky-under-header.ta-x-y-hide`), from the rules that take the transition away
    const reduced = [...css.matchAll(/@media ?\(prefers-reduced-motion: ?reduce\) ?\{(.*?\})\s*\}/g)].flatMap(
      ([, block]) =>
        [...block.matchAll(/([^{}]+)\{([^}]*)\}/g)]
          .filter(([, , declarations]) => /transition: ?none/.test(declarations))
          .flatMap(([, selectors]) => selectors.split(',').map((listed) => listed.trim()))
    );

    for (const selector of [
      '.ta-x-y-show',
      '.ta-x-y-hide',
      '.ta-x-sticky-under-header.ta-x-y-hide',
      '.ta-x-accordion svg',
      '.ta-x-accordion-content'
    ]) {
      expect(
        reduced.some((listed) => listed === selector || listed.endsWith(` ${selector}`)),
        selector
      ).toBe(true);
    }
  });

  // At document-start, so the page never shows unstyled
  test('adds the sheet before the page has a body, and the root class once it has one', async () => {
    const addBody = withoutBody();

    const adding = stylesheet();
    await tick();

    expect(addStyle).toHaveBeenCalledExactlyOnceWith(sheet);

    const body = addBody();
    await adding;

    expect(body.classList).toContain(rootClass);
  });
});

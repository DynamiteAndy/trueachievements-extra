import { find, mountForTest, renderElement, required, setHtml } from '@ta-x-test';

import css from '../highlight-wishlist-items.scss';

import { WishlistPill } from './WishlistPill';

describe('WishlistPill', () => {
  // The compiled stylesheet's rules, as [selector, body]
  const rules = (): [string, string][] =>
    [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => [selector.trim(), body]);
  const selectorsWith = (body: string): string => {
    const found = rules().filter(([, ruleBody]) => ruleBody.includes(body));
    expect(found.length).toBeGreaterThan(0);
    return found.map(([selector]) => selector).join(',');
  };

  test.each([
    ['item', 'ta-x-wishlist-pill-item'],
    ['containing', 'ta-x-wishlist-pill-containing']
  ] as const)('should label a %s row with its own class', (kind, kindClass) => {
    expect(renderElement(<WishlistPill kind={kind} />)).toHaveExactClasses(['ta-x-wishlist-pill', kindClass]);
  });

  // The site's table sort reads the name cell's text: the label's words are in our stylesheet
  test('should put no text in the page, its words coming from the stylesheet', () => {
    expect(renderElement(<WishlistPill kind="item" />).textContent).toBe('');
    expect(
      rules()
        .filter(([selector]) => selector.endsWith(':before'))
        .map(([selector, body]) => [selector.split(' ').at(-1), body.trim()])
    ).toEqual([
      ['.ta-x-wishlist-pill.ta-x-wishlist-pill-item:before', 'content:"Wishlist"'],
      ['.ta-x-wishlist-pill.ta-x-wishlist-pill-containing:before', 'content:"Contains wishlist"']
    ]);
  });

  // A row hidden by Hide Owned Items or Hide Unobtainable Items sets its text to nothing: the label goes too
  test('should be hidden in a row a hide feature has hidden, and only there', () => {
    setHtml('@ta-x-test-views/sale-article/black-friday-wishlist-games.html');
    document.body.classList.add('trueachievement-extras');
    const [hiddenRow, shownRow] = [...document.querySelectorAll('table.sale tbody tr')];
    hiddenRow.setAttribute('data-row-hidden', 'true');
    shownRow.setAttribute('data-row-hidden', 'false');
    const hidden = mountForTest(<WishlistPill kind="item" />, find('td', hiddenRow)).element;
    const shown = mountForTest(<WishlistPill kind="item" />, find('td', shownRow)).element;
    const hiding = selectorsWith('display:none');

    expect([required(hidden).matches(hiding), required(shown).matches(hiding)]).toEqual([true, false]);
  });
});

import { find, getAccordions, getSettings, mountInPage, required, setSettings, shownSettings } from '@ta-x-test';

import { SalesSettings } from './SalesSettings';

describe('SalesSettings', () => {
  test('should show every setting while the settings it depends on are on, each saving to its own', () => {
    setSettings({ 'news.sales.autoSortBy': true, 'news.sales.highlightWishlistItems': true });

    expect(getSettings(<SalesSettings />)).toEqual([
      ['ta-x-news-sales-auto-sort-by', 'news.sales.autoSortBy'],
      ['ta-x-news-sales-auto-sort-by-value', 'news.sales.autoSortByValue'],
      ['ta-x-news-sales-auto-sort-by-order', 'news.sales.autoSortByOrder'],
      ['ta-x-news-sales-hide-owned-items', 'news.sales.hideOwnedItems'],
      ['ta-x-news-sales-hide-unobtainable-items', 'news.sales.hideUnobtainableItems'],
      ['ta-x-news-sales-highlight-wishlist-items', 'news.sales.highlightWishlistItems'],
      [
        'ta-x-news-sales-highlight-bundles-containing-wishlist-items',
        'news.sales.highlightBundlesContainingWishlistItems'
      ],
      ['ta-x-news-sales-collapsible-groups', 'news.sales.collapsibleGroups']
    ]);
  });

  test('should put them in an accordion', () => {
    expect(getAccordions(<SalesSettings />)).toEqual(['Sales']);
  });

  test('should leave out the settings that depend on sorting and highlighting while those are off', () => {
    expect(shownSettings(<SalesSettings />)).toEqual([
      'ta-x-news-sales-auto-sort-by',
      'ta-x-news-sales-hide-owned-items',
      'ta-x-news-sales-hide-unobtainable-items',
      'ta-x-news-sales-highlight-wishlist-items',
      'ta-x-news-sales-collapsible-groups'
    ]);
  });

  // The bundles row sits right under the toggle that reveals it, with the usual line under it before the next setting
  test('should put the bundles row right under Highlight Wishlist Items, with no line between them', () => {
    setSettings({ 'news.sales.highlightWishlistItems': true });
    const { container } = mountInPage(<SalesSettings />);
    const rowOf = (id: string) => required(find(id, container).closest('.ta-x-checkbox'));

    expect(rowOf('#ta-x-news-sales-highlight-wishlist-items')).toHaveExactClasses([
      'ta-x-checkbox',
      'ta-x-hide-border-when-checked'
    ]);
    expect(rowOf('#ta-x-news-sales-highlight-bundles-containing-wishlist-items')).toHaveExactClasses([
      'ta-x-checkbox',
      'ta-x-hide-padding-top'
    ]);
  });
});

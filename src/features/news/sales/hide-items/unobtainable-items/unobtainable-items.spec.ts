import { settings } from '@ta-x-storage';
import { expectAppliesLive, setHtml, setSettings } from '@ta-x-test';

import { saleRowStates } from '../../sale-tables.spec-helpers';

import hideUnobtainableItems from '.';

describe('news/sales/hide-items/unobtainable-items', () => {
  // Starts it, stopping it when the test ends
  const run = (): void => {
    onTestFinished(hideUnobtainableItems());
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/sale-article/unobtainable-picks.html');
  });

  test('should hide the rows the site flags with unobtainable achievements, and only those, saying why', () => {
    setSettings({ 'news.sales.hideUnobtainableItems': true });

    run();

    expect(saleRowStates()).toEqual([
      ['/products/30159/Bundle-South-Park--The-Stick-of-Truth--The-Fractured-but-Whole', false],
      ['/game/Child-of-Light/achievements', true],
      ['/game/Sea-of-Thieves/achievements', true],
      ['/game/Session/achievements', false]
    ]);
    const rows = [...document.querySelectorAll('table.sale tbody tr')];
    expect([rows[1], rows[2]].map((row) => row.textContent.includes('Hidden by "Hide Unobtainable Items"'))).toEqual([
      true,
      true
    ]);
  });

  test('should apply live: on, off and on again from the menu, off giving the rows back exactly', async () => {
    setSettings({ 'news.sales.hideUnobtainableItems': false });
    run();

    await expectAppliesLive(settings.news.sales.hideUnobtainableItems);
  });
});

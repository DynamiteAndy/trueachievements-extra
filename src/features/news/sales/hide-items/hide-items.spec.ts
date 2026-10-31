import { isAppliedLive, settings } from '@ta-x-storage';
import { setHtml, setSettings } from '@ta-x-test';

import { saleRowStates } from '../sale-tables.spec-helpers';

import hideItems from '.';

// The entry in front of the two hide features (each has its own spec): it starts both, each applying its own setting
// live, and its stop stops both
describe('news/sales/hide-items', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/sale-article/unobtainable-picks.html');
  });

  test('should start both, each hiding while its own setting is on, and give every row back once stopped', () => {
    setSettings({
      'news.sales.hideOwnedItems': false,
      'news.sales.hideUnobtainableItems': true
    });
    // Each registers its setting while running, whatever its value, so a feature left out shows here
    const live = (): boolean[] =>
      [settings.news.sales.hideOwnedItems, settings.news.sales.hideUnobtainableItems].map(isAppliedLive);

    const stop = hideItems();
    expect(saleRowStates().filter(([, hidden]) => hidden)).toHaveLength(2);
    expect(live()).toEqual([true, true]);

    stop();
    expect(saleRowStates().filter(([, hidden]) => hidden)).toEqual([]);
    expect(live()).toEqual([false, false]);
  });
});

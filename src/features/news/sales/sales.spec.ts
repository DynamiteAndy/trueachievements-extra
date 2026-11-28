import * as taxLib from '@ta-x-lib';
import { setHtml, stillParsing, tick } from '@ta-x-test';

import autoSortBy from './auto-sort-by';
import collapsibleGroups from './collapsible-groups';
import hideAdRows from './hide-ad-rows';
import hideItems from './hide-items';
import highlightWishlistItems from './highlight-wishlist-items';

import sales from '.';

// The sales entry (each feature has its own spec): hiding ad rows at once, the table features once the article is
// parsed and only if it has a table the site sorts
describe('news/sales', () => {
  const tableTasks = [
    { name: 'news:sales:auto-sort-by', task: autoSortBy },
    { name: 'news:sales:hide-items', task: hideItems },
    { name: 'news:sales:highlight-wishlist-items', task: highlightWishlistItems },
    { name: 'news:sales:collapsible-groups', task: collapsibleGroups }
  ];
  // Only the table batch is stubbed: the entry's own batch runs, so its tasks do
  const stubTableBatch = () => {
    const allConcurrently = taxLib.allConcurrently;

    return vi
      .spyOn(taxLib, 'allConcurrently')
      .mockImplementation(async (name, tasks, max) =>
        name === 'Sale Tables' ? [] : allConcurrently(name, tasks, max)
      );
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/sale-article/shocktober-groups.html');
  });

  test('starts the table features once, on an article with a sale table', async () => {
    const spy = stubTableBatch();

    await sales();

    expect(spy).toHaveBeenCalledWith('Sales News', [
      { name: 'news:sales:hide-ad-rows', task: hideAdRows },
      { name: 'news:sales:tables', task: expect.any(Function) }
    ]);
    expect(spy.mock.calls.filter((call) => call[0] === 'Sale Tables')).toEqual([['Sale Tables', tableTasks]]);
  });

  test("doesn't start the table features on an article without a table the site sorts", async () => {
    document.querySelectorAll('table.sale [data-sort]').forEach((cell) => cell.removeAttribute('data-sort'));
    const spy = stubTableBatch();

    await sales();

    expect(spy.mock.calls.map(([name]) => name)).toEqual(['Sales News']);
  });

  test('starts the table features only once the article is parsed', async () => {
    const finishParsing = stillParsing();
    const spy = stubTableBatch();

    const running = sales();
    await tick();

    expect(spy.mock.calls.map(([name]) => name)).toEqual(['Sales News']);

    finishParsing();
    await running;

    expect(spy.mock.calls.map(([name]) => name)).toEqual(['Sales News', 'Sale Tables']);
  });
});

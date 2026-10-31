import vm from 'node:vm';

import { pageScript } from '@ta-x-page';
import { isAppliedLive, settings } from '@ta-x-storage';
import { changeSettingLive, required, setHtml, setSettings } from '@ta-x-test';

import { capturedAdRow } from '../ad-row.spec-helpers';
import { saleTables } from '../sale-tables';

import autoSortBy, { sortSaleTables } from '.';

describe('news/sales/auto-sort-by', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/sale-article/shocktober-groups.html');
    // The script goes in <head>, which a new page's HTML doesn't replace
    document.querySelectorAll('script#ta-x-sales-auto-sort-by').forEach((script) => script.remove());
  });

  const sortBy = (value: string[], order: 'asc' | 'desc'): void =>
    setSettings({
      'news.sales.autoSortBy': true,
      'news.sales.autoSortByValue': value,
      'news.sales.autoSortByOrder': order
    });

  const injected = (): HTMLScriptElement | null => document.querySelector('script#ta-x-sales-auto-sort-by');

  describe('the page script', () => {
    // Run from its source in a context holding only the page's globals, as it is in the page. The site's jQuery is a
    // stand-in recording each header's stupidsort call; head.ready holds its callback until the spec runs it, as the
    // site's script loader does until every script is in
    const runInPage = (
      columns: string[],
      order: string,
      { withHead = true, currentScript = null as Element | null, readyState = 'loading' } = {}
    ) => {
      const sorted: string[] = [];
      const forgotten: string[] = [];
      let ready: (() => void) | undefined;
      const page = {
        $: (header: HTMLElement) => ({
          stupidsort: (direction: string) => sorted.push(`${header.textContent.trim()} ${direction}`),
          removeData: (key: string) => forgotten.push(`${header.textContent.trim()} ${key}`)
        }),
        head: withHead ? { ready: (callback: () => void) => (ready = callback) } : undefined,
        addEventListener: (type: string, callback: () => void) => type === 'load' && (ready = callback)
      };

      // The page's document, but for the script that's running (null when it isn't known, as happy-dom has it) and how
      // far the page has loaded (happy-dom's is always complete)
      const pageDocument = new Proxy(document, {
        get: (target, key) => {
          if (key === 'currentScript') {
            return currentScript;
          }

          return key === 'readyState' ? readyState : Reflect.get(target, key, target);
        }
      });
      vm.runInNewContext(pageScript(sortSaleTables, saleTables, columns, order), {
        window: page,
        document: pageDocument
      });

      return { sorted, forgotten, ready: () => ready?.() };
    };

    test("should sort nothing once its script has gone, if sorting was turned off before the site's loader was ready", () => {
      const script = document.createElement('script');
      const { sorted, ready } = runInPage(['discount'], 'desc', { currentScript: script });

      ready();

      expect(sorted).toEqual([]);
    });

    test('should still sort while its script is on the page', () => {
      const script = document.head.appendChild(document.createElement('script'));
      onTestFinished(() => script.remove());
      const { sorted, ready } = runInPage(['discount'], 'desc', { currentScript: script });

      ready();

      expect(sorted).toEqual(['Discount desc', 'Discount desc']);
    });

    // stupid-table skips sorting a column the way it last sorted it, which after our undo it would have
    test('should make the site forget the direction it last sorted each column in before sorting it', () => {
      const { sorted, forgotten, ready } = runInPage(['discount'], 'desc');

      ready();

      expect(forgotten).toEqual(['Discount sort-dir', 'Discount sort-dir']);
      expect(sorted).toEqual(['Discount desc', 'Discount desc']);
    });

    test("should sort each table by the column with the site's stupidsort once its scripts are in", () => {
      const { sorted, ready } = runInPage(['discount'], 'desc');

      expect(sorted).toEqual([]);

      ready();

      expect(sorted).toEqual(['Discount desc', 'Discount desc']);
    });

    test("should match a column of two words by the setting's hyphenated value", () => {
      const { sorted, ready } = runInPage(['sale-price'], 'asc');

      ready();

      expect(sorted).toEqual(['Sale Price asc', 'Sale Price asc']);
    });

    test('should take the first column a list of them matches', () => {
      // "Product" on games tables, "Game" on some others
      const { sorted, ready } = runInPage(['product', 'game'], 'desc');

      ready();

      expect(sorted).toEqual(['Product desc', 'Product desc']);
    });

    test('should leave a table without the column', () => {
      const { sorted, ready } = runInPage(['ta-ratio'], 'asc');

      ready();

      expect(sorted).toEqual([]);
    });

    test("should wait for the page's load where the site has no script loader", () => {
      const { sorted, ready } = runInPage(['discount'], 'asc', { withHead: false });

      expect(sorted).toEqual([]);

      ready();

      expect(sorted).toEqual(['Discount asc', 'Discount asc']);
    });

    // Turned on, or changed, from the menu once the page has loaded: the load it would wait for has passed
    test('should sort at once where the site has no script loader and the page has already loaded', () => {
      const { sorted } = runInPage(['discount'], 'asc', { withHead: false, readyState: 'complete' });

      expect(sorted).toEqual(['Discount asc', 'Discount asc']);
    });
  });

  // Starts it, stopping it when the test ends
  const run = (): void => {
    onTestFinished(autoSortBy());
  };

  test('should leave the tables alone while sorting is off', () => {
    run();

    expect(injected()).toBeNull();
  });

  test('should leave products ascending alone, as the site serves them that way', () => {
    sortBy(['product', 'game'], 'asc');

    run();

    expect(injected()).toBeNull();
  });

  test('should give the page the sort to run with the chosen column and order', () => {
    sortBy(['discount'], 'desc');

    run();

    expect(required(injected()).textContent).toBe(pageScript(sortSaleTables, saleTables, ['discount'], 'desc'));
  });

  // Live. The site's stupid-table sorting isn't in the spec's page, so a sort is stood in
  // for by what it does: the first table's rows reversed, and its header marked
  describe('changed with the page open', () => {
    const { autoSortBy: sorting, autoSortByOrder, autoSortByValue } = settings.news.sales;
    const firstTable = (): HTMLTableElement => required(document.querySelector<HTMLTableElement>('table.sale'));
    const rowOrder = (): string[] =>
      [...firstTable().tBodies[0].querySelectorAll(':scope > tr')].map((row) => row.textContent.trim().slice(0, 30));
    const standInSort = (): void => {
      const [body] = firstTable().tBodies;
      body.append(...[...body.querySelectorAll(':scope > tr')].reverse());
      const header = required(firstTable().querySelector<HTMLElement>('.headers [data-sort]'));
      header.classList.add('sorting-desc');
      header.setAttribute('data-sort-dir', 'desc');
    };

    test('should put each table back exactly as it was when turned off, rows and header, and take its script away', async () => {
      // A sale whose table has several rows (the Shocktober groups' have one each)
      setHtml('@ta-x-test-views/sale-article/owned-picks.html');
      setSettings({ 'news.sales.autoSortBy': false });
      run();
      const page = firstTable().outerHTML;
      const order = rowOrder();

      sortBy(['discount'], 'desc');
      await changeSettingLive(sorting, true);
      expect(injected()).not.toBeNull();
      standInSort();
      expect(rowOrder()).not.toEqual(order);

      await changeSettingLive(sorting, false);

      expect(firstTable().outerHTML).toBe(page);
      expect(injected()).toBeNull();
    });

    test('should put a row added after sorting (the site adds ad rows once the page has loaded) after the row it follows, not first', async () => {
      setHtml('@ta-x-test-views/sale-article/owned-picks.html');
      sortBy(['discount'], 'desc');
      run();
      // Sorted (stood in for), then the site adds a row after the second
      standInSort();
      const [, second] = firstTable().tBodies[0].querySelectorAll(':scope > tr');
      const adRow = capturedAdRow();
      second.after(adRow);
      const follows = (): string | undefined => adRow.previousElementSibling?.textContent.trim().slice(0, 30);
      const before = follows();

      await changeSettingLive(sorting, false);

      expect(adRow.parentElement).toBe(firstTable().tBodies[0]);
      expect(firstTable().tBodies[0].firstElementChild).not.toBe(adRow);
      expect(follows()).toBe(before);
    });

    test('should apply its setting, column and order live, while running only', () => {
      const live = [sorting, autoSortByValue, autoSortByOrder];
      const stop = autoSortBy();

      expect(live.map(isAppliedLive)).toEqual([true, true, true]);

      stop();

      expect(live.map(isAppliedLive)).toEqual([false, false, false]);
    });

    test('should sort again by the new column when it changes', async () => {
      sortBy(['discount'], 'desc');
      run();

      await changeSettingLive(autoSortByValue, ['price']);

      expect(document.querySelectorAll('script#ta-x-sales-auto-sort-by')).toHaveLength(1);
      expect(required(injected()).textContent).toBe(pageScript(sortSaleTables, saleTables, ['price'], 'desc'));
    });

    test('should sort again with the new order when it changes, from the order the page had', async () => {
      sortBy(['discount'], 'desc');
      run();
      expect(required(injected()).textContent).toBe(pageScript(sortSaleTables, saleTables, ['discount'], 'desc'));

      await changeSettingLive(autoSortByOrder, 'asc');

      expect(document.querySelectorAll('script#ta-x-sales-auto-sort-by')).toHaveLength(1);
      expect(required(injected()).textContent).toBe(pageScript(sortSaleTables, saleTables, ['discount'], 'asc'));
    });
  });
});

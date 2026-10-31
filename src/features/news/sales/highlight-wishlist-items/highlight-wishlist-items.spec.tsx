import * as taxFetch from '@ta-x-fetch';
import { settings } from '@ta-x-storage';
import {
  changeSettingLive,
  expectAppliesLive,
  emptyMemoizedFetches,
  find,
  readFixture,
  readFixtureDocument,
  required,
  setHtml,
  setSettings,
  tick
} from '@ta-x-test';

import { capturedAdRow } from '../ad-row.spec-helpers';
import { saleRows } from '../sale-tables';

import highlightWishlistItems from '.';

describe('news/sales/highlight-wishlist-items', () => {
  const { highlightWishlistItems: highlight, highlightBundlesContainingWishlistItems: withBundles } =
    settings.news.sales;
  const wishlist = readFixture('@ta-x-test-views/gamer-wishlist/on-sale.html');
  const pill = '.ta-x-wishlist-pill';

  // Opens a sale article signed in: its fixtures are server HTML (signed out), so the signed-in header's gamer link
  // comes from the live capture the owned items fixture has
  const openArticle = (article: 'games' | 'bundles' | 'dlc'): void => {
    setHtml(`@ta-x-test-views/sale-article/black-friday-wishlist-${article}.html`, {
      url: 'https://www.trueachievements.com/news/xbox-black-friday-sale-2026'
    });
    const nav = required(readFixtureDocument('@ta-x-test-views/sale-article/owned-picks.html').querySelector('nav'));
    document.body.prepend(document.importNode(nav, true));
  };

  // Starts it, stopping it when the test ends, and lets its lookup of the wishlist finish
  const run = async (): Promise<void> => {
    onTestFinished(highlightWishlistItems());
    await tick();
    await tick();
  };

  // Each sale row, in order, as [its name, its label or null]
  const labels = (): [string, string | null][] =>
    [...document.querySelectorAll(saleRows)].map((row) => {
      const label = row.querySelector(pill);
      const kind = label?.classList.contains(`${pill.slice(1)}-item`)
        ? 'Wishlist'
        : label?.classList.contains(`${pill.slice(1)}-containing`)
          ? 'Contains wishlist'
          : null;

      return [row.querySelector('td')?.textContent.replace(/\s+/g, ' ').trim() ?? 'ad row', kind];
    });

  beforeEach(() => {
    emptyMemoizedFetches();
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=96119');
  });

  test("should label the wishlisted games, fetching the signed-in gamer's wishlist", async () => {
    openArticle('games');
    setSettings({ 'news.sales.highlightWishlistItems': true });
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(wishlist));

    await run();

    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(
      'https://www.trueachievements.com/gamer/Dynamite+Andy/wishlist?sale=1',
      {}
    );
    expect(labels()).toEqual([
      ['A World of Keflings', null],
      ['Monster Hunter Stories 3: Twisted Reflection', 'Wishlist'],
      ['RuneScape: Dragonwilds', 'Wishlist'],
      ['Starsand Island', 'Wishlist'],
      ['Railway Empire', 'Wishlist'],
      // On sale as itself alone: its buy link is in the wishlist item's head
      ['Rebel Galaxy', 'Wishlist']
    ]);
  });

  // The Expansion Pass row lists the DLC it includes after its name, so the label goes before that list
  test("should put the label right after the row's name link, before anything else in the cell", async () => {
    openArticle('dlc');
    setSettings({
      'news.sales.highlightWishlistItems': true,
      'news.sales.highlightBundlesContainingWishlistItems': true
    });
    vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(wishlist));

    await run();

    const name = find('td:first-child > a[href="/products/90076/Age-of-Mythology-Retold--Expansion-Pass"]');
    expect(required(name.nextSibling)).toBe(find(pill, required(name.parentElement)));
    expect(required(name.parentElement).lastElementChild).not.toBe(find(pill, required(name.parentElement)));
  });

  // A sale's editions and bundles link only their base game's page, so matching by game link would label them all
  test('should leave the editions and bundles of wishlisted games unlabelled while the bundles setting is off', async () => {
    openArticle('bundles');
    setSettings({ 'news.sales.highlightWishlistItems': true });
    vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(wishlist));

    await run();

    expect(labels().filter(([, label]) => label)).toEqual([]);
  });

  test('should label the products containing a wishlisted item with the bundles setting on', async () => {
    openArticle('bundles');
    setSettings({
      'news.sales.highlightWishlistItems': true,
      'news.sales.highlightBundlesContainingWishlistItems': true
    });
    vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(wishlist));

    await run();

    expect(labels().map(([, label]) => label)).toEqual([
      null,
      null,
      'Contains wishlist',
      'Contains wishlist',
      'Contains wishlist',
      'Contains wishlist'
    ]);
  });

  test('should label a wishlisted DLC as itself, and a pass containing it only with the bundles setting on', async () => {
    openArticle('dlc');
    setSettings({ 'news.sales.highlightWishlistItems': true });
    vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(wishlist));
    await run();

    expect(labels().map(([, label]) => label)).toEqual([null, null, 'Wishlist', null, null]);

    await changeSettingLive(withBundles, true);
    await tick();

    expect(labels().map(([, label]) => label)).toEqual([null, 'Contains wishlist', 'Wishlist', null, null]);

    // And off again: the pass's label taken away, the DLC's own kept
    await changeSettingLive(withBundles, false);
    await tick();

    expect(labels().map(([, label]) => label)).toEqual([null, null, 'Wishlist', null, null]);
  });

  // The article lists DEATHLOOP's Deluxe Pack twice: a wishlisted product listed twice is labelled twice
  test('should label every row of a product the article lists more than once', async () => {
    openArticle('dlc');
    setSettings({ 'news.sales.highlightWishlistItems': true });
    // By its store id: the Expansion Pass's row links Obsidian Mirror's DLC page too
    const obsidianMirror = required(find('a[href*="9MZ8F6B0SL7M"]').closest('tr'));
    obsidianMirror.after(obsidianMirror.cloneNode(true));
    vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(wishlist));

    await run();

    expect(labels().map(([, label]) => label)).toEqual([null, null, 'Wishlist', 'Wishlist', null, null]);
  });

  test("should step over the site's ad rows", async () => {
    openArticle('games');
    setSettings({ 'news.sales.highlightWishlistItems': true });
    find('table.sale tbody tr').after(capturedAdRow());
    vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(wishlist));

    await run();

    expect(labels().slice(0, 3)).toEqual([
      ['A World of Keflings', null],
      ['', null],
      ['Monster Hunter Stories 3: Twisted Reflection', 'Wishlist']
    ]);
  });

  // Signed out, the header has no gamer link (it would be waited for until waitForElement's timeout)
  test('should do nothing when no gamer is signed in, without waiting for a gamer link', async () => {
    openArticle('games');
    setSettings({ 'news.sales.highlightWishlistItems': true });
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('');
    find('nav').remove();
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(wishlist));

    await run();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(document.querySelector(pill)).toBeNull();
  });

  test('should apply live: on, off and on again from the menu, off giving the rows back exactly', async () => {
    openArticle('dlc');
    setSettings({
      'news.sales.highlightWishlistItems': false,
      'news.sales.highlightBundlesContainingWishlistItems': true
    });
    vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(wishlist));
    await run();

    await expectAppliesLive(highlight);
  });

  test('should label nothing when turned off while the wishlist is looked up', async () => {
    openArticle('games');
    setSettings({ 'news.sales.highlightWishlistItems': true });
    let answer = (): void => undefined;
    vi.spyOn(taxFetch, 'fetchOk').mockReturnValue(
      new Promise((resolve) => {
        answer = () => resolve(new Response(wishlist));
      })
    );
    // Any label at any moment, not only at the end (a label added and taken straight back flashes)
    let everLabelled = false;
    const watcher = new MutationObserver(() => {
      everLabelled ||= document.querySelector(pill) !== null;
    });
    watcher.observe(document.body, { childList: true, subtree: true });
    onTestFinished(() => watcher.disconnect());
    await run();

    await changeSettingLive(highlight, false);
    answer();
    await tick();
    await tick();

    expect(everLabelled).toBe(false);
  });
});

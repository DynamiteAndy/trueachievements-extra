import * as taxFetch from '@ta-x-fetch';
import { memoizedFetches } from '@ta-x-fetch';
import { settings } from '@ta-x-storage';
import {
  changeSettingLive,
  emptyMemoizedFetches,
  expectAppliesLive,
  find,
  readFixture,
  required,
  setHtml,
  setSettings,
  tick
} from '@ta-x-test';

import { saleRowStates } from '../../sale-tables.spec-helpers';

import hideOwnedItems from '.';

describe('news/sales/hide-items/owned-items', () => {
  const gamerGames = readFixture('@ta-x-test-views/gamer-games/all-games-list.html');
  // The site's answer to the games list request: the whole list, each time it's fetched
  const answerGamesList = () => vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(gamerGames));
  // Starts it, stopping it when the test ends, and lets its lookup of the gamer's games finish
  const run = async (): Promise<void> => {
    onTestFinished(hideOwnedItems());
    await tick();
  };

  // The cache test puts the real cache back
  let realCache = (): void => undefined;
  beforeEach(() => {
    setHtml('@ta-x-test-views/sale-article/owned-picks.html', {
      url: 'https://www.trueachievements.com/news/xbox-sales-september-24-2026'
    });
    realCache = emptyMemoizedFetches();
  });

  // Signed out, the header has no gamer link (it would be waited for until waitForElement's timeout, longer than the
  // spec's). Off is the live test's (writing-specs.md, "Settings that apply live")
  test('should do nothing when no gamer is signed in, without waiting for a gamer link', async () => {
    setSettings({ 'news.sales.hideOwnedItems': true });
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('');
    find('nav').remove();
    const fetchSpy = answerGamesList();

    await run();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(saleRowStates().filter(([, hidden]) => hidden)).toEqual([]);
  });

  test("should hide the gamer's games, their completed games' DLC and bundles they own all of, stepping over the site's ad rows", async () => {
    // The site adds an ad row (no link in it) every few rows, once the page has loaded
    setHtml('@ta-x-test-views/sale-article/owned-picks-with-ad-row.html', {
      url: 'https://www.trueachievements.com/news/xbox-sales-september-24-2026'
    });
    setSettings({ 'news.sales.hideOwnedItems': true });
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');
    const fetchSpy = answerGamesList();

    await run();

    // Every game in one answer, for the signed-in gamer
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(
      'https://www.trueachievements.com/gamer/Dynamite+Andy/games?executeformfunction&function=AjaxList&params=oGamerGamesList%7C%26ddlPlatformIDs%3D%26ddlGenreIDs%3D%26asdGamePropertyID%3D-1%26oGamerGamesList_Order%3DLastScanned%20desc%26oGamerGamesList_Page%3D1%26oGamerGamesList_ItemsPerPage%3D100%26oGamerGamesList_TimeZone%3DGMT%20Standard%20Time%26oGamerGamesList_ShowAll%3DTrue%26txtGamerID%3D52877%26txtTARatioType%3DMyTARatio%26txtDLCInclusionSetting%3DAllDLC%26txtBoostListOnly%3DFalse%26txtShowDLCInfo%3DTrue%26txtConfirmedGenres%3DFalse%26txtCompleteOnly%3DFalse%26txtSiteLeaderboardFilterDefinitionID%3D0%26txtGamePropertyID%3D0',
      { method: 'POST' }
    );
    expect(saleRowStates()).toEqual([
      ['/products/74624/Assassins-Creed-Mirage-and-Assassins-Creed-Valhalla-Bundle', true],
      ['/products/28034/Americas-Greatest-Game-Shows-Wheel-of-Fortune-and-Jeopardy', false],
      // The game is completed
      ['/game/Assassins-Creed-Syndicate/dlc/Jack-The-Ripper', true],
      // Owned, but not completed
      ['/game/Assassins-Creed-Valhalla/dlc/The-Siege-of-Paris', false],
      // Left alone
      ['ad row', false],
      ['/game/DREDGE/dlc/The-Iron-Rig', false],
      // Still hidden, after the ad row
      ['/game/Assassins-Creed-Mirage/achievements', true],
      ['/game/Aven-Colony/achievements', false],
      ['/products/3063/Far-Cry-Primal--Wenja-Pack', false]
    ]);
  });

  // The list is several MB for a big library: only the two lists read from it are kept, so a later visit parses nothing
  test("should keep only the gamer's game lists, and read them from the cache on a later visit", async () => {
    realCache();
    setSettings({ 'news.sales.hideOwnedItems': true });
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');
    const fetchSpy = answerGamesList();
    const kept = async (key: string): Promise<string | null> => await memoizedFetches.get(key);
    onTestFinished(hideOwnedItems());
    await vi.waitFor(async () => {
      expect(fetchSpy).toHaveBeenCalledOnce();
      expect(await kept(`${fetchSpy.mock.calls[0][0]}#owned-games`)).not.toBeNull();
    });
    const [url] = fetchSpy.mock.calls[0];
    const lists = JSON.parse(required(await kept(`${url}#owned-games`))) as Record<string, string[]>;
    const hidden = saleRowStates();

    expect(Object.keys(lists)).toEqual(['urls', 'completeNames']);
    expect(lists.urls).toContain('/game/Assassins-Creed-Mirage/achievements');
    expect(await kept(url)).toBeNull();

    setHtml('@ta-x-test-views/sale-article/owned-picks.html', {
      url: 'https://www.trueachievements.com/news/xbox-sales-september-24-2026'
    });
    const parse = vi.spyOn(DOMParser.prototype, 'parseFromString');
    onTestFinished(hideOwnedItems());

    await vi.waitFor(() => expect(saleRowStates()).toEqual(hidden));
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(parse).not.toHaveBeenCalled();
  });

  // The fixture's Mirage and Valhalla bundle, with the Valhalla DLC row's link added to it: both games owned, but that
  // DLC's game isn't completed
  test("should leave a bundle whose games are owned but whose DLC isn't", async () => {
    setSettings({ 'news.sales.hideOwnedItems': true });
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');
    answerGamesList();
    const [bundle, dlc] = [
      ...document.querySelectorAll<HTMLAnchorElement>('table.sale tbody tr td:first-child > a')
    ].filter((link) => /74624|The-Siege-of-Paris/.test(link.href));
    find('.indent', bundle.closest('td')).append(' • ', dlc.cloneNode(true));

    await run();

    expect(saleRowStates()[0]).toEqual([
      '/products/74624/Assassins-Creed-Mirage-and-Assassins-Creed-Valhalla-Bundle',
      false
    ]);
  });

  // The same bundle, with another row's product link added to it: what that product holds isn't known, so the bundle
  // isn't counted as owned, though both its games are
  test("should leave a bundle holding something that's neither a game nor DLC", async () => {
    setSettings({ 'news.sales.hideOwnedItems': true });
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');
    answerGamesList();
    const [bundle, product] = [
      ...document.querySelectorAll<HTMLAnchorElement>('table.sale tbody tr td:first-child > a')
    ].filter((link) => /74624|28034/.test(link.href));
    find('.indent', bundle.closest('td')).append(' • ', product.cloneNode(true));

    await run();

    expect(saleRowStates()[0]).toEqual([
      '/products/74624/Assassins-Creed-Mirage-and-Assassins-Creed-Valhalla-Bundle',
      false
    ]);
  });

  test('should apply live: on, off and on again from the menu, off giving the rows back exactly', async () => {
    setSettings({ 'news.sales.hideOwnedItems': false });
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');
    const fetchSpy = answerGamesList();
    await run();
    // Nor looked up while off
    expect(fetchSpy).not.toHaveBeenCalled();

    await expectAppliesLive(settings.news.sales.hideOwnedItems);
  });

  test("should hide nothing when turned off while the gamer's games are looked up", async () => {
    setSettings({ 'news.sales.hideOwnedItems': true });
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');
    let answer = (): void => undefined;
    vi.spyOn(taxFetch, 'fetchOk').mockReturnValue(
      new Promise((resolve) => {
        answer = () => resolve(new Response(gamerGames));
      })
    );
    // Every row hidden at any moment, not only at the end (a row hidden and given straight back flashes)
    let everHidden = 0;
    const watcher = new MutationObserver(() => {
      everHidden = Math.max(everHidden, saleRowStates().filter(([, hidden]) => hidden).length);
    });
    watcher.observe(document.body, { attributes: true, subtree: true, childList: true });
    onTestFinished(() => watcher.disconnect());
    await run();

    await changeSettingLive(settings.news.sales.hideOwnedItems, false);
    answer();
    await tick();
    await tick();

    expect(everHidden).toBe(0);
  });
});

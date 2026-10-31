import { ownerProgressUrls, previewPageWalkthroughs } from '@ta-x-features';
import { memoizedFetches } from '@ta-x-fetch';
import { migrations, storageVersionKey } from '@ta-x-storage';
import { required, setHtml, stillParsing, tick, useFakeTimers } from '@ta-x-test';

// The hand-over's destination, which the task itself never reads
import { importedGuides } from './features/game/extra-guides/imported-guides';
import {
  cacheGamerKey,
  expiringStores,
  forgetLastGamer,
  maintenance,
  refreshVisitedPage,
  sweepExpired,
  sweptKey
} from './maintenance';

describe('maintenance', () => {
  const inAWeek = (): Date => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const aSecondAgo = (): Date => new Date(Date.now() - 1000);

  test('runs the storage migrations before it returns to the caller, so before any feature starts', () => {
    GM_setValue('memoized', 'old');

    const running = maintenance();

    expect(GM_getValue(storageVersionKey)).toBe(migrations.length);
    expect(GM_listValues()).not.toContain('memoized');

    return running;
  });

  test('sweeps the expired entries from every expiring store, keeping the rest', async () => {
    await memoizedFetches.set('https://www.trueachievements.com/game/BLUD', '<html>expired</html>', aSecondAgo());
    await memoizedFetches.set('https://www.trueachievements.com/game/Bug-Village', '<html>fresh</html>', inAWeek());
    await ownerProgressUrls.set('387144', '/game/Mirrors-Edge/walkthrough', aSecondAgo());
    await ownerProgressUrls.set('162276', '/game/Mad-Rider/walkthrough', inAWeek());
    await previewPageWalkthroughs.set('22623', '3567', aSecondAgo());
    await previewPageWalkthroughs.set('7881', '1578', inAWeek());
    const clearExpired = expiringStores.map((store) => vi.spyOn(store, 'clearExpired'));

    await maintenance();

    expect(clearExpired.map((spy) => spy.mock.calls.length)).toEqual([1, 1, 1]);
    // Read through keys, as get drops an expired entry itself; each store by name, so a store left out of the sweep shows
    expect(
      await Promise.all([memoizedFetches.keys(), ownerProgressUrls.keys(), previewPageWalkthroughs.keys()])
    ).toEqual([['https://www.trueachievements.com/game/Bug-Village'], ['162276'], ['7881']]);
  });

  test('moves the guides handed over from a guide site into IndexedDB', async () => {
    const guideUrl = 'https://www.xboxachievements.com/game/mass-effect/guide/';
    GM_setValue(`importedGuides:${guideUrl}`, JSON.stringify([]));

    await maintenance();

    expect(await importedGuides.get(guideUrl)).toEqual([]);
    expect(GM_listValues()).not.toContain(`importedGuides:${guideUrl}`);
  });

  test('carries the two lists kept in Tampermonkey storage before over to IndexedDB', async () => {
    GM_setValue('walkthroughOwnerProgressUrl', JSON.stringify([['387144', '/game/Mirrors-Edge/walkthrough']]));
    GM_setValue('previewWalkthroughId', JSON.stringify([['3567', ['22622', '22623']]]));

    await maintenance();

    expect(
      await Promise.all([
        ownerProgressUrls.get('387144'),
        previewPageWalkthroughs.get('22622'),
        previewPageWalkthroughs.get('22623')
      ])
    ).toEqual(['/game/Mirrors-Edge/walkthrough', '3567', '3567']);
    expect(
      GM_listValues().filter((key) => ['walkthroughOwnerProgressUrl', 'previewWalkthroughId'].includes(key))
    ).toEqual([]);
  });

  describe('sweepExpired', () => {
    const now = new Date('2026-11-20T12:00:00Z').getTime();
    const hour = 60 * 60 * 1000;
    const clearExpired = () => expiringStores.map((store) => vi.spyOn(store, 'clearExpired'));
    const sweeps = (spies: ReturnType<typeof clearExpired>) => spies.map((spy) => spy.mock.calls.length);

    test('sweeps when it never has, and records when', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(now);
      const spies = clearExpired();

      await sweepExpired();

      expect(sweeps(spies)).toEqual([1, 1, 1]);
      expect(localStorage.getItem(sweptKey)).toBe(String(now));
    });

    test.each([
      ['not again within a day', 23 * hour, 0],
      ['again once a day has passed', 24 * hour, 1]
    ])('sweeps %s', async (_, later, times) => {
      localStorage.setItem(sweptKey, String(now));
      vi.spyOn(Date, 'now').mockReturnValue(now + later);
      const spies = clearExpired();

      await sweepExpired();

      expect(sweeps(spies)).toEqual([times, times, times]);
    });

    test('forgets the guides of unlinked guide pages with the sweep', async () => {
      const unlinked = 'https://www.xboxachievements.com/game/mass-effect/guide/';
      await importedGuides.set(unlinked, []);

      await sweepExpired();

      expect(await importedGuides.keys()).toEqual([]);
    });

    // So the next page tries again
    test("doesn't record a sweep that failed", async () => {
      vi.spyOn(ownerProgressUrls, 'clearExpired').mockRejectedValue(new Error('blocked'));

      await expect(sweepExpired()).rejects.toThrow('blocked');

      expect(localStorage.getItem(sweptKey)).toBeNull();
    });
  });

  // On a shared computer, the cached pages and the giveaway's tries belong to whoever was signed in when they were kept
  describe('forgetLastGamer', () => {
    const page = 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=3567';
    const signedIn = (gamerId: string): void => {
      vi.spyOn(document, 'cookie', 'get').mockReturnValue(gamerId ? `GamerID=${gamerId}` : '');
    };

    beforeEach(async () => {
      await memoizedFetches.set(page, '<html>cached</html>', inAWeek());
      GM_setValue('giveawayAutoOptInTried', JSON.stringify('2916'));
    });

    test('should forget nothing, and hold up nothing, for the gamer the cache was filled for', async () => {
      localStorage.setItem(cacheGamerKey, '52877');
      signedIn('52877');

      expect(forgetLastGamer()).toBeNull();
      expect(await memoizedFetches.get(page)).toBe('<html>cached</html>');
      expect(GM_getValue('giveawayAutoOptInTried')).toBe(JSON.stringify('2916'));
    });

    test.each([
      { change: 'another gamer signing in', before: '52877', after: '96119' },
      { change: 'signing in after a visit signed out', before: '', after: '52877' },
      { change: 'signing out', before: '52877', after: '' },
      { change: "a first visit, the cache's gamer unknown", before: null, after: '52877' }
    ])(
      'should empty the cache and forget the giveaway tried on $change, then remember the gamer',
      async ({ before, after }) => {
        if (before !== null) {
          localStorage.setItem(cacheGamerKey, before);
        }
        signedIn(after);

        await forgetLastGamer();

        expect(await memoizedFetches.get(page)).toBeNull();
        expect(GM_getValue('giveawayAutoOptInTried')).toBeUndefined();
        expect(localStorage.getItem(cacheGamerKey)).toBe(after);
        expect(forgetLastGamer()).toBeNull();
      }
    );
  });

  describe('refreshVisitedPage', () => {
    const achievementsUrl = 'https://www.trueachievements.com/game/Gears-of-War-4/achievements';
    const page = (): string => document.documentElement.outerHTML;

    // Cached as a fetch got it, then the page visited
    const cachedThenVisited = async (key: string, fixture: string, url: string = key): Promise<void> => {
      await memoizedFetches.set(key, '<html>cached</html>', inAWeek());
      setHtml(`@ta-x-test-views/${fixture}`, { url });
    };

    test("should write the page shown over its cached copy, keeping the copy's expiry", async () => {
      useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-24T12:00:00Z') });
      await memoizedFetches.set(achievementsUrl, '<html>cached</html>', new Date('2026-11-24T13:00:00Z'));
      setHtml('@ta-x-test-views/game-achievements/won-with-dlc.html', { url: achievementsUrl });

      await refreshVisitedPage();

      expect(await memoizedFetches.get(achievementsUrl)).toBe(page());
      vi.setSystemTime(new Date('2026-11-24T13:00:01Z'));
      expect(await memoizedFetches.get(achievementsUrl)).toBeNull();
    });

    // The giveaway keeps only its entry, beside the address, not the page
    test("should read the giveaway page's entry afresh over its cached copy", async () => {
      const giveawayUrl = 'https://www.trueachievements.com/win-xbox-games';
      await memoizedFetches.set(`${giveawayUrl}#entry`, 'null', inAWeek());
      setHtml('@ta-x-test-views/giveaway/active.html', { url: giveawayUrl });

      await refreshVisitedPage();

      expect(JSON.parse(required(await memoizedFetches.get(`${giveawayUrl}#entry`)))).toMatchObject({
        argument: '2916'
      });
      expect(await memoizedFetches.get(giveawayUrl)).toBeNull();
    });

    // Highlight Wishlist Items keeps only the page's lists of ids, beside the address, not the page
    test("should read the wishlist page's on-sale lists afresh over their cached copy", async () => {
      const wishlistUrl = 'https://www.trueachievements.com/gamer/Dynamite+Andy/wishlist?sale=1';
      await memoizedFetches.set(`${wishlistUrl}#on-sale`, '{"items":[],"containing":[]}', inAWeek());
      setHtml('@ta-x-test-views/gamer-wishlist/on-sale.html', { url: wishlistUrl });

      await refreshVisitedPage();

      const lists = JSON.parse(required(await memoizedFetches.get(`${wishlistUrl}#on-sale`))) as Record<
        string,
        string[]
      >;
      expect(lists.items).toContain('9MZ8F6B0SL7M');
      expect(lists.containing).toContain('9N2Z26T7355C');
      expect(await memoizedFetches.get(wishlistUrl)).toBeNull();
    });

    test("should leave a page that isn't cached uncached", async () => {
      setHtml('@ta-x-test-views/game-achievements/won-with-dlc.html', { url: achievementsUrl });

      await refreshVisitedPage();

      expect(await memoizedFetches.get(achievementsUrl)).toBeNull();
    });

    // Its status posts back to the same address, so the copy would lose the achievements individual progress reads
    test.each(['won-with-dlc-won-status.html', 'won-with-dlc-not-won-status.html'])(
      'should leave the cached achievements page alone when set to a status (%s)',
      async (fixture) => {
        await cachedThenVisited(achievementsUrl, `game-achievements/${fixture}`);

        await refreshVisitedPage();

        expect(await memoizedFetches.get(achievementsUrl)).toBe('<html>cached</html>');
      }
    );

    // It shows what was clicked (a page selected), at the address the walkthrough preview caches
    test('should leave the cached manage walkthrough page alone', async () => {
      await cachedThenVisited(
        'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=3567',
        'staff-manage-walkthrough/page-selected.html'
      );

      await refreshVisitedPage();

      expect(
        await memoizedFetches.get(
          'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=3567'
        )
      ).toBe('<html>cached</html>');
    });

    // An error or maintenance page at a cached address would leave the features reading that copy with nothing
    test.each([404, 500, 503])('should leave the cached copy alone when the page answered %i', async (status) => {
      await cachedThenVisited(achievementsUrl, 'game-achievements/won-with-dlc.html');
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
        { responseStatus: status } as PerformanceNavigationTiming
      ]);

      await refreshVisitedPage();

      expect(await memoizedFetches.get(achievementsUrl)).toBe('<html>cached</html>');
    });

    // Safari reports no status, and some loads report 0
    test.each([[[]], [[{ responseStatus: 0 }]], [[{ responseStatus: 200 }]]])(
      'should write over the copy when the status is fine or not known (%j)',
      async (entries) => {
        await cachedThenVisited(achievementsUrl, 'game-achievements/won-with-dlc.html');
        vi.spyOn(performance, 'getEntriesByType').mockReturnValue(entries as PerformanceNavigationTiming[]);

        await refreshVisitedPage();

        expect(await memoizedFetches.get(achievementsUrl)).toBe(page());
      }
    );

    test('should read the page only once it has been parsed', async () => {
      await cachedThenVisited(achievementsUrl, 'game-achievements/won-with-dlc.html');
      const finishParsing = stillParsing();
      const replace = vi.spyOn(memoizedFetches, 'replace');

      const refreshing = refreshVisitedPage();
      await tick();
      expect(replace).not.toHaveBeenCalled();

      finishParsing();
      await refreshing;

      expect(await memoizedFetches.get(achievementsUrl)).toBe(page());
    });

    // A write can finish well after the parse (queued behind the daily sweep), by when features have changed the page
    test('should keep the page as it was parsed when the write finishes later', async () => {
      await cachedThenVisited(achievementsUrl, 'game-achievements/won-with-dlc.html');
      const parsed = page();
      const replace = memoizedFetches.replace.bind(memoizedFetches);
      let written: () => void = () => undefined;
      vi.spyOn(memoizedFetches, 'replace').mockImplementationOnce(async (key, body) => {
        await new Promise<void>((resolve) => {
          written = resolve;
        });
        return replace(key, body);
      });

      const refreshing = refreshVisitedPage();
      await tick();
      document.body.append(document.createElement('ta-x-changed'));
      written();
      await refreshing;

      expect(await memoizedFetches.get(achievementsUrl)).toBe(parsed);
    });

    // The same for what a feature keeps from the page: the wishlist's lists come from the page as parsed
    test('should read the on-sale lists from the page as it was parsed when the writes finish later', async () => {
      const wishlistUrl = 'https://www.trueachievements.com/gamer/Dynamite+Andy/wishlist?sale=1';
      await memoizedFetches.set(`${wishlistUrl}#on-sale`, '{"items":[],"containing":[]}', inAWeek());
      setHtml('@ta-x-test-views/gamer-wishlist/on-sale.html', { url: wishlistUrl });
      const replace = memoizedFetches.replace.bind(memoizedFetches);
      let written: () => void = () => undefined;
      vi.spyOn(memoizedFetches, 'replace').mockImplementationOnce(async (key, body) => {
        await new Promise<void>((resolve) => {
          written = resolve;
        });
        return replace(key, body);
      });

      const refreshing = refreshVisitedPage();
      await tick();
      document.querySelectorAll('.wl-item').forEach((item) => item.remove());
      written();
      await refreshing;

      const lists = JSON.parse(required(await memoizedFetches.get(`${wishlistUrl}#on-sale`))) as Record<
        string,
        string[]
      >;
      expect(lists.items).toContain('9MZ8F6B0SL7M');
    });

    test("should carry on when the cache can't be read or written", async () => {
      await cachedThenVisited(achievementsUrl, 'game-achievements/won-with-dlc.html');
      vi.spyOn(memoizedFetches, 'replace').mockRejectedValue(new Error('blocked'));

      await expect(refreshVisitedPage()).resolves.toBeUndefined();

      vi.spyOn(memoizedFetches, 'get').mockRejectedValue(new Error('blocked'));
      await expect(refreshVisitedPage()).resolves.toBeUndefined();
    });
  });
});

import * as taxFetch from '@ta-x-fetch';
import { logger } from '@ta-x-lib';
import { isAppliedLive, settings } from '@ta-x-storage';
import {
  changeSettingLive,
  emptyMemoizedFetches,
  find,
  readFixture,
  required,
  setHtml,
  setSettings,
  stillParsing,
  tick,
  useFakeTimers
} from '@ta-x-test';
import { toastMessage } from '@ta-x-ui';
import { render } from 'preact';

import type { MockInstance } from 'vitest';

import { settingsMenuOpen } from '../settings-menu';

import giveawayAutoOptIn from '.';

describe('giveaway-auto-opt-in', () => {
  const page = (file: string): string => readFixture(`@ta-x-test-views/giveaway/${file}`);
  // Runs it as the page loads, stopping it when the test ends; resolves once an entry it posts has been answered
  const run = async (): Promise<void> => {
    onTestFinished(giveawayAutoOptIn());
    await tick();
  };
  const giveawayUrl = 'https://www.trueachievements.com/win-xbox-games';
  // Where the giveaway's entry is kept, apart from the page
  const entryKey = `${giveawayUrl}#entry`;
  // Puts the real cache back, for the test of what's kept between page loads
  let realCache: () => void;
  // The cache's writes, while it's left empty
  let cacheSet: MockInstance<typeof taxFetch.memoizedFetches.set>;

  // The toast's message, rendered
  const toastText = (): HTMLElement => {
    const container = document.createElement('div');
    render(required(toastMessage.value).text, container);

    return container;
  };

  // The site, through fetchOk: the giveaway page's fetch answered with `fixture`, and an entry post with what `post` is
  // set to answer
  const site = (fixture: string) => {
    const post = vi.fn<typeof taxFetch.fetchOk>();
    const fetchOk = vi
      .spyOn(taxFetch, 'fetchOk')
      .mockImplementation(async (url, options) =>
        options?.method === 'POST' ? post(url, options) : new Response(page(fixture), { status: 200 })
      );

    return { fetchOk, post };
  };

  // The giveaway page shows a competition not yet entered; entering it answers with the page entered
  const activeGiveaway = () => {
    const answers = site('active.html');
    answers.post.mockResolvedValueOnce(new Response(page('entered.html'), { status: 200 }));

    return answers;
  };

  // What the entry posts back to /win-xbox-games
  const postedBody = (fetchSpy: MockInstance<typeof taxFetch.fetchOk>): [string, string][] => {
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith('/win-xbox-games', expect.objectContaining({ method: 'POST' }));
    return [...(required(fetchSpy.mock.calls[0][1]).body as URLSearchParams).entries()];
  };

  // The site's own Postback on the Enter link, posted back with the page's form fields
  const expectEntryPost = (fetchSpy: MockInstance<typeof taxFetch.fetchOk>): void => {
    expect(postedBody(fetchSpy)).toEqual([
      ['txtSearch', ''],
      ['txtSearchLookupID', ''],
      ['txtSearchOnSelect', 'Postback'],
      ['__VIEWSTATEGENERATOR', '09F0F734'],
      ['Command', 'btnEnterContest'],
      ['Argument', '2916']
    ]);
  };

  // Whether the giveaway was kept as having none to enter (an entered giveaway's page)
  const keptAsNone = (): boolean => cacheSet.mock.calls.some(([key, value]) => key === entryKey && value === 'null');

  beforeEach(() => {
    setHtml('@ta-x-test-views/empty.html');
    realCache = emptyMemoizedFetches();
    cacheSet = vi.spyOn(taxFetch.memoizedFetches, 'set');
    // A signed-in gamer
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=12345');
    setSettings({ 'allPages.giveawayAutoOptIn': true });
  });

  test.each([
    { name: 'when no gamer is signed in', cookie: '', enabled: true },
    { name: 'if not enabled', cookie: 'GamerID=12345', enabled: false }
  ])('should not look for a giveaway, or enter one, $name', async ({ cookie, enabled }) => {
    vi.spyOn(document, 'cookie', 'get').mockReturnValue(cookie);
    setSettings({ 'allPages.giveawayAutoOptIn': enabled });
    const { fetchOk } = site('active.html');

    await run();

    expect(fetchOk).not.toHaveBeenCalled();
  });

  test.each([
    { name: 'when there is no giveaway', fixture: 'none.html' },
    { name: 'when the giveaway is already entered', fixture: 'entered.html' }
  ])('should enter nothing $name', async ({ fixture }) => {
    const { fetchOk, post } = site(fixture);

    await run();

    expect(fetchOk).toHaveBeenCalledExactlyOnceWith(giveawayUrl, {});
    // No entry is posted, and none is kept
    expect(post).not.toHaveBeenCalled();
    expect(cacheSet).toHaveBeenCalledExactlyOnceWith(entryKey, 'null', expect.any(Date));
  });

  // Kept a short while, as an entered giveaway has no countdown to keep it by
  test('should enter a giveaway not yet entered, then keep it as having none to enter, each kept an hour', async () => {
    useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-28T12:00:00Z') });
    const { fetchOk, post } = activeGiveaway();

    await run();

    expect(fetchOk).toHaveBeenNthCalledWith(1, giveawayUrl, {});
    expectEntryPost(post);
    const inAnHour = new Date('2026-11-28T13:00:00Z');
    expect(cacheSet.mock.calls).toEqual([
      [entryKey, expect.stringContaining('"argument":"2916"'), inAnHour],
      [entryKey, 'null', inAnHour]
    ]);
  });

  // The page is large and only its entry is read, so later page loads read the kept entry, not the page
  test('should fetch and parse the giveaway page once while its entry is kept', async () => {
    realCache();
    const { fetchOk } = site('none.html');
    const parse = vi.spyOn(DOMParser.prototype, 'parseFromString');

    await run();
    await vi.waitFor(async () => expect(await taxFetch.memoizedFetches.get(entryKey)).toBe('null'));
    const get = vi.spyOn(taxFetch.memoizedFetches, 'get');
    await run();
    await vi.waitFor(() => expect(get).toHaveBeenCalledWith(entryKey));
    await tick();

    expect(fetchOk).toHaveBeenCalledOnce();
    expect(parse).toHaveBeenCalledOnce();
  });

  test('should show a toast linking to the giveaway game once entered', async () => {
    activeGiveaway();

    await run();

    expect(toastMessage.value).toMatchObject({ type: 'success', timeoutMs: 5000 });
    expect(toastText().textContent).toBe('Entered giveaway for Cannibal Cuisine.');
    expect(find('a', toastText()).getAttribute('href')).toBe('/game/Cannibal-Cuisine/achievements');
  });

  test("should not take an answer that isn't the giveaway entered as entered", async () => {
    // A real page with no enter link that isn't the giveaway entered either (the page with no giveaway running), as an
    // error page would be: no toast, and nothing kept from it as the giveaway page
    const { post } = site('active.html');
    post.mockResolvedValueOnce(new Response(page('none.html'), { status: 200 }));

    await run();

    expectEntryPost(post);
    expect(toastMessage.value).toBeNull();
    expect(keptAsNone()).toBe(false);
  });

  test("should not post a giveaway again on the next page load once the site has answered, though it isn't marked entered", async () => {
    const { post } = site('active.html');
    post.mockResolvedValueOnce(new Response(page('none.html'), { status: 200 }));
    await run();

    // The next page load, still reading the giveaway not entered, once the claim has lapsed: only what was tried stops it
    GM_deleteValue('giveawayAutoOptInClaimed');
    await run();

    expectEntryPost(post);
  });

  test('should not post a giveaway again on the next page load once the site has answered with an error', async () => {
    const { post } = site('active.html');
    vi.spyOn(logger, 'warn').mockImplementation(() => {});
    // fetchOk rejects with the site's answer when it isn't ok
    post.mockRejectedValueOnce(new Response('', { status: 500 }));
    await run();
    await tick();

    GM_deleteValue('giveawayAutoOptInClaimed');
    await run();
    await tick();

    expectEntryPost(post);
  });

  test('should post a giveaway again on the next page load when the post never reached the site', async () => {
    const { post } = site('active.html');
    vi.spyOn(logger, 'warn').mockImplementation(() => {});
    post
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(new Response(page('entered.html'), { status: 200 }));
    await run();
    await tick();

    await run();
    await tick();

    expect(post).toHaveBeenCalledTimes(2);
  });

  test('should post once when two tabs load together, the one that posted showing the toast', async () => {
    const { post } = site('active.html');
    post.mockImplementation(async () => new Response(page('entered.html'), { status: 200 }));
    const toasts = vi.fn();
    onTestFinished(toastMessage.subscribe((message) => message && toasts(message)));

    // Both read the giveaway not entered before either post is answered
    await Promise.all([run(), run()]);
    await tick();

    expectEntryPost(post);
    expect(toasts).toHaveBeenCalledOnce();
  });

  test.each([
    { name: 'leave a giveaway another tab claimed just now', claimedAgo: 0, posts: 0 },
    {
      name: 'post a giveaway whose claim has lapsed (that tab closed before it was answered)',
      claimedAgo: 61_000,
      posts: 1
    }
  ])('should $name', async ({ claimedAgo, posts }) => {
    GM_setValue('giveawayAutoOptInClaimed', JSON.stringify({ argument: '2916', at: Date.now() - claimedAgo }));
    const { post } = activeGiveaway();

    await run();

    expect(post).toHaveBeenCalledTimes(posts);
  });

  // The script starts at document-start, so on the giveaway page itself the giveaway isn't parsed yet
  test('should wait for the win-xbox-games page to be parsed before reading its giveaway', async () => {
    setHtml('@ta-x-test-views/empty.html', { url: '/win-xbox-games' });
    const parsed = stillParsing();
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');
    fetchSpy.mockResolvedValueOnce(new Response(page('entered.html'), { status: 200 }));

    await run();
    expect(fetchSpy).not.toHaveBeenCalled();
    document.body.innerHTML = page('active.html');
    parsed();

    await vi.waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    // The entry post alone: the page isn't fetched
    expectEntryPost(fetchSpy);
  });

  // The site's entered block has no enter link, so the link is put back (a synthetic case, not the site's markup) to
  // see the `entered` class alone stop a second entry
  test('should not enter a giveaway marked entered, even with an enter link', async () => {
    setHtml('@ta-x-test-views/giveaway/active.html', { url: '/win-xbox-games' });
    find('.competition .game').classList.add('entered');
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');

    await run();

    find('.competition .game .entry a');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test('should only warn when the entry post fails (the site erred or the network did)', async () => {
    const { post } = site('active.html');
    // fetchOk rejects with the site's answer when it isn't ok
    post.mockRejectedValueOnce(new Response('', { status: 500 }));
    const error = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});

    await run();
    await tick();

    expectEntryPost(post);
    expect(toastMessage.value).toBeNull();
    expect(keptAsNone()).toBe(false);
    // Logged as a warning, and nothing reaches the live setting's own failure log
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      'giveaway-auto-opt-in',
      "the giveaway entry wasn't posted",
      expect.any(Response)
    );
    expect(error).not.toHaveBeenCalled();
  });

  test("should post the form's fields back with the entry, with what's typed in its search, Command and Argument last", async () => {
    setHtml('@ta-x-test-views/giveaway/active.html', {
      url: '/win-xbox-games'
    });
    find<HTMLInputElement>('#txtSearch').value = 'halo';
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');
    fetchSpy.mockResolvedValueOnce(new Response(page('entered.html'), { status: 200 }));

    await run();

    expect(postedBody(fetchSpy)).toEqual([
      ['txtSearch', 'halo'],
      ['txtSearchLookupID', ''],
      ['txtSearchOnSelect', 'Postback'],
      ['__VIEWSTATEGENERATOR', '09F0F734'],
      ['Command', 'btnEnterContest'],
      ['Argument', '2916']
    ]);
  });

  describe('turned on in the menu (applied live)', () => {
    // The menu open, as in the tab the change was made in (the page reset shuts it before every test)
    const openSettingsMenu = (): void => {
      settingsMenuOpen.value = true;
    };

    beforeEach(() => {
      setSettings({ 'allPages.giveawayAutoOptIn': false });
    });

    // Registered, the settings menu's reload notice leaves the setting out (reload-notice.ts)
    test('should be registered as applied live while running, and not once stopped', () => {
      const stop = giveawayAutoOptIn();

      expect(isAppliedLive(settings.allPages.giveawayAutoOptIn)).toBe(true);
      stop();
      expect(isAppliedLive(settings.allPages.giveawayAutoOptIn)).toBe(false);
    });

    test('should enter the giveaway in the tab whose menu it was turned on in', async () => {
      const { post } = activeGiveaway();
      await run();
      openSettingsMenu();

      await changeSettingLive(settings.allPages.giveawayAutoOptIn, true);

      expectEntryPost(post);
    });

    test("should enter nothing in another tab, whose menu isn't open (that tab enters on its next page load)", async () => {
      const { fetchOk } = activeGiveaway();
      await run();

      // The change arrives from another tab's menu
      await changeSettingLive(settings.allPages.giveawayAutoOptIn, true);

      expect(fetchOk).not.toHaveBeenCalled();
    });

    // The page's own markup still shows the giveaway not entered once entered (as on /win-xbox-games itself)
    test('should post one entry a page, turned on twice while the first post is under way, then off and on again', async () => {
      setHtml('@ta-x-test-views/giveaway/active.html', { url: '/win-xbox-games' });
      // The post held open until the test answers it
      const post = Promise.withResolvers<Response>();
      const fetchOk = vi.spyOn(taxFetch, 'fetchOk').mockReturnValue(post.promise);
      await run();
      openSettingsMenu();

      await changeSettingLive(settings.allPages.giveawayAutoOptIn, true);
      await changeSettingLive(settings.allPages.giveawayAutoOptIn, false);
      await changeSettingLive(settings.allPages.giveawayAutoOptIn, true);
      post.resolve(new Response(page('entered.html'), { status: 200 }));
      await tick();
      await changeSettingLive(settings.allPages.giveawayAutoOptIn, false);
      await changeSettingLive(settings.allPages.giveawayAutoOptIn, true);

      expectEntryPost(fetchOk);
    });

    test('should undo nothing when turned off (the entry is on the site)', async () => {
      const { post } = activeGiveaway();
      await run();
      openSettingsMenu();
      await changeSettingLive(settings.allPages.giveawayAutoOptIn, true);

      await changeSettingLive(settings.allPages.giveawayAutoOptIn, false);

      expectEntryPost(post);
    });
  });
});

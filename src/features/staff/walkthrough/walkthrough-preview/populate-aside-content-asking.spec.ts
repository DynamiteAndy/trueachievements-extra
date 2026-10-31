import * as taxFetch from '@ta-x-fetch';
import { logger } from '@ta-x-lib';
import { emptyPage, fetchPagesByUrl, find, readFixture } from '@ta-x-test';

import {
  achievementsSection,
  askSection,
  askSaysNotFound,
  askShown,
  fetchPages,
  loadPagePreview,
  loadWalkthroughPreview,
  managePage,
  pageIds,
  pagesSection,
  populate,
  rememberBlud,
  thanksSection,
  typeWalkthroughId,
  walkthroughsOf
} from './populate-aside-content.spec-helpers';

// A page preview whose walkthrough it doesn't know, or can't load: it asks for the walkthrough's id
describe('staff/walkthrough/walkthrough-preview/populate-aside-content asking for the walkthrough', () => {
  beforeEach(loadPagePreview);

  // A page preview whose walkthrough id hasn't been remembered yet
  const openUnknownPagePreview = async (): Promise<void> => {
    fetchPages();

    await populate();
    await vi.waitFor(() => expect(askShown()).toBe(true));
  };

  // A fetch the site answers with an error throws it (fetchOk, fetch/fetch-ok.ts)
  const failManagePage = () =>
    vi.spyOn(taxFetch, 'memoizeFetch').mockImplementation(async (url: string) => {
      if (url.includes('managewalkthrough.aspx')) {
        throw new Response('', { status: 500 });
      }

      return emptyPage;
    });

  test('should add the ask loader section to the aside, asking for the walkthrough id', async () => {
    await openUnknownPagePreview();

    // The section's own markup and wording are WalkthroughInformation.spec's
    expect([...find('aside').children]).toEqual([askSection()]);
  });

  test('should load the walkthrough from the id typed in and remember its pages', async () => {
    await openUnknownPagePreview();

    typeWalkthroughId('4138');
    await vi.waitFor(() => expect(achievementsSection()).not.toBeNull());

    expect([...find('aside').children]).toEqual([pagesSection(), thanksSection(), achievementsSection()]);
    // All of its pages, the two the earlier preview hadn't seen too
    expect(await walkthroughsOf([...pageIds, '26672', '26673'])).toEqual(Array(13).fill('4138'));
  });

  test('should load the walkthrough from an id typed in with spaces around it, remembering it without them', async () => {
    await openUnknownPagePreview();

    typeWalkthroughId(' 4138 ');
    await vi.waitFor(() => expect(achievementsSection()).not.toBeNull());

    expect(await walkthroughsOf(pageIds)).toEqual(Array(pageIds.length).fill('4138'));
  });

  test.each(['abc', '41 38', '4138.5', '-4138'])(
    "should ask again, saying it wasn't found, for '%s', which isn't a whole number, fetching nothing",
    async (typed) => {
      await openUnknownPagePreview();
      const memoizeFetch = vi.spyOn(taxFetch, 'memoizeFetch');

      typeWalkthroughId(typed);

      await vi.waitFor(() => expect([askSaysNotFound(), askShown()]).toEqual([true, true]));
      expect(memoizeFetch).not.toHaveBeenCalled();
    }
  );

  test("should not remember a page whose link can't be read", async () => {
    await openUnknownPagePreview();
    // The site's link for its last page stripped, so it has no id
    const manage = readFixture('@ta-x-test-views/staff-manage-walkthrough/in-progress.html').replaceAll(
      "javascript:Postback('lstWalkthroughPagesE','26673')",
      '#'
    );
    fetchPages({ [managePage]: manage });

    typeWalkthroughId('4138');
    await vi.waitFor(() => expect(achievementsSection()).not.toBeNull());

    expect(await walkthroughsOf(['', '26673', '26672'])).toEqual([null, null, '4138']);
  });

  // Once a walkthrough has loaded the ask is gone (WalkthroughPreviewAside shows its sections in its place), so a
  // failed lookup can only follow the ask: this one fails first, then the same id loads once the site answers
  test("should ask again, saying why, when the walkthrough typed in doesn't load, and still load one after", async () => {
    await openUnknownPagePreview();
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const memoizeFetch = failManagePage();

    typeWalkthroughId('4138');

    await vi.waitFor(() =>
      expect(memoizeFetch).toHaveBeenCalledWith(
        `https://www.trueachievements.com/staff/walkthrough/${managePage}`,
        {},
        { deleteAfter: { value: 4, period: 'hours' } }
      )
    );
    await vi.waitFor(() => expect(askSaysNotFound()).toBe(true));
    expect(askShown()).toBe(true);
    expect([...find('aside').children]).toEqual([askSection()]);
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      'walkthrough-preview',
      "walkthrough 4138 couldn't be read",
      expect.any(Response)
    );

    fetchPages();
    typeWalkthroughId('4138');
    await vi.waitFor(() => expect(achievementsSection()).not.toBeNull());

    expect([...find('aside').children]).toEqual([pagesSection(), thanksSection(), achievementsSection()]);
  });

  // The page on screen is the walkthrough preview of the id in its address only: another id's game and thread are
  // read from that walkthrough's own preview
  test("should read a walkthrough typed in on another walkthrough's preview from its own preview", async () => {
    loadWalkthroughPreview();
    vi.spyOn(logger, 'warn').mockImplementation(() => {});
    failManagePage();
    await populate();
    await vi.waitFor(() => expect(askShown()).toBe(true));

    const otherPreview = readFixture('@ta-x-test-views/staff-walkthrough-preview/in-progress.html')
      .replaceAll('/game/BLUD', '/game/Asdivine-Dios')
      .replaceAll('tid=1572263', 'tid=1234567');
    const memoizeFetch = fetchPagesByUrl({
      'managewalkthrough.aspx?walkthroughid=3567': readFixture(
        '@ta-x-test-views/staff-manage-walkthrough/in-progress.html'
      ),
      'walkthroughpreview.aspx?walkthroughid=3567': otherPreview,
      '/game/Asdivine-Dios/achievements': readFixture('@ta-x-test-views/game-achievements/asdivine-dios.html')
    });
    typeWalkthroughId('3567');
    await vi.waitFor(() => expect(achievementsSection()).not.toBeNull());

    expect(find('.thread a', thanksSection()).getAttribute('href')).toBe(
      'https://www.trueachievements.com/forum/viewthread.aspx?tid=1234567'
    );
    expect(memoizeFetch.mock.calls.map(([url]) => url).filter((url) => url.includes('/game/'))).toEqual([
      'https://www.trueachievements.com/game/Asdivine-Dios/achievements'
    ]);
  });

  test("should ask when the remembered walkthrough doesn't load", async () => {
    await rememberBlud();
    failManagePage();

    await populate();

    await vi.waitFor(() => expect(askShown()).toBe(true));
  });
});

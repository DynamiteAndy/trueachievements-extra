import * as taxFetch from '@ta-x-fetch';
import { logger } from '@ta-x-lib';
import { settings } from '@ta-x-storage';
import {
  changeSettingLive,
  click,
  expectAppliesLive,
  fetchDocumentsThroughMemoizeFetch,
  find,
  neverFinds,
  readFixture,
  required,
  setHtml,
  setSettings,
  submitAsk,
  tick,
  withoutUniqueIds
} from '@ta-x-test';
import { hideClass, AskLoaderStyles, EditableHeaderStyles } from '@ta-x-ui';

import { ownerProgressUrls } from './owner-progress-urls';
import styles from './styles';

import showOwnerProgress from '.';

describe('forum/view-thread/show-owner-progress', () => {
  const section = (): HTMLElement | null => document.querySelector(`.${styles.showOwnerProgress}`);
  // The ask loader in the section's body, which holds the loader, the ask panel and the walkthrough
  const askLoader = (): HTMLElement => find(`:scope > article > .${AskLoaderStyles.askLoaderContainer}`, section());
  // Loaded, with its panel showing
  const askShown = (): boolean =>
    askLoader().getAttribute('data-ta-x-loaded') === 'true' &&
    !find(`.${AskLoaderStyles.askLoaderAsk}`, section()).classList.contains(hideClass);
  const editorRows = (): HTMLElement[] => [
    ...required(section()).querySelectorAll<HTMLElement>(`.${styles.showOwnerProgressEditorRow}`)
  ];

  const typeLink = (url: string): void => void submitAsk(section(), url);

  // A walkthrough forum thread, at its own address
  const openThread = (fixture: string, threadId: string): void => {
    setHtml(`@ta-x-test-views/${fixture}`, {
      url: `https://www.trueachievements.com/forum/viewthread.aspx?tid=${threadId}`
    });
  };

  // Runs the feature, stopping it (unmounting the section) when the test ends: left mounted, its thread lookup (an
  // effect) can run during a later test, find the walkthrough that test remembered and fetch it past that test's stubs
  const run = async (): Promise<void> => {
    onTestFinished(showOwnerProgress());
    await tick();
  };

  beforeEach(() => {
    fetchDocumentsThroughMemoizeFetch();
    setSettings({ 'forum.viewThread.showOwnerProgress': true });
  });

  describe('where it adds nothing', () => {
    beforeEach(() => {
      openThread('forum-thread/crash-bandicoot-walkthrough-not-published.html', '1028321');
    });

    test.each([
      {
        name: 'while it is off',
        setUp: () => setSettings({ 'forum.viewThread.showOwnerProgress': false })
      },
      {
        name: "when the forum's heading never shows",
        setUp: () => neverFinds('#oMessageThread .pagetitle')
      },
      {
        name: "in a forum that isn't the walkthrough forum",
        setUp: () => {
          find('#oMessageThread .pagetitle').textContent = 'Gaming Discussion';
        }
      }
    ])('should add nothing $name', async ({ setUp }) => {
      setUp();

      await run();

      expect(section()).toBeNull();
    });
  });

  describe('a thread whose first posts link no walkthrough', () => {
    // Only the walkthrough's announcement says which walkthrough it is: a reply linking the game (its achievements, in
    // this old thread) isn't followed to a walkthrough
    test('should ask for the link, following no game link in a reply', async () => {
      const memoizeFetch = vi.spyOn(taxFetch, 'memoizeFetch').mockResolvedValue('');
      openThread('forum-thread/track-and-field-walkthrough-not-published.html', '65446');

      await run();

      await vi.waitFor(() => expect(askShown()).toBe(true));
      expect(memoizeFetch).not.toHaveBeenCalled();
    });

    test.each([
      '',
      'invalid-url',
      // The checks read the path alone, so another site's link is refused before anything is fetched
      'https://www.example.com/game/Crash-Bandicoot/walkthrough',
      'https://www.example.com/crash-bandicoot-walkthrough.htm'
    ])('should keep asking, fetching nothing, when "%s" is typed in', async (typed) => {
      const memoizeFetch = vi.spyOn(taxFetch, 'memoizeFetch').mockResolvedValue('');
      openThread('forum-thread/crash-bandicoot-walkthrough-not-published.html', '1028321');
      await run();
      // Typed once the thread's own lookup has found nothing (the panel is there, hidden, while that lookup runs)
      await vi.waitFor(() => expect(askShown()).toBe(true));
      const head = vi.spyOn(taxFetch, 'fetchOk');

      typeLink(typed);
      await tick();

      expect(askShown()).toBe(true);
      expect(memoizeFetch).not.toHaveBeenCalled();
      expect(head).not.toHaveBeenCalled();
    });
  });

  // The first post's game link as other pages of the game, or a page of its walkthrough (the real thread links the
  // game's hub): a walkthrough link as it is, any other link into the game to its walkthrough
  test.each([
    ['https://www.trueachievements.com/game/Digimon-Survive/achievements', '/game/Digimon-Survive/walkthrough'],
    ['https://www.trueachievements.com/game/Digimon-Survive/walkthrough/2', '/game/Digimon-Survive/walkthrough/2']
  ])('should look up the walkthrough of a post linking %s', async (link, expected) => {
    openThread('forum-thread/digimon-survive-walkthrough.html', '1416296');
    find<HTMLAnchorElement>('a[href="https://www.trueachievements.com/game/Digimon-Survive"]').href = link;
    const memoizeFetch = vi
      .spyOn(taxFetch, 'memoizeFetch')
      .mockResolvedValue(readFixture('@ta-x-test-views/game-walkthrough/digimon-survive.html'));

    await run();

    await vi.waitFor(() => expect(memoizeFetch).toHaveBeenCalledOnce());
    expect(memoizeFetch).toHaveBeenCalledExactlyOnceWith(`https://www.trueachievements.com${expected}`);
  });

  test("should pass over a post's link to another site's game page, for the next post's walkthrough link", async () => {
    openThread('forum-thread/digimon-survive-walkthrough.html', '1416296');
    // Its path is a game's here too, but it's another site's, so it mustn't become that site's /walkthrough address
    find<HTMLAnchorElement>('a[href="https://www.trueachievements.com/game/Digimon-Survive"]').href =
      'https://www.xboxachievements.com/game/Digimon-Survive/achievements';
    const memoizeFetch = vi
      .spyOn(taxFetch, 'memoizeFetch')
      .mockResolvedValue(readFixture('@ta-x-test-views/game-walkthrough/digimon-survive.html'));

    await run();

    await vi.waitFor(() => expect(memoizeFetch).toHaveBeenCalledOnce());
    expect(memoizeFetch).toHaveBeenCalledExactlyOnceWith(
      'https://www.trueachievements.com/game/Digimon-Survive/walkthrough'
    );
  });

  test('should show the walkthrough a post in the thread links to', async () => {
    openThread('forum-thread/digimon-survive-walkthrough.html', '1416296');
    const memoizeFetch = vi
      .spyOn(taxFetch, 'memoizeFetch')
      .mockResolvedValue(readFixture('@ta-x-test-views/game-walkthrough/digimon-survive.html'));

    await run();

    // The section looks its walkthrough up once it's on the page
    await vi.waitFor(() => expect(find('.thanks', section()).textContent.trim()).toBe('57'));
    expect(memoizeFetch).toHaveBeenCalledExactlyOnceWith(
      'https://www.trueachievements.com/game/Digimon-Survive/walkthrough'
    );
  });

  test("should pass over a post's old walkthrough link it can't follow (its HEAD request fails), for the next post's link", async () => {
    openThread('forum-thread/digimon-survive-walkthrough.html', '1416296');
    const oldLink = 'https://www.trueachievements.com/digimon-survive-walkthrough.htm';
    find<HTMLAnchorElement>('a[href="https://www.trueachievements.com/game/Digimon-Survive"]').href = oldLink;
    // fetchOk rejects with the site's answer when it isn't ok (or with the network's error)
    const head = vi.spyOn(taxFetch, 'fetchOk').mockRejectedValue(new Response('', { status: 500 }));
    const memoizeFetch = vi
      .spyOn(taxFetch, 'memoizeFetch')
      .mockResolvedValue(readFixture('@ta-x-test-views/game-walkthrough/digimon-survive.html'));

    await run();

    await vi.waitFor(() => expect(find('.thanks', section()).textContent.trim()).toBe('57'));
    expect(head).toHaveBeenCalledExactlyOnceWith(oldLink, { method: 'HEAD' });
    expect(memoizeFetch).toHaveBeenCalledExactlyOnceWith(
      'https://www.trueachievements.com/game/Digimon-Survive/walkthrough'
    );
  });

  describe("a thread whose walkthrough link is in the site's old format", () => {
    const walkthroughUrl = 'https://www.trueachievements.com/game/Mirrors-Edge/walkthrough';
    const oldWalkthroughUrl = 'https://www.trueachievements.com/mirrors-edge-walkthrough.htm';
    // The site answers a walkthrough address that doesn't exist with a 404, which fetch throws
    const mistypedUrl = 'https://www.trueachievements.com/game/Mirrors-Egde/walkthrough';
    // Another published walkthrough to change to: stood in by the same captured page, under its own address
    const otherPublishedUrl = 'https://www.trueachievements.com/game/Mirrors-Edge-Catalyst/walkthrough';

    // The old link redirects to the walkthrough's current address; the mistyped one isn't found
    const fetchPages = () => {
      vi.spyOn(taxFetch, 'fetchOk').mockImplementation(
        async (url: string) => ({ url: url === oldWalkthroughUrl ? walkthroughUrl : url }) as Response
      );
      return vi.spyOn(taxFetch, 'memoizeFetch').mockImplementation(async (url: string) => {
        if (url === mistypedUrl) {
          throw new Response('', { status: 404 });
        }

        return url === walkthroughUrl || url === otherPublishedUrl
          ? readFixture('@ta-x-test-views/game-walkthrough/mirrors-edge.html')
          : '';
      });
    };

    const openMirrorsEdgeThread = async (): Promise<void> => {
      await run();
      await vi.waitFor(() => expect(askLoader().getAttribute('data-ta-x-loaded')).toBe('true'));
    };

    // The thread without its published post, the one that links the walkthrough, so it asks
    const openAsking = async (): Promise<ReturnType<typeof fetchPages>> => {
      const memoizeFetch = fetchPages();
      find('#m5890130').remove();
      await openMirrorsEdgeThread();

      return memoizeFetch;
    };

    beforeEach(() => {
      openThread('forum-thread/mirrors-edge-walkthrough.html', '387144');
    });

    test("should add the section above the aside's first full section, asking for the link", async () => {
      await openAsking();

      const aside = find('aside');
      expect([...aside.children].map((child) => child.tagName + '.' + child.className)).toEqual([
        'DIV.ad-wrap',
        `SECTION.purple ${styles.showOwnerProgress}`,
        'SECTION.red',
        'SECTION.smallpanel panelnavy top-article nb',
        'SECTION.smallpanel panelnavy',
        'DIV.ad-wrap'
      ]);
      // The loader goes once it asks
      expect(required(section()).querySelector('.ta-x-article-loader')).toBeNull();
      expect(askShown()).toBe(true);
    });

    test("should follow the published post's old link to the walkthrough and show its gamers and thanks", async () => {
      fetchPages();

      await openMirrorsEdgeThread();

      expect(find(`.${AskLoaderStyles.askLoaderAsk}`, section())).toHaveExactClasses([
        AskLoaderStyles.askLoaderAsk,
        hideClass
      ]);
      const rows = editorRows();
      expect(rows.map((row) => find(`.${styles.showOwnerProgressEditor}`, row).textContent.trim())).toEqual([
        'nanoc1111 (Owner)',
        'Dayman41 (Editor)',
        'LifeExpectancy (Overseer)',
        'GameBoyColorGuy (Contributor)',
        'Team Brether (Contributor)'
      ]);
      // Each picture stays linked to its gamer
      expect(rows.map((row) => required(row.firstElementChild).getAttribute('href'))).toEqual([
        '/gamer/nanoc1111',
        '/gamer/Dayman41',
        '/gamer/LifeExpectancy',
        '/gamer/GameBoyColorGuy',
        '/gamer/Team+Brether'
      ]);
      expect(find('.thanks span', section()).textContent).toBe('135');
      expect(await ownerProgressUrls.get('387144')).toBe(walkthroughUrl);
    });

    test('should accept an old walkthrough link typed into the ask panel', async () => {
      await openAsking();

      typeLink(oldWalkthroughUrl);

      await vi.waitFor(() => expect(editorRows()).toHaveLength(5));
      expect(await ownerProgressUrls.get('387144')).toBe(walkthroughUrl);
    });

    test("should accept a walkthrough's path typed into the ask panel, read against the page", async () => {
      const memoizeFetch = await openAsking();

      typeLink('/game/Mirrors-Edge/walkthrough');

      await vi.waitFor(() => expect(editorRows()).toHaveLength(5));
      expect(memoizeFetch).toHaveBeenCalledWith(walkthroughUrl);
      expect(await ownerProgressUrls.get('387144')).toBe(walkthroughUrl);
    });

    test("should ask again when a link typed into the ask panel doesn't load", async () => {
      const memoizeFetch = await openAsking();

      typeLink(mistypedUrl);

      await vi.waitFor(() => expect(memoizeFetch).toHaveBeenCalledExactlyOnceWith(mistypedUrl));
      await vi.waitFor(() => expect(askShown()).toBe(true));
      expect(await ownerProgressUrls.get('387144')).toBeNull();
    });

    test("should ask when a typed link's page has no gamers involved, fetching only that page", async () => {
      // An unpublished walkthrough: its page shows no progress circle, so nothing else is fetched
      const otherWalkthroughUrl = 'https://www.trueachievements.com/game/Jumper/walkthrough';
      const memoizeFetch = await openAsking();

      typeLink(otherWalkthroughUrl);

      await vi.waitFor(() => expect(memoizeFetch).toHaveBeenCalledWith(otherWalkthroughUrl));
      await vi.waitFor(() => expect(askShown()).toBe(true));
      expect(memoizeFetch.mock.calls.map(([url]) => url)).toEqual([otherWalkthroughUrl]);
      expect(await ownerProgressUrls.get('387144')).toBeNull();
    });

    // An older version remembered a thread's link on any site; its page's links would be shown as they are
    test('should fetch nothing for a link remembered on another site, and ask', async () => {
      const memoizeFetch = fetchPages();
      await ownerProgressUrls.set('387144', 'https://other.example/game/x/walkthrough');
      find('#m5890130').remove();

      await openMirrorsEdgeThread();

      expect(askShown()).toBe(true);
      expect(memoizeFetch).not.toHaveBeenCalled();
    });

    test('should ask, saying why, when the link the thread had no longer loads, and remember the one typed in instead', async () => {
      fetchPages();
      const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
      await ownerProgressUrls.set('387144', mistypedUrl);
      await openMirrorsEdgeThread();

      expect(askShown()).toBe(true);
      expect(warn).toHaveBeenCalledExactlyOnceWith(
        'show-owner-progress',
        "the thread's walkthrough couldn't be read",
        expect.any(Response)
      );

      typeLink(walkthroughUrl);

      await vi.waitFor(() => expect(editorRows()).toHaveLength(5));
      expect(await ownerProgressUrls.get('387144')).toBe(walkthroughUrl);
    });
    describe('changing the linked walkthrough', () => {
      const linkLine = (): HTMLElement => find(`.${styles.showOwnerProgressLink}`, section());
      const pencil = (): HTMLElement => find(`.${EditableHeaderStyles.editableHeader} a`, linkLine());
      const cancel = (): HTMLElement => find('input[value="Cancel"]', section());
      const typed = (): string => find<HTMLInputElement>('input[type="text"]', section()).value;
      const openLoaded = async (): Promise<void> => {
        fetchPages();
        await openMirrorsEdgeThread();
        await vi.waitFor(() => expect(editorRows()).toHaveLength(5));
      };

      test('should show the linked walkthrough under its gamers, with a pencil to change it', async () => {
        await openLoaded();

        expect(find(`.${EditableHeaderStyles.editableHeader} > span`, linkLine()).textContent).toBe(
          'Linked walkthrough'
        );
        expect(pencil().getAttribute('title')).toBe('Change the walkthrough');
        expect(find(':scope > a', linkLine()).getAttribute('href')).toBe(walkthroughUrl);
        expect(find(':scope > a', linkLine()).textContent).toBe('/game/Mirrors-Edge/walkthrough');
      });

      test('should ask for another link from the pencil, with Cancel and no text, and Cancel shows it as it was', async () => {
        await openLoaded();
        const before = required(section()).outerHTML;

        click(pencil());

        expect(askShown()).toBe(true);
        expect(find(`.${AskLoaderStyles.askLoaderAsk}`, section()).querySelector(':scope > p')).toBeNull();
        expect(section()?.querySelector(`.${styles.showOwnerProgressLink}`)).toBeNull();

        click(cancel());

        expect(required(section()).outerHTML).toBe(before);
      });

      test('should show and remember the new walkthrough once its link is saved, the pencil then asking afresh', async () => {
        await openLoaded();
        click(pencil());

        typeLink(otherPublishedUrl);

        await vi.waitFor(() => expect(find(':scope > a', linkLine()).getAttribute('href')).toBe(otherPublishedUrl));
        expect(editorRows()).toHaveLength(5);
        expect(await ownerProgressUrls.get('387144')).toBe(otherPublishedUrl);

        click(pencil());
        expect(typed()).toBe('');
      });

      // A link that doesn't load (its save throws) and one that loads with no gamers (unpublished: nothing to show)
      test("should keep asking, still with Cancel back to the walkthrough shown, when a changed link doesn't lead to one", async () => {
        await openLoaded();
        click(pencil());

        typeLink(mistypedUrl);
        await vi.waitFor(() => expect(askShown()).toBe(true));
        typeLink('https://www.trueachievements.com/game/Jumper/walkthrough');
        await vi.waitFor(() => expect(askShown()).toBe(true));
        await tick();
        // Kept, to fix
        expect(typed()).toBe('https://www.trueachievements.com/game/Jumper/walkthrough');

        click(cancel());
        click(pencil());
        expect(typed()).toBe('');
        click(cancel());
        expect(find(':scope > a', linkLine()).getAttribute('href')).toBe(walkthroughUrl);
        expect(await ownerProgressUrls.get('387144')).toBe(walkthroughUrl);
      });
    });
  });

  describe('applied live', () => {
    beforeEach(() => {
      openThread('forum-thread/digimon-survive-walkthrough.html', '1416296');
      vi.spyOn(taxFetch, 'memoizeFetch').mockResolvedValue(
        readFixture('@ta-x-test-views/game-walkthrough/digimon-survive.html')
      );
    });

    test('should apply live: on, off and on again from the menu, off giving the page back exactly', async () => {
      setSettings({ 'forum.viewThread.showOwnerProgress': false });
      await run();

      // On again is a new ask form, with a field id of its own
      await expectAppliesLive(settings.forum.viewThread.showOwnerProgress, () =>
        withoutUniqueIds(document.body.innerHTML)
      );
    });

    test('should take out a section that has found its walkthrough, and show it again on again', async () => {
      await run();
      await vi.waitFor(() => expect(editorRows()).not.toHaveLength(0));

      await changeSettingLive(settings.forum.viewThread.showOwnerProgress, false);
      expect(section()).toBeNull();

      await changeSettingLive(settings.forum.viewThread.showOwnerProgress, true);
      await vi.waitFor(() => expect(find('.thanks', section()).textContent.trim()).toBe('57'));
    });
  });

  // Mad Riders' single-page walkthrough shows its gamers' pictures without linking them
  test('should show the gamers involved when their pictures are not linked', async () => {
    const madRidersUrl = 'https://www.trueachievements.com/game/Mad-Riders/walkthrough';
    openThread('forum-thread/mirrors-edge-walkthrough.html', '162276');
    await ownerProgressUrls.set('162276', madRidersUrl);
    vi.spyOn(taxFetch, 'memoizeFetch').mockImplementation(async (url: string) =>
      url === madRidersUrl ? readFixture('@ta-x-test-views/game-walkthrough/mad-riders-single-page.html') : ''
    );

    await run();

    await vi.waitFor(() => expect(editorRows()).toHaveLength(3));
    const rows = editorRows();
    expect(
      rows.map((row) => [required(row.firstElementChild).tagName, required(row.firstElementChild).getAttribute('alt')])
    ).toEqual([
      ['IMG', 'litepink'],
      ['IMG', 'Kung Fu Riki'],
      ['IMG', 'Tasty Pastry']
    ]);
    expect(find(`.${styles.showOwnerProgressEditor}`, rows[0]).innerHTML).toBe(
      '<a href="/gamer/litepink" rel="nofollow">litepink</a> (Owner)'
    );
    expect(find('.thanks span', section()).textContent).toBe('4');
  });
});

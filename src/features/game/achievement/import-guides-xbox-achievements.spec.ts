import { logger } from '@ta-x-lib';
import { AchievementsRegex } from '@ta-x-site';
import {
  click,
  find,
  openTab,
  readFixtureDocument,
  required,
  setHtml,
  setSettings,
  tick,
  useFakeTimers
} from '@ta-x-test';
import { AskLoaderStyles } from '@ta-x-ui';

import {
  importGuides,
  getReseroGuides,
  handOverImportedGuides,
  importedGuides,
  getGuideLinks,
  setGuideLinks
} from '../extra-guides';
import { guideLinkSelectors, guideSitePanel } from '../extra-guides/guide-site-panel.spec-helpers';
import ImportGuidesStyles from '../extra-guides/styles';

describe('game/achievement import guides: XboxAchievements', () => {
  const guideUrl = 'https://www.xboxachievements.com/game/g-force/guide/';
  const setting = 'gameAchievementsXboxAchievementsGuideUrl';

  // The guides our script reads on G-Force's guide page on XboxAchievements
  const guidePageGuides = () =>
    getReseroGuides(readFixtureDocument('@ta-x-test-views/xbox-achievements-guide/g-force.html'), guideUrl);
  // What the guide page leaves for TrueAchievements: its guides, handed over through Tampermonkey storage
  const visitGuidePage = (): void => handOverImportedGuides(guideUrl, guidePageGuides());
  const combatVeteran = () => guidePageGuides().find(({ title }) => title === 'Combat Veteran');

  const { panel, rows, field, button, submit, solutions } = guideSitePanel('xbox-achievements');

  // Combat Veteran's page on TrueAchievements, for G-Force
  const openAchievement = async (links: string[] = []): Promise<void> => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    setGuideLinks(setting, 'GForce', links);
    setSettings({ 'game.extraGuides.showXboxAchievementGuides': true });
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValue(true);

    onTestFinished(await importGuides());
  };

  test("should ask for the game's guide page when it has none", async () => {
    await openAchievement();

    expect(required(panel())).toHaveExactClasses([AskLoaderStyles.askLoaderContainer]);
    expect(rows()).toHaveLength(0);
    expect(find(`.${ImportGuidesStyles.guideLinks} label`, panel()).getAttribute('for')).toBe(required(field()).id);
    expect(find(`.${ImportGuidesStyles.guideLinks} label`, panel()).textContent).toBe('XboxAchievements Url');
    expect(button().value).toBe('Save');
    expect(solutions()).toHaveLength(0);
    expect(GM_openInTab).not.toHaveBeenCalled();
  });

  test.each(['invalid-url', 'https://www.playstationtrophies.org/game/g-force/guide/'])(
    'should not save %s',
    async (value) => {
      await openAchievement();

      submit(value);
      // A tab would open only after the save, which is async
      await tick();

      expect(required(field()).value).toBe(value);
      expect(getGuideLinks(setting, 'GForce')).toEqual([]);
      expect(GM_openInTab).not.toHaveBeenCalled();
    }
  );

  test('should save a guide page, read it in a background tab and show its guide, keeping the page listed', async () => {
    const tab = openTab();
    await openAchievement();

    submit('https://www.xboxachievements.com/game/g-force/guide');

    // XboxAchievements answers background requests with a Cloudflare challenge, so it's read in a tab instead
    await vi.waitFor(() =>
      expect(GM_openInTab).toHaveBeenCalledExactlyOnceWith(guideUrl, { active: false, insert: true, setParent: true })
    );
    expect(getGuideLinks(setting, 'GForce')).toEqual([guideUrl]);
    expect(find('span', rows()[0]).textContent).toBe('Importing…');

    // Our script on the guide page reads it
    visitGuidePage();

    await vi.waitFor(() => expect(solutions()).toHaveLength(1));
    const solution = solutions()[0];
    expect(find('a', solution).textContent.trim()).toBe('XboxAchievements');
    expect(find('a', solution).getAttribute('href')).toBe(required(combatVeteran()).href);
    expect(find('.info', solution).textContent).toBe('This guide was imported from XboxAchievements.com');
    expect(find('.body', solution.closest('li')).innerHTML).toBe(required(combatVeteran()).guide);
    expect(tab.close).toHaveBeenCalledOnce();
    expect(find('span', rows()[0]).textContent).toBe(`${guidePageGuides().length} guides`);
    expect(required(panel())).toHaveExactClasses([AskLoaderStyles.askLoaderContainer]);
    // Moved out of Tampermonkey storage into IndexedDB
    expect(GM_getValue(`importedGuides:${guideUrl}`)).toBeUndefined();
    expect(await importedGuides.get(guideUrl)).toHaveLength(guidePageGuides().length);
  });

  test('should say where to look once an import is taking a while, then show the guides when they arrive', async () => {
    const tab = openTab();
    await openAchievement();
    useFakeTimers();
    const slow = () => rows()[0].querySelector(`.${ImportGuidesStyles.guideLinksSlow}`);

    submit(guideUrl);
    await vi.advanceTimersByTimeAsync(0);
    expect(GM_openInTab).toHaveBeenCalledOnce();

    await vi.advanceTimersByTimeAsync(29_999);
    expect(slow()).toBeNull();

    await vi.advanceTimersByTimeAsync(1);
    expect(required(slow()).textContent).toBe(
      'This is taking a while: check the guide tab, or open the guide page yourself and close that tab.'
    );
    expect(find('span', rows()[0]).textContent).toBe('Importing…');
    expect(tab.close).not.toHaveBeenCalled();

    visitGuidePage();

    await vi.waitFor(async () => {
      await vi.advanceTimersByTimeAsync(0);
      expect(find('span', rows()[0]).textContent).toBe(`${guidePageGuides().length} guides`);
    });
    expect(slow()).toBeNull();
    expect(tab.close).toHaveBeenCalledOnce();
  });

  // The first import's timer mustn't carry over into the next one
  test('should wait the whole while again before saying an import started again is taking a while', async () => {
    const firstTab = openTab();
    openTab();
    await openAchievement([guideUrl]);
    useFakeTimers();
    const slow = () => rows()[0].querySelector(`.${ImportGuidesStyles.guideLinksSlow}`);

    click(find(guideLinkSelectors.importLink, rows()[0]));
    await vi.advanceTimersByTimeAsync(10_000);
    // The user closes the tab before it hands any guides over
    required(firstTab.onclose)();
    await vi.waitFor(async () => {
      await vi.advanceTimersByTimeAsync(0);
      find(guideLinkSelectors.importLink, rows()[0]);
    });

    click(find(guideLinkSelectors.importLink, rows()[0]));
    await vi.advanceTimersByTimeAsync(29_000);
    expect(slow()).toBeNull();

    await vi.advanceTimersByTimeAsync(1_000);
    expect(required(slow())).toHaveExactClasses([ImportGuidesStyles.guideLinksSlow, 'small']);
  });

  test('should not carry a slow import over into the next import of the row', async () => {
    const firstTab = openTab();
    openTab();
    await openAchievement([guideUrl]);
    useFakeTimers();
    const slow = () => rows()[0].querySelector(`.${ImportGuidesStyles.guideLinksSlow}`);

    click(find(guideLinkSelectors.importLink, rows()[0]));
    await vi.advanceTimersByTimeAsync(30_000);
    expect(required(slow())).toHaveExactClasses([ImportGuidesStyles.guideLinksSlow, 'small']);
    // The user closes the tab before it hands any guides over
    required(firstTab.onclose)();
    await vi.waitFor(async () => {
      await vi.advanceTimersByTimeAsync(0);
      find(guideLinkSelectors.importLink, rows()[0]);
    });

    click(find(guideLinkSelectors.importLink, rows()[0]));
    await vi.advanceTimersByTimeAsync(0);

    expect(find('span', rows()[0]).textContent).toBe('Importing…');
    expect(slow()).toBeNull();
  });

  test('should not say an import is taking a while once it has finished', async () => {
    openTab();
    await openAchievement();
    useFakeTimers();

    submit(guideUrl);
    await vi.advanceTimersByTimeAsync(0);
    visitGuidePage();
    await vi.waitFor(async () => {
      await vi.advanceTimersByTimeAsync(0);
      expect(find('span', rows()[0]).textContent).toBe(`${guidePageGuides().length} guides`);
    });

    await vi.advanceTimersByTimeAsync(30_000);

    expect(rows()[0].querySelector(`.${ImportGuidesStyles.guideLinksSlow}`)).toBeNull();
  });

  test('should show the guide from a guide page visited earlier, without opening a tab', async () => {
    visitGuidePage();
    await openAchievement([guideUrl]);

    expect(solutions()).toHaveLength(1);
    expect(find('.body', solutions()[0].closest('li')).innerHTML).toBe(required(combatVeteran()).guide);
    expect(rows().map((row) => find('a', row).textContent)).toEqual(['g-force/guide/']);
    expect(field()).toBeNull();
    expect(GM_openInTab).not.toHaveBeenCalled();
  });

  test('should replace the guide page when changed, forgetting the old one and its guide', async () => {
    const otherGame = 'https://www.xboxachievements.com/game/mass-effect/guide/';
    visitGuidePage();
    await openAchievement([guideUrl]);
    openTab();

    click(find(guideLinkSelectors.addLink, panel()));
    await vi.waitFor(() => expect(field()).not.toBeNull());
    expect(button().value).toBe('Change');
    submit(otherGame);

    expect(getGuideLinks(setting, 'GForce')).toEqual([otherGame]);
    // The shown guide follows the links once their stored guides are read again
    await vi.waitFor(() => expect(solutions()).toHaveLength(0));
    await vi.waitFor(async () => expect(await importedGuides.get(guideUrl)).toBeNull());
    await vi.waitFor(() =>
      expect(GM_openInTab).toHaveBeenCalledExactlyOnceWith(otherGame, { active: false, insert: true, setParent: true })
    );
  });

  test('should remove the guide page, its guide and its stored guides, and ask again', async () => {
    visitGuidePage();
    await openAchievement([guideUrl]);

    click(find(guideLinkSelectors.removeLink, rows()[0]));

    await vi.waitFor(() => expect(rows()).toHaveLength(0));
    expect(getGuideLinks(setting, 'GForce')).toEqual([]);
    // The shown solutions follow a re-read of the stored guides, which can land after the rows (games N17)
    await vi.waitFor(() => expect(solutions()).toHaveLength(0));
    expect(field()).not.toBeNull();
    await vi.waitFor(async () => expect(await importedGuides.get(guideUrl)).toBeNull());
  });

  // GuideSitePanel's catches: a row never stays on "Importing…" for good, and nothing rejects unhandled
  describe('when importing fails', () => {
    // The row's status: its "Importing…" or guide count, or its Import link
    const rowStatus = (): string =>
      (rows()[0].querySelector(':scope > span') ?? find(guideLinkSelectors.importLink, rows()[0])).textContent;

    test("should offer to import again when the guide page's tab can't be opened, saying why", async () => {
      const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
      const refused = new Error('Tampermonkey refused the tab');
      vi.mocked(GM_openInTab).mockImplementationOnce(() => {
        throw refused;
      });
      await openAchievement();

      submit('https://www.xboxachievements.com/game/g-force/guide');

      // (The new row shows Import before its import starts, so the warning comes first)
      await vi.waitFor(() =>
        expect(warn).toHaveBeenCalledExactlyOnceWith(
          'import-guides',
          `${guideUrl}'s guides couldn't be imported`,
          refused
        )
      );
      await vi.waitFor(() => expect(rowStatus()).toBe('Import'));
    });

    // An IndexedDB error reading them, before the import (taken as not read yet) and after it
    test("should import a new page, then offer to import it again, when its stored guides can't be read", async () => {
      const tab = openTab();
      await openAchievement();
      vi.spyOn(importedGuides, 'get').mockRejectedValue(new Error('IndexedDB failed'));

      submit('https://www.xboxachievements.com/game/g-force/guide');
      await vi.waitFor(() =>
        expect(GM_openInTab).toHaveBeenCalledExactlyOnceWith(guideUrl, { active: false, insert: true, setParent: true })
      );
      expect(rowStatus()).toBe('Importing…');
      // The user closes the tab before it hands any guides over
      required(tab.onclose)();

      await vi.waitFor(() => expect(rowStatus()).toBe('Import'));
      expect(solutions()).toHaveLength(0);
    });

    test("should still remove a page whose stored guides can't be forgotten", async () => {
      visitGuidePage();
      await openAchievement([guideUrl]);
      // Failing inside the store rather than stubbing importedGuides.delete: a Vitest mock's own promise counts as
      // handled (it records how it settled), so a rejection left unhandled wouldn't show
      const forget = vi.spyOn(IDBObjectStore.prototype, 'delete').mockImplementation(() => {
        throw new DOMException('IndexedDB failed', 'UnknownError');
      });

      click(find(guideLinkSelectors.removeLink, rows()[0]));

      await vi.waitFor(() => expect(rows()).toHaveLength(0));
      expect(getGuideLinks(setting, 'GForce')).toEqual([]);
      expect(forget).toHaveBeenCalledExactlyOnceWith(guideUrl);
    });
  });
});

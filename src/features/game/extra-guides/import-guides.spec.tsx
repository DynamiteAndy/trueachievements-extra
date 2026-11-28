import { AchievementsRegex } from '@ta-x-site';
import { isAppliedLive, settings } from '@ta-x-storage';
import {
  changeSettingLive,
  click,
  expectAppliesLive,
  find,
  readFixtureDocument,
  setHtml,
  setSettings,
  withoutUniqueIds
} from '@ta-x-test';

import { setGuideLinks } from './guide-links';
import { getReseroGuides } from './guide-pages';
import { guideLinkSelectors, guideSitePanel } from './guide-site-panel.spec-helpers';
import { importGuides } from './import-guides';
import { handOverImportedGuides, importedGuides } from './imported-guides';
import styles from './styles';

// The guide sites' settings apply live: changed in the settings menu, the Extra Guides section gains or loses that
// site's tab, and on an achievement page its imported solution, with no reload
describe('game/extra-guides live', () => {
  const { extraGuides } = settings.game;
  const xboxGuideUrl = 'https://www.xboxachievements.com/game/g-force/guide/';

  const { panel, rows, solutions } = guideSitePanel('xbox-achievements');
  const section = (): Element | null => document.querySelector(`.${styles.importGuides}`);
  const tabs = (): [string, string | null][] =>
    [...document.querySelectorAll(`.${styles.importGuides} [role="tab"]`)].map((tab) => [
      tab.textContent,
      tab.getAttribute('aria-selected')
    ]);

  // The page, but for the ids new each time the section or a tab mounts (the guide page field's, the tab group's and
  // the logos' gradients)
  const page = (): string => withoutUniqueIds(document.body.innerHTML);

  // XboxAchievements' guide page for G-Force, linked and read, so its tab brings a solution
  const linkXboxGuide = (): void => {
    setGuideLinks('gameAchievementsXboxAchievementsGuideUrl', 'GForce', [xboxGuideUrl]);
    handOverImportedGuides(
      xboxGuideUrl,
      getReseroGuides(readFixtureDocument('@ta-x-test-views/xbox-achievements-guide/g-force.html'), xboxGuideUrl)
    );
  };

  // Combat Veteran's page on TrueAchievements, for G-Force, with the given sites on
  const openAchievement = async (on: Record<string, boolean> = {}): Promise<void> => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    setSettings(Object.fromEntries(Object.entries(on).map(([name, value]) => [`game.extraGuides.${name}`, value])));
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValue(true);

    onTestFinished(await importGuides());
  };

  test("should add a site's tab and solution on, take them away exactly off, and add them again, with no site on before", async () => {
    linkXboxGuide();
    await openAchievement();
    expect(section()).toBeNull();

    await expectAppliesLive(extraGuides.showXboxAchievementGuides, page);

    expect(tabs()).toEqual([['Xbox Achievements', 'true']]);
    expect(rows()).toHaveLength(1);
    expect(solutions()).toHaveLength(1);
  });

  test("should still show the section, offering Import, when the imported guides can't be read", async () => {
    linkXboxGuide();
    vi.spyOn(importedGuides, 'get').mockRejectedValue(new Error('IndexedDB'));

    await openAchievement({ showXboxAchievementGuides: true });

    expect(tabs()).toEqual([['Xbox Achievements', 'true']]);
    expect(find(guideLinkSelectors.importLink, rows()[0]).textContent).toBe('Import');
    expect(solutions()).toHaveLength(0);
  });

  test("should add and take away a site's tab beside another site's, keeping that one selected", async () => {
    await openAchievement({ showPlaystationTrophyGuides: true });

    await expectAppliesLive(extraGuides.showXboxAchievementGuides, page);

    expect(tabs()).toEqual([
      ['Xbox Achievements', 'false'],
      ['Playstation Trophies', 'true']
    ]);
  });

  test('should take the section away, giving the page back as it was, when the last site is turned off', async () => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    const page = document.body.innerHTML;
    linkXboxGuide();
    await openAchievement({ showXboxAchievementGuides: true });
    expect(section()).not.toBeNull();
    expect(solutions()).toHaveLength(1);

    await changeSettingLive(extraGuides.showXboxAchievementGuides, false);

    expect(section()).toBeNull();
    expect(document.body.innerHTML).toBe(page);
  });

  test('should select the first tab left when the selected tab is turned off', async () => {
    await openAchievement({
      showXboxAchievementGuides: true,
      showPlaystationTrophyGuides: true,
      showGamertagNationGuides: true
    });
    click(find(`.${styles.importGuides} [aria-controls$="-gamertag-nation"]`));

    await changeSettingLive(extraGuides.showGamertagNationGuides, false);

    expect(tabs()).toEqual([
      ['Xbox Achievements', 'true'],
      ['Playstation Trophies', 'false']
    ]);
    expect(find('[data-tab-visible]', section()).id).toMatch(/^ta-x-tabs-group-\d+-xbox-achievements$/);
  });

  test("should bring a site's tab back as it was left when it's turned off and on again", async () => {
    linkXboxGuide();
    await openAchievement({ showXboxAchievementGuides: true, showPlaystationTrophyGuides: true });
    click(find(guideLinkSelectors.removeLink, rows()[0]));
    await vi.waitFor(() => expect(solutions()).toHaveLength(0));

    await changeSettingLive(extraGuides.showXboxAchievementGuides, false);
    await changeSettingLive(extraGuides.showXboxAchievementGuides, true);

    expect(panel()).not.toBeNull();
    expect(rows()).toHaveLength(0);
    expect(solutions()).toHaveLength(0);
  });

  test('should register the sites as applied live while the section is mounted, so changing one asks for no reload', async () => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValue(true);
    const sites = [
      extraGuides.showXboxAchievementGuides,
      extraGuides.showPlaystationTrophyGuides,
      extraGuides.showGamertagNationGuides
    ];
    // None on: mounted all the same, for one to be turned on
    const stop = await importGuides();

    expect(sites.map(isAppliedLive)).toEqual([true, true, true]);
    stop();
    expect(sites.map(isAppliedLive)).toEqual([false, false, false]);
  });
});

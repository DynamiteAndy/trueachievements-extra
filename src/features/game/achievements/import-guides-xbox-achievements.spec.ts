import { AchievementsRegex } from '@ta-x-site';
import { find, neverFinds, openTab, readFixtureDocument, setHtml, setSettings } from '@ta-x-test';

import { importGuides, getReseroGuides, handOverImportedGuides, importedGuides, getGuideLinks } from '../extra-guides';
import { guideSitePanel } from '../extra-guides/guide-site-panel.spec-helpers';
import ImportGuidesStyles from '../extra-guides/styles';

// The game's achievements list has the same tabs, but no solutions to add a guide to
describe('game/achievements import guides: XboxAchievements', () => {
  const guideUrl = 'https://www.xboxachievements.com/game/g-force/guide/';
  const setting = 'gameAchievementsXboxAchievementsGuideUrl';

  const { rows, submit } = guideSitePanel('xbox-achievements');

  const openAchievements = async (): Promise<void> => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    setSettings({ 'game.extraGuides.showXboxAchievementGuides': true });
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValue(false);

    onTestFinished(await importGuides());
  };

  // With a guide site on, so it's the heading's guard that stops it (with none on it would stop anyway)
  test("should add nothing when the game's heading never loads", async () => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    setSettings({ 'game.extraGuides.showXboxAchievementGuides': true });
    neverFinds('.game h2 a');

    onTestFinished(await importGuides());

    expect(document.querySelector(`.${ImportGuidesStyles.importGuides}`)).toBeNull();
  });

  test('should save a guide page and read its guides in a background tab, listing it but adding no guide', async () => {
    const tab = openTab();
    await openAchievements();

    submit(guideUrl);
    await vi.waitFor(() =>
      expect(GM_openInTab).toHaveBeenCalledExactlyOnceWith(guideUrl, { active: false, insert: true, setParent: true })
    );

    // Our script on G-Force's guide page reads it
    const guides = getReseroGuides(
      readFixtureDocument('@ta-x-test-views/xbox-achievements-guide/g-force.html'),
      guideUrl
    );
    handOverImportedGuides(guideUrl, guides);

    await vi.waitFor(() => expect(find('span', rows()[0]).textContent).toBe(`${guides.length} guides`));
    expect(tab.close).toHaveBeenCalledOnce();
    expect(getGuideLinks(setting, 'GForce')).toEqual([guideUrl]);
    expect(await importedGuides.get(guideUrl)).toHaveLength(guides.length);
    expect(document.querySelector(`.${ImportGuidesStyles.achievementGuideSolution}`)).toBeNull();
  });
});

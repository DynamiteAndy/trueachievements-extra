import { AchievementsRegex } from '@ta-x-site';
import { find, openTab, readFixtureDocument, setHtml, setSettings, tick } from '@ta-x-test';

import {
  importGuides,
  getGamertagNationGuides,
  handOverImportedGuides,
  getGuideLinks,
  setGuideLinks
} from '../extra-guides';
import { guideSitePanel } from '../extra-guides/guide-site-panel.spec-helpers';

describe('game/achievement import guides: Gamertag Nation', () => {
  const setting = 'gameAchievementsGamertagNationGuideUrl';
  const guideUrl = 'https://www.gamertagnation.com/game/lego-pirates-of-the-caribbean/guides';

  // The guides our script reads on LEGO Pirates of the Caribbean's guides page on Gamertag Nation
  const guidePageGuides = () =>
    getGamertagNationGuides(readFixtureDocument('@ta-x-test-views/gamertag-nation-guides/lego-pirates.html'), guideUrl);

  const { rows, submit, solutions } = guideSitePanel('gamertag-nation');

  // Did everybody see that?, an achievement in LEGO Pirates of the Caribbean
  const openAchievement = async (): Promise<void> => {
    setHtml('@ta-x-test-views/achievement-page/lego-pirates.html');
    setSettings({ 'game.extraGuides.showGamertagNationGuides': true });
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValue(true);

    onTestFinished(await importGuides());
  };

  test("should ask for the game's guides page, at its current address, and read it in a tab once saved", async () => {
    openTab();
    await openAchievement();

    submit('https://www.gamertagnation.com/games.php?g=lego-pirates-of-the-caribbean&do=guides');
    // A tab would open only after the save, which is async
    await tick();

    // Its old address isn't a guides page any more
    expect(getGuideLinks(setting, 'LEGO-Pirates-of-the-Caribbean')).toEqual([]);
    expect(GM_openInTab).not.toHaveBeenCalled();

    // Saved as the site links it, with the slash
    submit(guideUrl);

    expect(getGuideLinks(setting, 'LEGO-Pirates-of-the-Caribbean')).toEqual([`${guideUrl}/`]);
    await vi.waitFor(() =>
      expect(GM_openInTab).toHaveBeenCalledExactlyOnceWith(`${guideUrl}/`, {
        active: false,
        insert: true,
        setParent: true
      })
    );
    expect(find('span', rows()[0]).textContent).toBe('Importing…');
  });

  test("should show the guide from the guides page above the site's solutions, with its icon", async () => {
    handOverImportedGuides(guideUrl, guidePageGuides());
    setGuideLinks(setting, 'LEGO-Pirates-of-the-Caribbean', [`${guideUrl}/`]);

    await openAchievement();

    expect(rows().map((row) => find('span', row).textContent)).toEqual(['3 guides']);
    expect(solutions()).toHaveLength(1);
    const solution = solutions()[0];
    expect(solution.closest('li')).toBe(document.querySelector('ul.posts > li'));
    // How a solution shows its link and info is AchievementGuideSolution's (its spec checks them); the site's name is
    // this site's own
    expect(find('a', solution).textContent.trim()).toBe('Gamertag Nation');
    expect(find('svg', solution).getAttribute('class')).toBe('ta-x-gamertagnation-icon');
    expect(find('.body', solution.closest('li')).innerHTML).toBe(
      // Gamertag Nation's A button doesn't load on other sites, so it's TrueAchievements' own
      'Follow Davy Jones to the highest mast when he has 1 heart left, then press <img src="/images/controllerbuttons/Xbox%20One/cn_A.png" alt="A Button" width="18" height="18"> twice to high dive into the Maelstrom from the Purple Stud. Accomplish this and the achievement should unlock.'
    );
  });
});

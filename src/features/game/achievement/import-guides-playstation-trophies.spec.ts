import { AchievementsRegex } from '@ta-x-site';
import { click, find, openTab, readFixtureDocument, required, setHtml, setSettings } from '@ta-x-test';

import {
  importGuides,
  getReseroGuides,
  handOverImportedGuides,
  importedGuides,
  getGuideLinks,
  setGuideLinks
} from '../extra-guides';
import { guideLinkSelectors, guideSitePanel, guideSiteTabPanel } from '../extra-guides/guide-site-panel.spec-helpers';

describe('game/achievement import guides: PlayStationTrophies', () => {
  const setting = 'gameAchievementsPlaystationTrophiesGuideUrl';
  // G-Force on PlaystationTrophies, and another game's guide page that doesn't have the achievement
  const gforce = 'https://www.playstationtrophies.org/game/g-force/guide/';
  const metalGearSolid3 = 'https://www.playstationtrophies.org/game/metal-gear-solid-3-snake-eater-hd/guide/';

  const guidesFrom = (view: string, url: string) => getReseroGuides(readFixtureDocument(view), url);
  const gforceGuides = () => guidesFrom('@ta-x-test-views/playstation-trophies-guide/g-force.html', gforce);
  const metalGearSolid3Guides = () =>
    guidesFrom('@ta-x-test-views/playstation-trophies-guide/metal-gear-solid-3.html', metalGearSolid3);

  const { panel, rows, field, button, submit, solutions } = guideSitePanel('playstation-trophies');

  // Combat Veteran's page on TrueAchievements, for G-Force
  const openAchievement = async (): Promise<void> => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    setSettings({ 'game.extraGuides.showPlaystationTrophyGuides': true });
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValue(true);

    onTestFinished(await importGuides());
  };

  test("should put the sites' guides in their order, XboxAchievements first, whichever is read first", async () => {
    const xboxGforce = 'https://www.xboxachievements.com/game/g-force/guide/';
    const xboxGuides = () => guidesFrom('@ta-x-test-views/xbox-achievements-guide/g-force.html', xboxGforce);
    handOverImportedGuides(gforce, gforceGuides());
    setGuideLinks(setting, 'GForce', [gforce]);
    // XboxAchievements' page is linked, but its guides haven't been read yet
    setGuideLinks('gameAchievementsXboxAchievementsGuideUrl', 'GForce', [xboxGforce]);
    setSettings({ 'game.extraGuides.showXboxAchievementGuides': true });
    openTab();

    await openAchievement();
    const names = () => solutions().map((solution) => find('a', solution).textContent.trim());
    expect(names()).toEqual(['Playstation Trophies']);

    // Reading XboxAchievements' guides now adds its guide above PlaystationTrophies'
    const xboxPanel = find(guideSiteTabPanel('xbox-achievements'));
    click(find(guideLinkSelectors.importLink, xboxPanel));
    await vi.waitFor(() =>
      expect(GM_openInTab).toHaveBeenCalledExactlyOnceWith(xboxGforce, { active: false, insert: true, setParent: true })
    );
    handOverImportedGuides(xboxGforce, xboxGuides());

    await vi.waitFor(() => expect(names()).toEqual(['XboxAchievements', 'Playstation Trophies']));
    // Above the site's own solutions
    expect(find('ul.posts').firstElementChild).toBe(solutions()[0].closest('li'));
  });

  test("should show the guide from whichever of the game's pages has the achievement", async () => {
    handOverImportedGuides(metalGearSolid3, metalGearSolid3Guides());
    handOverImportedGuides(gforce, gforceGuides());
    setGuideLinks(setting, 'GForce', [metalGearSolid3, gforce]);

    await openAchievement();

    expect(rows().map((row) => [find('a', row).textContent, find('span', row).textContent])).toEqual([
      ['metal-gear-solid-3-snake-eater-hd/guide/', '2 guides'],
      ['g-force/guide/', `${gforceGuides().length} guides`]
    ]);
    expect(solutions()).toHaveLength(1);
    const solution = solutions()[0];
    const combatVeteran = gforceGuides().find(({ title }) => title === 'Combat Veteran');
    expect(find('a', solution).textContent.trim()).toBe('Playstation Trophies');
    expect(find('a', solution).getAttribute('href')).toBe(required(combatVeteran).href);
    expect(find('.info', solution).textContent).toBe('This guide was imported from PlaystationTrophies.org');
    expect(find('.body', solution.closest('li')).innerHTML).toBe(required(combatVeteran).guide);
  });

  test("should add another of the game's pages behind +, keeping the ones it has", async () => {
    handOverImportedGuides(metalGearSolid3, metalGearSolid3Guides());
    setGuideLinks(setting, 'GForce', [metalGearSolid3]);
    const tab = openTab();
    await openAchievement();
    expect(field()).toBeNull();

    click(find(guideLinkSelectors.addLink, panel()));
    await vi.waitFor(() => expect(button().value).toBe('Add'));
    submit(gforce);

    expect(getGuideLinks(setting, 'GForce')).toEqual([metalGearSolid3, gforce]);
    await vi.waitFor(() =>
      expect(GM_openInTab).toHaveBeenCalledExactlyOnceWith(gforce, { active: false, insert: true, setParent: true })
    );
    handOverImportedGuides(gforce, gforceGuides());

    await vi.waitFor(() => expect(solutions()).toHaveLength(1));
    expect(rows().map((row) => find('a', row).textContent)).toEqual([
      'metal-gear-solid-3-snake-eater-hd/guide/',
      'g-force/guide/'
    ]);
    expect(tab.close).toHaveBeenCalledOnce();
  });

  test('should remove one page, its guide and its stored guides, keeping the others', async () => {
    handOverImportedGuides(metalGearSolid3, metalGearSolid3Guides());
    handOverImportedGuides(gforce, gforceGuides());
    setGuideLinks(setting, 'GForce', [metalGearSolid3, gforce]);
    await openAchievement();

    click(find(guideLinkSelectors.removeLink, rows()[1]));

    await vi.waitFor(() => expect(rows()).toHaveLength(1));
    expect(rows().map((row) => find('a', row).textContent)).toEqual(['metal-gear-solid-3-snake-eater-hd/guide/']);
    expect(getGuideLinks(setting, 'GForce')).toEqual([metalGearSolid3]);
    // The shown solutions follow a re-read of the stored guides, which can land after the rows (games N17)
    await vi.waitFor(() => expect(solutions()).toHaveLength(0));
    await vi.waitFor(async () => expect(await importedGuides.get(gforce)).toBeNull());
    expect(await importedGuides.get(metalGearSolid3)).toHaveLength(2);
  });
});

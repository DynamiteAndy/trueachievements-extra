import { AchievementsRegex } from '@ta-x-site';
import { find, required, setHtml } from '@ta-x-test';

import { getGuideLinks, setGuideLinks } from './guide-links';
import { getAchievementTitle, loadGuideSite, saveGuideLinks } from './guide-site-links';
import { guideSites } from './guide-sites';

describe('game/extra-guides/guide-site-links', () => {
  const site = required(guideSites.find(({ id }) => id === 'xbox-achievements'));
  const guideUrl = 'https://www.xboxachievements.com/game/g-force/guide/';

  // G-Force's Combat Veteran page, its game link pointing outside /game/, so there's no game name to keep links under
  beforeEach(() => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    find<HTMLAnchorElement>('.game h2 a').href = 'https://www.trueachievements.com/gamer/GForce';
  });

  test("should load no links when the game's link has no game name", async () => {
    setGuideLinks(site.setting, '', [guideUrl]);

    expect(await loadGuideSite(site, 'Combat Veteran')).toEqual({ links: [], guide: null });
  });

  test("should save no links when the game's link has no game name", () => {
    saveGuideLinks(site, [{ url: guideUrl, guides: null, importing: false }]);

    expect(getGuideLinks(site.setting, '')).toEqual([]);
  });

  describe("on a page without the game's link", () => {
    // Every one: the fixture has the gamer's link under .game h2 too
    beforeEach(() => {
      document.querySelectorAll('.game h2 a').forEach((link) => link.remove());
    });

    test('should load no links', async () => {
      setGuideLinks(site.setting, '', [guideUrl]);

      expect(await loadGuideSite(site, 'Combat Veteran')).toEqual({ links: [], guide: null });
    });

    test('should save no links', () => {
      saveGuideLinks(site, [{ url: guideUrl, guides: null, importing: false }]);

      expect(getGuideLinks(site.setting, '')).toEqual([]);
    });
  });

  // Each guide site keeps its linked guide pages in its own setting (a swap would mix two sites' links)
  test('should keep each guide site under its own setting', () => {
    expect(guideSites.map(({ id, setting }) => [id, setting])).toEqual([
      ['xbox-achievements', 'gameAchievementsXboxAchievementsGuideUrl'],
      ['playstation-trophies', 'gameAchievementsPlaystationTrophiesGuideUrl'],
      ['gamertag-nation', 'gameAchievementsGamertagNationGuideUrl']
    ]);
  });

  // The site marks an achievement it's hiding from the viewer (signed out, or "Show secret achievements I don't have"
  // off) `data-secret="achievement"`, its real title still in the markup under a "SECRET" overlay. Its title is read
  // all the same, so its imported guide shows
  test.each([false, true])("should read the achievement's title, hidden by the site: %s", async (hidden) => {
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValue(true);
    if (hidden) {
      find('.ach-panel').setAttribute('data-secret', 'achievement');
    }

    expect(await getAchievementTitle()).toBe(find('.ach-panel .title').textContent.trim());
  });

  // The guides run on a game's DLC pages too, which link the game the same way
  describe("on a game's DLC page", () => {
    beforeEach(() => {
      setHtml('@ta-x-test-views/game-dlc/won.html');
    });

    test("should load the game's links, with no achievement to match a guide to", async () => {
      setGuideLinks(site.setting, 'Gears-of-War-Judgment', [guideUrl]);

      const loaded = await loadGuideSite(site, null);

      expect([loaded.links.map(({ url }) => url), loaded.guide]).toEqual([[guideUrl], null]);
    });

    test("should save links under the game's name", () => {
      saveGuideLinks(site, [{ url: guideUrl, guides: null, importing: false }]);

      expect(getGuideLinks(site.setting, 'Gears-of-War-Judgment')).toEqual([guideUrl]);
    });
  });
});

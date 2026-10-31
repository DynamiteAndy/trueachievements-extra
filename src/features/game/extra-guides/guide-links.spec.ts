import { forgetUnlinkedGuidePages, getGuideLinks, isGuidePageLinked, setGuideLinks } from './guide-links';
import { importedGuides } from './imported-guides';

describe('game/extra-guides/guide-links', () => {
  const site = 'gameAchievementsPlaystationTrophiesGuideUrl';
  const mgs2 = 'https://www.playstationtrophies.org/game/metal-gear-solid-2-hd/guide/';
  const mgs3 = 'https://www.playstationtrophies.org/game/metal-gear-solid-3-snake-eater-hd/guide/';
  const massEffect = 'https://www.playstationtrophies.org/game/mass-effect/guide/';

  test("should save and read a game's guide pages", () => {
    setGuideLinks(site, 'Metal-Gear-Solid-HD-Collection', [mgs2, mgs3]);

    expect(getGuideLinks(site, 'Metal-Gear-Solid-HD-Collection')).toEqual([mgs2, mgs3]);
    expect(getGuideLinks(site, 'Mass-Effect')).toEqual([]);
  });

  test('should read the links stored before, in the same format', () => {
    GM_setValue(site, JSON.stringify([['Metal-Gear-Solid-HD-Collection', [mgs2]]]));

    expect(getGuideLinks(site, 'Metal-Gear-Solid-HD-Collection')).toEqual([mgs2]);
  });

  test("should forget the game once its last link is removed, and keep other games'", () => {
    setGuideLinks(site, 'Metal-Gear-Solid-HD-Collection', [mgs2]);
    setGuideLinks(site, 'Mass-Effect', [massEffect]);

    setGuideLinks(site, 'Metal-Gear-Solid-HD-Collection', []);

    expect(GM_getValue(site)).toBe(JSON.stringify([['Mass-Effect', [massEffect]]]));
  });

  test('should tell whether any game links a guide page, as games can share one', () => {
    setGuideLinks(site, 'Metal-Gear-Solid-HD-Collection', [mgs2, mgs3]);
    setGuideLinks(site, 'Metal-Gear-Solid-3-HD', [mgs3]);

    expect([isGuidePageLinked(site, mgs2), isGuidePageLinked(site, mgs3), isGuidePageLinked(site, massEffect)]).toEqual(
      [true, true, false]
    );

    setGuideLinks(site, 'Metal-Gear-Solid-HD-Collection', [mgs2]);
    expect(isGuidePageLinked(site, mgs3)).toBe(true);
    setGuideLinks(site, 'Metal-Gear-Solid-3-HD', []);
    expect(isGuidePageLinked(site, mgs3)).toBe(false);
  });

  describe('forgetUnlinkedGuidePages', () => {
    const guides = [{ title: 'Snake Eater', href: `${mgs3}snake-eater`, guide: '<p>Finish the game.</p>' }];

    test("should forget the guides of a page no game links, on any site, and keep the linked pages'", async () => {
      const xboxSite = 'gameAchievementsXboxAchievementsGuideUrl';
      const xboxMassEffect = 'https://www.xboxachievements.com/game/mass-effect/guide/';
      setGuideLinks(site, 'Metal-Gear-Solid-HD-Collection', [mgs3]);
      setGuideLinks(xboxSite, 'Mass-Effect', [xboxMassEffect]);
      await importedGuides.set(mgs3, guides);
      await importedGuides.set(xboxMassEffect, guides);
      await importedGuides.set(massEffect, guides);

      await forgetUnlinkedGuidePages();

      expect((await importedGuides.keys()).sort()).toEqual([mgs3, xboxMassEffect].sort());
    });
  });
});

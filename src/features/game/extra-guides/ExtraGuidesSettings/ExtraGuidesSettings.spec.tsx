import { find, getAccordions, getSettings, mountInPage, setSettings } from '@ta-x-test';

import { ExtraGuidesSettings } from './ExtraGuidesSettings';

describe('game/extra-guides/ExtraGuidesSettings', () => {
  test('should show a setting per guide site, each saving to its own', () => {
    expect(getSettings(<ExtraGuidesSettings />)).toEqual([
      ['ta-x-game-extra-guides-show-xbox-achievement-guides', 'game.extraGuides.showXboxAchievementGuides'],
      ['ta-x-game-extra-guides-show-playstation-trophy-guides', 'game.extraGuides.showPlaystationTrophyGuides'],
      ['ta-x-game-extra-guides-show-gamertag-nation-guides', 'game.extraGuides.showGamertagNationGuides']
    ]);
  });

  test('should put them in an accordion', () => {
    expect(getAccordions(<ExtraGuidesSettings />)).toEqual(['Extra Guides']);
  });

  test("should explain a guide site's import only while it's on", () => {
    const helperText = () =>
      find('#ta-x-game-extra-guides-show-xbox-achievement-guides', mountInPage(<ExtraGuidesSettings />).container)
        .closest('div.ta-x-checkbox')
        ?.querySelector('p')?.textContent ?? null;

    setSettings({ 'game.extraGuides.showXboxAchievementGuides': false });
    expect(helperText()).toBeNull();

    setSettings({ 'game.extraGuides.showXboxAchievementGuides': true });
    expect(helperText()).toBe("Guides are read from the game's guide page, in a background tab that closes itself.");
  });
});

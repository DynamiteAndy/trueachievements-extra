import { find, getAccordions, getSettings, mountInPage, setSettings, shownSettings } from '@ta-x-test';

import { AchievementsSettings } from './AchievementsSettings';

describe('game/achievements/AchievementsSettings', () => {
  test('should show every setting while the settings it depends on are on, each saving to its own', () => {
    setSettings({ 'game.achievements.defaultStatus': true });

    expect(getSettings(<AchievementsSettings />)).toEqual([
      ['ta-x-game-achievements-individual-progress', 'game.achievements.individualProgress'],
      ['ta-x-game-achievements-collapsible-groups', 'game.achievements.collapsibleGroups'],
      ['ta-x-game-achievements-default-status', 'game.achievements.defaultStatus'],
      ['ta-x-game-achievements-default-status-value', 'game.achievements.defaultStatusValue']
    ]);
  });

  test('should put them in an accordion', () => {
    expect(getAccordions(<AchievementsSettings />)).toEqual(['Achievements']);
  });

  test("should offer the site's status radios", () => {
    setSettings({ 'game.achievements.defaultStatus': true });
    const select = find<HTMLSelectElement>(
      '#ta-x-game-achievements-default-status-value',
      mountInPage(<AchievementsSettings />).container
    );

    expect([...select.options].map((option) => [option.value, option.text])).toEqual([
      ['rdoAllAchievements', 'All'],
      ['rdoWonAchievements', 'Won'],
      ['rdoNotWonAchievements', 'Not Won']
    ]);
  });

  test('should leave out the settings that depend on the default status while that is off', () => {
    expect(shownSettings(<AchievementsSettings />)).toEqual([
      'ta-x-game-achievements-individual-progress',
      'ta-x-game-achievements-collapsible-groups',
      'ta-x-game-achievements-default-status'
    ]);
  });
});

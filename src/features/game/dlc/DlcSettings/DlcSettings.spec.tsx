import { find, getAccordions, getSettings, mountInPage, required, setSettings, shownSettings } from '@ta-x-test';

import { DlcSettings } from './DlcSettings';

describe('game/dlc/DlcSettings', () => {
  test('should show every setting while the settings it depends on are on, each saving to its own', () => {
    setSettings({
      'game.dlc.overrideAchievementsPageSettings': true,
      'game.dlc.defaultStatus': true
    });

    expect(getSettings(<DlcSettings />)).toEqual([
      ['ta-x-game-dlc-override-achievements-page-settings', 'game.dlc.overrideAchievementsPageSettings'],
      ['ta-x-game-dlc-individual-progress', 'game.dlc.individualProgress'],
      ['ta-x-game-dlc-collapsible-groups', 'game.dlc.collapsibleGroups'],
      ['ta-x-game-dlc-default-status', 'game.dlc.defaultStatus'],
      ['ta-x-game-dlc-default-status-value', 'game.dlc.defaultStatusValue']
    ]);
  });

  test('should put them in an accordion', () => {
    expect(getAccordions(<DlcSettings />)).toEqual(['DLC']);
  });

  test('should say the achievements settings are inherited only while the override is off', () => {
    const inherited = 'Some settings will be inherited from Achievements.';
    const offRow = required(
      find('#ta-x-game-dlc-override-achievements-page-settings', mountInPage(<DlcSettings />).container).closest(
        'div.ta-x-checkbox'
      )
    );
    expect(find('p', offRow).textContent).toBe(inherited);

    setSettings({ 'game.dlc.overrideAchievementsPageSettings': true });
    const onRow = required(
      find('#ta-x-game-dlc-override-achievements-page-settings', mountInPage(<DlcSettings />).container).closest(
        'div.ta-x-checkbox'
      )
    );
    expect(onRow.querySelector('p')).toBeNull();
  });

  test("should offer the site's status radios, the last row under its toggle", () => {
    setSettings({
      'game.dlc.overrideAchievementsPageSettings': true,
      'game.dlc.defaultStatus': true
    });
    const select = find<HTMLSelectElement>(
      '#ta-x-game-dlc-default-status-value',
      mountInPage(<DlcSettings />).container
    );

    expect([...select.options].map((option) => [option.value, option.text])).toEqual([
      ['rdoAllAchievements', 'All'],
      ['rdoWonAchievements', 'Won'],
      ['rdoNotWonAchievements', 'Not Won']
    ]);
    expect(required(select.parentElement)).toHaveExactClasses([
      'frm-grp',
      'frm-sel',
      'ta-x-hide-padding-top',
      'ta-x-select'
    ]);
  });

  test('should leave out the settings that depend on the override while that is off', () => {
    expect(shownSettings(<DlcSettings />)).toEqual(['ta-x-game-dlc-override-achievements-page-settings']);
  });
});

import { getAccordions, required, shownSettings } from '@ta-x-test';

import { GameSettings } from './game';
import { settingsTabs } from './settings-tabs';

describe('settings-tabs', () => {
  const { Settings: GamesTab } = required(settingsTabs.find(({ id }) => id === 'games'));

  test("should start the Games tab with the games list's setting, then a game's pages", () => {
    expect(shownSettings(<GamesTab />)[0]).toBe('ta-x-games-list-add-highlight-games-not-in-collection-button');
    expect(getAccordions(<GamesTab />)).toEqual(getAccordions(<GameSettings />));
  });
});

import { getAccordions, getSettings, setSettings, shownSettings } from '@ta-x-test';

import { GameForumSettings } from './GameForumSettings';

describe('game/forum/GameForumSettings', () => {
  test('should show every setting while the settings it depends on are on, each saving to its own', () => {
    setSettings({
      'game.forum.overrideForumThreadFilter': true,
      'game.forum.threadFilter': true,
      'game.forum.defaultThread': true
    });

    expect(getSettings(<GameForumSettings />)).toEqual([
      ['ta-x-game-forum-override-forum-thread-filter', 'game.forum.overrideForumThreadFilter'],
      ['ta-x-game-forum-thread-filter', 'game.forum.threadFilter'],
      ['ta-x-game-forum-thread-filter-keywords', 'game.forum.threadFilterKeywords'],
      ['ta-x-game-forum-default-thread', 'game.forum.defaultThread'],
      ['ta-x-game-forum-default-thread-value', 'game.forum.defaultThreadValue']
    ]);
  });

  test('should put them in an accordion', () => {
    expect(getAccordions(<GameForumSettings />)).toEqual(['Forums']);
  });

  test('should leave out the settings that depend on the override and the default thread while that is off', () => {
    expect(shownSettings(<GameForumSettings />)).toEqual([
      'ta-x-game-forum-override-forum-thread-filter',
      'ta-x-game-forum-default-thread'
    ]);
  });
});

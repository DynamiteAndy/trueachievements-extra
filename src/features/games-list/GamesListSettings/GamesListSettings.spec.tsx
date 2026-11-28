import { getSettings } from '@ta-x-test';

import { GamesListSettings } from './GamesListSettings';

describe('games-list/GamesListSettings', () => {
  test('should render its settings, bound to their settings', () => {
    expect(getSettings(<GamesListSettings />)).toEqual([
      [
        'ta-x-games-list-add-highlight-games-not-in-collection-button',
        'gamesList.addHighlightGamesNotInCollectionButton'
      ]
    ]);
  });
});

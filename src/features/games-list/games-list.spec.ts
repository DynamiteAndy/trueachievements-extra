import { GamesRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import { addHighlightGamesNotInCollectionButton } from './add-highlight-games-not-in-collection-button';

import gamesList from '.';

describeEntry('games-list', {
  run: gamesList,
  page: () => vi.spyOn(GamesRegex.Test, 'gamesUrl'),
  batch: 'Games List',
  tasks: [
    {
      name: 'games-list:add-highlight-games-not-in-collection-button',
      task: addHighlightGamesNotInCollectionButton
    }
  ]
});

import { allConcurrently } from '@ta-x-lib';
import { GamesRegex } from '@ta-x-site';

import { addHighlightGamesNotInCollectionButton } from './add-highlight-games-not-in-collection-button';

// Its row in the settings menu's Games tab (features/settings-tabs.tsx)
export { GamesListSettings } from './GamesListSettings';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.gamesUrl()) {
    return;
  }

  // The highlight button hands back its stop, which nothing here needs
  await allConcurrently<unknown>('Games List', [
    {
      name: 'games-list:add-highlight-games-not-in-collection-button',
      task: addHighlightGamesNotInCollectionButton
    }
  ]);
};

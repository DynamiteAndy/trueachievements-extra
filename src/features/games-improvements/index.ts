import { gamesImprovements } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { addHighlightGamesNotInCollectionButton } from './add-highlight-games-not-in-collection-button';

export default async(): Promise<void> => {
  if (!gamesImprovements.enabled) return;

  allConcurrently('Games Improvements', [ 
    { name: 'games-improvments-add-highlight-games-button', task: addHighlightGamesNotInCollectionButton }
   ]);
};

import { gamesImprovements } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { addHighlightGamesNotInCollectionButton } from './add-highlight-games-not-in-collection-button';
import achievements from './achievements';
import clips from './clips';

export default async(): Promise<void> => {
  if (!gamesImprovements.enabled) return;

  allConcurrently('Games Improvements', [ 
    { name: 'games-improvements-add-highlight-games-button', task: addHighlightGamesNotInCollectionButton },
    { name: 'games-improvements-achievements', task: achievements },
    { name: 'games-improvements-clips', task: clips }
   ]);
};

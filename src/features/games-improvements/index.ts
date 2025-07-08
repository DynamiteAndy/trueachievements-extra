import { allConcurrently } from '@ta-x-utilities';
import { addHighlightGamesNotInCollectionButton } from './add-highlight-games-not-in-collection-button';
import achievement from './achievement';
import achievements from './achievements';
import clips from './clips';
import challenges from './challenges';
import dlc from './dlc';
import forums from './forums';
import news from './news';
import reviews from './reviews';
import walkthrough from './walkthrough';

export default async (): Promise<void> => {
  allConcurrently('Games Improvements', [
    {
      name: 'games-improvements-add-highlight-games-button',
      task: addHighlightGamesNotInCollectionButton
    },
    { name: 'games-improvements-achievement', task: achievement },
    { name: 'games-improvements-achievements', task: achievements },
    { name: 'games-improvements-challenges', task: challenges },
    { name: 'games-improvements-clips', task: clips },
    { name: 'games-improvements-dlc', task: dlc },
    { name: 'games-improvements-forums', task: forums },
    { name: 'games-improvements-news', task: news },
    { name: 'games-improvements-reviews', task: reviews },
    { name: 'games-improvements-walkthrough', task: walkthrough }
  ]);
};

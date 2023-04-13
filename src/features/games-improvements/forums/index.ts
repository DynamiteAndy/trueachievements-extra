import { Constants, GamesRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { filterThreads } from './filter-threads';

export default async(): Promise<void> => {
  if (!GamesRegex.Test.forumUrl()) return;

  document.body.classList.add(Constants.Styles.ForumImprovements.featureJs, Constants.Styles.ForumImprovements.featureStyle);

  allConcurrently('Games Forum', [
    { name: 'games-forum-filter-threads', task: filterThreads }
  ]);
};

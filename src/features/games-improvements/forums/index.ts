import { Constants, GamesRegex } from '@ta-x-globals';
import { allConcurrently, waitForElement } from '@ta-x-utilities';
import { filterThreads } from './filter-threads';
import { changeToDefaultThread } from './default-thread';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.forum()) {
    return;
  }
  if (!(await waitForElement('body'))) {
    return;
  }

  changeToDefaultThread();

  document.body.classList.add(
    Constants.Styles.ForumImprovements.featureJs,
    Constants.Styles.ForumImprovements.featureStyle
  );

  allConcurrently('Games Forum', [{ name: 'games-forum-filter-threads', task: filterThreads }]);
};

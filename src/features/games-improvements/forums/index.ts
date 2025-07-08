import { GamesRegex } from '@ta-x-globals';
import { allConcurrently, waitForElement } from '@ta-x-utilities';
import { filterThreads } from './filter-threads';
import { changeToDefaultThread } from './default-thread';
import styles from './styles';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.forum()) {
    return;
  }
  if (!(await waitForElement('body'))) {
    return;
  }

  changeToDefaultThread();

  document.body.classList.add(styles.jsForumImprovements, styles.forumImprovements);

  allConcurrently('Games Forum', [{ name: 'games-forum-filter-threads', task: filterThreads }]);
};

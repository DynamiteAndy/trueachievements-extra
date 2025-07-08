import { waitForElement, allConcurrently } from '@ta-x-utilities';
import { ForumRegex } from '@ta-x-globals';
import myThreads from './my-threads';
import viewBoard from './view-board';
import walkthroughs from './walkthroughs';
import styles from './styles';

export default async (): Promise<void> => {
  if (!ForumRegex.Test.all()) {
    return;
  }

  if (!(await waitForElement('body'))) {
    return;
  }

  document.body.classList.add(styles.jsForumImprovements, styles.forumImprovements);

  await allConcurrently('Forum Improvements', [
    { name: 'forum-improvements:my-threads', task: myThreads },
    { name: 'forum-improvements:view-board', task: viewBoard },
    { name: 'forum-improvements:walkthroughs', task: walkthroughs }
  ]);
};

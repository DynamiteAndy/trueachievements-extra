import { allConcurrently } from '@ta-x-lib';
import { ForumRegex } from '@ta-x-site';

import filterThreads from './filter-threads';

export default async (): Promise<void> => {
  if (!ForumRegex.Test.viewBoardUrlWithBoardId()) {
    return;
  }

  await allConcurrently('View Boards', [{ name: 'forum:view-board:filter-threads', task: filterThreads }]);
};

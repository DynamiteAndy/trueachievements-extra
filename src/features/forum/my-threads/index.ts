import { allConcurrently } from '@ta-x-lib';
import { ForumRegex } from '@ta-x-site';

import filterThreads from './filter-threads';

export default async (): Promise<void> => {
  if (!ForumRegex.Test.myThreadsUrl()) {
    return;
  }

  await allConcurrently('My Threads', [{ name: 'forum:my-threads:filter-threads', task: filterThreads }]);
};

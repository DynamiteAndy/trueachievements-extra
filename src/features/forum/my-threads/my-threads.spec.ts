import { ForumRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import filterThreads from './filter-threads';

import myThreads from '.';

describeEntry('forum/my-threads', {
  run: myThreads,
  page: () => vi.spyOn(ForumRegex.Test, 'myThreadsUrl'),
  batch: 'My Threads',
  tasks: [{ name: 'forum:my-threads:filter-threads', task: filterThreads }]
});

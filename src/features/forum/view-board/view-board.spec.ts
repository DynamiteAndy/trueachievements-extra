import { ForumRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import filterThreads from './filter-threads';

import viewBoard from '.';

describeEntry('forum/view-board', {
  run: viewBoard,
  page: () => vi.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId'),
  batch: 'View Boards',
  tasks: [{ name: 'forum:view-board:filter-threads', task: filterThreads }]
});

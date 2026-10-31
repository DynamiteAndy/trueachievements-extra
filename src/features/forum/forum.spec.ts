import { ForumRegex, GamesRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import myThreads from './my-threads';
import viewBoard from './view-board';
import viewThread from './view-thread';

import forum from '.';

// The same batch on either page
const tasks = [
  { name: 'forum:my-threads', task: myThreads },
  { name: 'forum:view-board', task: viewBoard },
  { name: 'forum:view-thread', task: viewThread }
];

describeEntry('forum on a forum page', {
  run: forum,
  page: () => {
    vi.spyOn(GamesRegex.Test, 'walkthroughUrl').mockReturnValue(false);
    return vi.spyOn(ForumRegex.Test, 'all');
  },
  batch: 'Forum',
  tasks
});

describeEntry('forum on a walkthrough page', {
  run: forum,
  page: () => {
    vi.spyOn(ForumRegex.Test, 'all').mockReturnValue(false);
    return vi.spyOn(GamesRegex.Test, 'walkthroughUrl');
  },
  batch: 'Forum',
  tasks
});

import { GamesRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import { changeToDefaultThread } from './default-thread';
import { filterThreads } from './filter-threads';

import forum from '.';

// The default thread has its own spec; here it only says whether it opened another tab
vi.mock('./default-thread', () => ({ changeToDefaultThread: vi.fn(async () => false) }));

describeEntry('game/forum', {
  run: forum,
  page: () => vi.spyOn(GamesRegex.Test, 'forum'),
  batch: 'Game Forum',
  tasks: [{ name: 'game:forum:filter-threads', task: filterThreads }],
  postsBack: vi.mocked(changeToDefaultThread),
  parsed: true
});

import { ForumRegex, GamesRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import showOwnerProgress from './show-owner-progress';
import rememberWalkthroughThread from './show-owner-progress/remember-walkthrough-thread';

import viewThread from '.';

describeEntry('forum/view-thread (a forum thread)', {
  run: viewThread,
  page: () => vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId'),
  batch: 'Forum Walkthroughs',
  tasks: [{ name: 'forum:view-thread:show-owner-progress', task: showOwnerProgress }]
});

describeEntry('forum/view-thread (a game walkthrough)', {
  run: viewThread,
  page: () => vi.spyOn(GamesRegex.Test, 'walkthroughUrl'),
  batch: 'Game Walkthroughs',
  tasks: [{ name: 'forum:view-thread:remember-walkthrough-thread', task: rememberWalkthroughThread }]
});

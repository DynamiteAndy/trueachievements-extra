import { settings } from '@ta-x-storage';

import { describeThreadFilterGate } from '../../shared/filter-threads.spec-helpers';

import filterThreads from '.';

const { forum } = settings;

// The gate in front of the shared filter (its own spec covers the filtering): a board uses the forum's filter and
// keywords. The shared filter reads the same thread rows on a board as in my threads, so this uses that fixture.
describeThreadFilterGate('forum/view-board/filter-threads', {
  run: filterThreads,
  // Not my threads' own settings
  live: [forum.threadFilter, forum.threadFilterKeywords],
  // My threads' own settings don't apply on a board
  settings: {
    'forum.myThreads.overrideForumThreadFilter': true,
    'forum.myThreads.threadFilter': true,
    'forum.myThreads.threadFilterKeywords': ['unobtainables']
  },
  rows: [
    {
      name: 'should hide nothing with the forum filter off',
      settings: { 'forum.threadFilter': false },
      expected: ['shown', 'shown']
    },
    {
      name: "should filter with the forum's keywords when on",
      settings: { 'forum.threadFilter': true },
      expected: ['true', 'shown']
    }
  ]
});

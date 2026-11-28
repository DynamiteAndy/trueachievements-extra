import { settings } from '@ta-x-storage';

import { describeThreadFilterGate } from '../../shared/filter-threads.spec-helpers';

import filterThreads from '.';

const { forum } = settings;
const { myThreads } = forum;

// The gate in front of the shared filter (its own spec covers the filtering): my threads inherits the forum's
// filter and keywords unless its override is on.
describeThreadFilterGate('forum/my-threads/filter-threads', {
  run: filterThreads,
  live: [
    myThreads.overrideForumThreadFilter,
    myThreads.threadFilter,
    myThreads.threadFilterKeywords,
    forum.threadFilter,
    forum.threadFilterKeywords
  ],
  settings: { 'forum.myThreads.threadFilterKeywords': ['unobtainables'] },
  rows: [
    {
      name: "should filter with the forum's keywords, without its own override",
      settings: { 'forum.threadFilter': true },
      expected: ['true', 'shown']
    },
    {
      name: 'should filter with its own keywords, with its override on',
      settings: {
        'forum.threadFilter': false,
        'forum.myThreads.overrideForumThreadFilter': true,
        'forum.myThreads.threadFilter': true
      },
      expected: ['shown', 'true']
    },
    {
      name: 'should hide nothing with its override on and its own filter off, though the forum filter is on',
      settings: {
        'forum.threadFilter': true,
        'forum.myThreads.overrideForumThreadFilter': true,
        'forum.myThreads.threadFilter': false
      },
      expected: ['shown', 'shown']
    }
  ]
});

import { settings } from '@ta-x-storage';

import { describeThreadFilterGate } from '../../forum/shared/filter-threads.spec-helpers';

import { filterThreads } from './filter-threads';

const { forum } = settings;
const { forum: gameForum } = settings.game;

// The gate in front of the shared forum filter (its own spec covers the filtering): a game's forum inherits the
// forum's filter and keywords unless its override is on. The shared filter reads the same thread rows here as in my
// threads, so this uses that fixture.
describeThreadFilterGate('game/forum/filter-threads', {
  run: filterThreads,
  live: [
    gameForum.overrideForumThreadFilter,
    gameForum.threadFilter,
    gameForum.threadFilterKeywords,
    forum.threadFilter,
    forum.threadFilterKeywords
  ],
  settings: { 'game.forum.threadFilterKeywords': ['unobtainables'] },
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
        'game.forum.overrideForumThreadFilter': true,
        'game.forum.threadFilter': true
      },
      expected: ['shown', 'true']
    },
    {
      name: 'should hide nothing with its override on and its own filter off, though the forum filter is on',
      settings: {
        'forum.threadFilter': true,
        'game.forum.overrideForumThreadFilter': true,
        'game.forum.threadFilter': false
      },
      expected: ['shown', 'shown']
    }
  ]
});

import { getAccordions, getSettings, setSettings, shownSettings } from '@ta-x-test';

import { ForumSettings } from './ForumSettings';

describe('ForumSettings', () => {
  test('should show every setting while the settings it depends on are on, each saving to its own', () => {
    setSettings({
      'forum.threadFilter': true,
      'forum.myThreads.overrideForumThreadFilter': true,
      'forum.myThreads.threadFilter': true
    });

    expect(getSettings(<ForumSettings />)).toEqual([
      ['ta-x-forum-thread-filter', 'forum.threadFilter'],
      ['ta-x-forum-thread-filter-keywords', 'forum.threadFilterKeywords'],
      ['ta-x-forum-my-threads-override-forum-thread-filter', 'forum.myThreads.overrideForumThreadFilter'],
      ['ta-x-forum-my-threads-thread-filter', 'forum.myThreads.threadFilter'],
      ['ta-x-forum-my-threads-thread-filter-keywords', 'forum.myThreads.threadFilterKeywords'],
      ['ta-x-forum-view-thread-show-owner-progress', 'forum.viewThread.showOwnerProgress']
    ]);
  });

  test('should put them in accordions', () => {
    expect(getAccordions(<ForumSettings />)).toEqual(['My Threads', 'Walkthrough Threads']);
  });

  test('should leave out the settings that depend on the thread filters and the My Threads override while that is off', () => {
    expect(shownSettings(<ForumSettings />)).toEqual([
      'ta-x-forum-thread-filter',
      'ta-x-forum-my-threads-override-forum-thread-filter',
      'ta-x-forum-view-thread-show-owner-progress'
    ]);
  });
});

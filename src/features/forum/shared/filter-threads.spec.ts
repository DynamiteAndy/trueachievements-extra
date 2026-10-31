import { settings } from '@ta-x-storage';
import { changeSettingLive, find, hiddenThreads, setHtml, setSettings, stillParsing, tick } from '@ta-x-test';

import { applyThreadFilters, filterThreadsWhileOn } from './filter-threads';

describe('forum/shared/filter-threads', () => {
  describe('my threads', () => {
    beforeEach(() => {
      setHtml('@ta-x-test-views/forum-thread-list/my-threads.html');
    });

    test.each([
      {
        name: 'a thread with unread posts, its title in a plain paragraph',
        filters: ['free content'],
        hidden: ['true', 'shown']
      },
      { name: 'a read thread after an unread one', filters: ['unobtainables'], hidden: ['shown', 'true'] },
      { name: 'a thread whatever the case of its keyword', filters: ['FREE Content'], hidden: ['true', 'shown'] },
      { name: 'nothing without filters', filters: [], hidden: ['shown', 'shown'] }
    ])('should hide $name', async ({ filters, hidden }) => {
      await applyThreadFilters(filters);

      expect(hiddenThreads()).toEqual(hidden);
    });

    test.each([
      { name: 'say which filter hid the thread', filters: ['walkthrough', 'free content'], named: 'free content' },
      {
        name: 'name the first filter the title has, when it has several',
        filters: ['content', 'free content'],
        named: 'content'
      }
    ])('should $name', async ({ filters, named }) => {
      await applyThreadFilters(filters);

      expect(find('main li:not(.header)').textContent).toContain(`Hidden by filter "${named}"`);
    });
  });

  describe('a game forum', () => {
    beforeEach(() => {
      setHtml('@ta-x-test-views/forum-thread-list/game-forum-filter-set.html');
    });

    test('should hide the threads whose titles match, by their title only', async () => {
      await applyThreadFilters(['xbox sale round-up']);

      expect(hiddenThreads()).toEqual(['shown', 'true', 'shown', 'true']);
    });
  });

  // The board is in the page's own markup, but so are its threads, which may not all be parsed yet
  describe('while the page is still loading', () => {
    beforeEach(() => {
      setHtml('@ta-x-test-views/forum-thread-list/my-threads.html');
    });

    test('should wait until the page is parsed before reading the threads', async () => {
      const finishParsing = stillParsing();

      const filtering = applyThreadFilters(['free content']);
      await tick();

      expect(hiddenThreads()).toEqual(['shown', 'shown']);

      finishParsing();
      await filtering;

      expect(hiddenThreads()).toEqual(['true', 'shown']);
    });

    test('should do nothing on a page without a board', async () => {
      find('main').remove();

      const giveBack = await applyThreadFilters(['free content']);

      // Nothing hidden, so its give-back has nothing to do
      expect(() => giveBack()).not.toThrow();
    });
  });

  // What each page's gate runs (their specs: describeThreadFilterGate), here with the forum-wide settings
  describe('filterThreadsWhileOn', () => {
    const { threadFilter, threadFilterKeywords } = settings.forum;
    // Starts it, stopping it when the test ends, and lets the parsed page's filtering finish
    const start = async (): Promise<void> => {
      onTestFinished(filterThreadsWhileOn(threadFilter, threadFilterKeywords));
      await tick();
    };

    beforeEach(() => {
      setHtml('@ta-x-test-views/forum-thread-list/my-threads.html');
      setSettings({
        'forum.threadFilter': true,
        'forum.threadFilterKeywords': ['free content']
      });
    });

    test('should hide nothing when turned off while the page is still being parsed', async () => {
      const finishParsing = stillParsing();
      // Every thread hidden at any moment, not only at the end (hidden and given straight back flashes)
      let everHidden = 0;
      const watcher = new MutationObserver(() => {
        everHidden = Math.max(everHidden, hiddenThreads().filter((hidden) => hidden === 'true').length);
      });
      watcher.observe(document.body, { attributes: true, subtree: true, childList: true });
      onTestFinished(() => watcher.disconnect());
      await start();

      await changeSettingLive(threadFilter, false);
      finishParsing();
      await tick();
      await tick();

      expect(everHidden).toBe(0);
    });

    test('should filter again with the new keywords when they change, giving back the threads they no longer match', async () => {
      await start();
      expect(hiddenThreads()).toEqual(['true', 'shown']);

      await changeSettingLive(threadFilterKeywords, ['unobtainables']);

      expect(hiddenThreads()).toEqual(['shown', 'true']);
    });
  });
});

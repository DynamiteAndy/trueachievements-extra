import { callAll, timed } from '@ta-x-lib';
import { whenParsed } from '@ta-x-page';
import { settingsFrom, whileSetting } from '@ta-x-storage';
import { hideRow } from '@ta-x-ui';

import type { EffectiveSetting, Setting } from '@ta-x-storage';

// Hides every thread whose title has one of the filters in it; returns what gives them all back. Turned off (`aborted`)
// while the board is still being parsed, it hides nothing
export const applyThreadFilters = async (filters: string[], aborted?: AbortSignal): Promise<() => void> => {
  const giveBacks: (() => void)[] = [];
  const giveAllBack = (): void => callAll(giveBacks);

  if (!filters.length) {
    return giveAllBack;
  }

  // Every thread is read, so not before the board has been parsed
  await whenParsed();
  const board = document.querySelector('main .view-board, main .messageboard-index');

  if (!board || aborted?.aborted) {
    return giveAllBack;
  }

  timed('Thread filter', () => {
    // Every title is read before any thread is hidden: reading one after a hide makes the browser lay the page out again
    const matches = [...board.querySelectorAll<HTMLElement>('li:not(.header)')].flatMap((thread) => {
      // The first link in the thread's text: in .topic on a board, a plain div on My Threads, and in a plain <p> while
      // the thread has unread posts (p.read once read)
      const threadTitleAnchor = thread.querySelector<HTMLAnchorElement>('.desc > div:not(.stack) > p:first-child > a');
      if (!threadTitleAnchor) {
        return [];
      }

      const title = threadTitleAnchor.innerText.trim().toLowerCase();
      const activeFilter = filters.find((filter) => title.includes(filter.toLowerCase()));

      return activeFilter ? [{ threadTitleAnchor, activeFilter }] : [];
    });

    for (const { threadTitleAnchor, activeFilter } of matches) {
      giveBacks.push(
        hideRow({
          element: threadTitleAnchor,
          method: 'forum',
          hiddenBy: `filter "${activeFilter}"`
        })
      );
    }
  });

  return giveAllBack;
};

// A page's thread filter, applied live: while it's on, its threads are filtered; a change of keywords gives every
// thread back and filters again, and turning it off gives them all back. Effective settings register every setting
// their values come from (the override, their own, the forum-wide ones), so changing any of them needs no reload.
// Returns the stop
export const filterThreadsWhileOn = (
  filter: Setting<boolean> | EffectiveSetting<boolean>,
  keywords: Setting<string[]> | EffectiveSetting<string[]>
): (() => void) =>
  whileSetting(
    settingsFrom(filter, keywords),
    () => filter.value && keywords.value.length > 0,
    (aborted) => applyThreadFilters(keywords.peek(), aborted)
  );

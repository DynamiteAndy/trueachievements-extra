import { effectiveSettings } from '@ta-x-storage';

import { filterThreadsWhileOn } from '../../forum';

const { threadFilter, threadFilterKeywords } = effectiveSettings.gameForum;

// A game's forum filtered while its effective thread filter is on, live: its override, its own filter and keywords, or
// the forum-wide ones (returns the stop)
export const filterThreads = (): (() => void) => filterThreadsWhileOn(threadFilter, threadFilterKeywords);

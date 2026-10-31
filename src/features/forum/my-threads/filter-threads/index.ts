import { effectiveSettings } from '@ta-x-storage';

import { filterThreadsWhileOn } from '../../shared';

const { threadFilter, threadFilterKeywords } = effectiveSettings.myThreads;

// My Threads filtered while its effective thread filter is on, live: its override, its own filter and keywords, or the
// forum-wide ones (returns the stop)
export default (): (() => void) => filterThreadsWhileOn(threadFilter, threadFilterKeywords);

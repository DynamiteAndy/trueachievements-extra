import { settings } from '@ta-x-storage';

import { filterThreadsWhileOn } from '../../shared';

const { forum } = settings;

// A board's threads filtered while the thread filter is on, live (returns the stop)
export default (): (() => void) => filterThreadsWhileOn(forum.threadFilter, forum.threadFilterKeywords);

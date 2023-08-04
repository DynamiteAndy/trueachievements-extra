import { myThreads } from '@ta-x-globals';
import { applyThreadFilters } from '../shared';

export const filterThreads = (): void => {
  if (!myThreads.myThreadsThreadFilter) return;

  applyThreadFilters(myThreads.threadFilterKeywords);
};

export default { filterThreads };

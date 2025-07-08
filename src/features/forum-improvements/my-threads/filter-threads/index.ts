import { myThreads } from '@ta-x-globals';
import { applyThreadFilters } from '../../shared';

export default (): void => {
  if (!myThreads.myThreadsThreadFilter) {
    return;
  }

  applyThreadFilters(myThreads.threadFilterKeywords);
};

import { gameForums } from '@ta-x-globals';
import { applyThreadFilters } from '../../forum-improvements/shared';

export const filterThreads = (): void => {
  if (!gameForums.gameForumsThreadFilter) return;

  applyThreadFilters(gameForums.threadFilterKeywords);
};

export default { filterThreads };
import { forumImprovements } from '@ta-x-globals';
import { applyThreadFilters } from '../shared';

export const filterThreads = (): void => {
  if (!forumImprovements.forumImprovementsThreadFilter) return;

  applyThreadFilters(forumImprovements.threadFilterKeywords);
};

export default { filterThreads };
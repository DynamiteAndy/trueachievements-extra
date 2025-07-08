import { forumImprovements } from '@ta-x-globals';
import { applyThreadFilters } from '../../shared';

export default (): void => {
  if (!forumImprovements.forumImprovementsThreadFilter) {
    return;
  }

  applyThreadFilters(forumImprovements.threadFilterKeywords);
};

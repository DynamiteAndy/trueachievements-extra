import { ForumRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import filterThreads from './filter-threads';

export default async (): Promise<void> => {
  if (!ForumRegex.Test.viewBoardUrlWithBoardId()) {
    return;
  }

  allConcurrently('View Boards', [{ name: 'view-board-filter-threads', task: filterThreads }]);
};

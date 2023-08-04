import { ForumRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { filterThreads } from './filter-threads';

export default async (): Promise<void> => {
  if (!ForumRegex.Test.myTheadsUrl()) return;

  allConcurrently('My Theads', [{ name: 'my-threads-filter-threads', task: filterThreads }]);
};

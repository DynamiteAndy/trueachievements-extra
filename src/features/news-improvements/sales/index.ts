import { allConcurrently } from '@ta-x-utilities';
import autoSortBy from './auto-sort-by';

export default async (): Promise<void> => {
  allConcurrently('Sales News', [{ name: 'sales-auto-sort-by', task: autoSortBy }]);
};

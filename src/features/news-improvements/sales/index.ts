import { allConcurrently } from '@ta-x-utilities';
import collapsibleGroups from './collapsible-groups';
import autoSortBy from './auto-sort-by';
import hideItems from './hide-items';

export default async (): Promise<void> => {
  allConcurrently('Sales News', [
    { name: 'sales-auto-sort-by', task: autoSortBy },
    { name: 'sales-hide-items', task: hideItems },
    { name: 'sales-collapsible-groups', task: collapsibleGroups }
  ]);
};

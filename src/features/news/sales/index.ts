import { allConcurrently } from '@ta-x-lib';
import { whenParsed } from '@ta-x-page';

import autoSortBy from './auto-sort-by';
import collapsibleGroups from './collapsible-groups';
import hideAdRows from './hide-ad-rows';
import hideItems from './hide-items';
import highlightWishlistItems from './highlight-wishlist-items';
import { saleTables as saleTablesSelector } from './sale-tables';

// The table features read every sale table, so they start once the article is parsed, and only if it has one the
// site sorts
const saleTables = async (): Promise<void> => {
  await whenParsed();

  if (!document.querySelector(`.newsitem ${saleTablesSelector} [data-sort]`)) {
    return;
  }

  // Each applies live, handing back its stop, which nothing here needs
  await allConcurrently<unknown>('Sale Tables', [
    { name: 'news:sales:auto-sort-by', task: autoSortBy },
    { name: 'news:sales:hide-items', task: hideItems },
    { name: 'news:sales:highlight-wishlist-items', task: highlightWishlistItems },
    { name: 'news:sales:collapsible-groups', task: collapsibleGroups }
  ]);
};

// Hiding the ad rows only needs <body>, so it doesn't wait for the tables
export default async (): Promise<void> => {
  await allConcurrently('Sales News', [
    { name: 'news:sales:hide-ad-rows', task: hideAdRows },
    { name: 'news:sales:tables', task: saleTables }
  ]);
};

import { HideableRowAttributes as hideableRowAttributes } from '@ta-x-ui';

import { saleRows } from './sale-tables';

// Each row of a sale article's tables, in order, as [its first link's href, or 'ad row' for the site's ad rows,
// whether it's hidden]
export const saleRowStates = (): [string, boolean][] =>
  [...document.querySelectorAll(saleRows)].map((row) => [
    row.querySelector('a')?.getAttribute('href') ?? 'ad row',
    row.getAttribute(hideableRowAttributes.rowHidden) === 'true'
  ]);

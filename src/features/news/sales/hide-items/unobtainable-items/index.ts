import { callAll } from '@ta-x-lib';
import { settings, whileSetting } from '@ta-x-storage';

import { saleRows } from '../../sale-tables';
import { hideSaleRow } from '../hide-sale-row';

const { hideUnobtainableItems } = settings.news.sales;

// Hides each sale row flagged unobtainable; returns what gives them back
const hideUnobtainableRows = (): (() => void) => {
  const giveBacks = [...document.querySelectorAll<HTMLTableRowElement>(saleRows)]
    .filter((itemOnSale) => itemOnSale.querySelector('[src="/images/achievementflags/unobtainable.png"]') !== null)
    .map((itemOnSale) => hideSaleRow(itemOnSale, 'Unobtainable Items'));

  return () => callAll(giveBacks);
};

// While the setting is on, live: turned off, the rows come back. Returns the stop
export default (): (() => void) =>
  whileSetting([hideUnobtainableItems], () => hideUnobtainableItems.value, hideUnobtainableRows);

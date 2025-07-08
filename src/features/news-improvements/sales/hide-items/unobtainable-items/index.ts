import { newsImprovements } from '@ta-x-globals';
import { pubSub } from '@ta-x-components';

const applyBody = async (): Promise<void> => {
  const itemsOnSale = [...document.querySelectorAll('table.sale tbody tr')] as HTMLTableCellElement[];

  for (const itemOnSale of itemsOnSale) {
    const hideRow = itemOnSale.querySelector('[src="/images/achievementflags/unobtainable.png"]') !== null;

    if (hideRow) {
      pubSub.publish('hideableRow:hide', { element: itemOnSale, method: 'table', filterText: 'Hidden by "Hide Unobtainable Items"' });
    }
  }
};

export default async (): Promise<void> => {
  if (!newsImprovements.sales.hideUnobtainableItems) {
    return;
  }

  await applyBody();
};

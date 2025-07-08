import { newsImprovements } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { pubSub } from '@ta-x-components';

const applyBody = async (): Promise<void> => {
  const itemsOnSale = [...document.querySelectorAll('table.sale tbody tr')] as HTMLTableCellElement[];
  await allConcurrently(
    'HideUnobtainableItems',
    itemsOnSale.map((itemOnSale: HTMLElement) => ({
      name: 'hide-unobtainable-items',
      task: async (): Promise<void> => {
        const hideRow = itemOnSale.querySelector('[src="/images/achievementflags/unobtainable.png"]') !== null;

        if (hideRow) {
          pubSub.publish('hideableRow:hide', { element: itemOnSale, method: 'table', filterText: 'Hidden by "Hide Unobtainable Items"' });
        }
      }
    }))
  );
};

export default async (): Promise<void> => {
  if (!newsImprovements.sales.hideUnobtainableItems) {
    return;
  }

  await applyBody();
};

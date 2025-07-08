import { newsImprovements } from '@ta-x-globals';
import { allConcurrently, waitForElement } from '@ta-x-utilities';
import hideOwnedItems from './owned-items';
import hideUnobtainableItems from './unobtainable-items';


export default async (): Promise<void> => {
  if (!newsImprovements.sales.hideOwnedItems && !newsImprovements.sales.hideUnobtainableItems ) {
    return;
  }

  const salesTable = await waitForElement('.newsitem .sale [data-sort]');
  if (!salesTable) {
    return;
  }

  await waitForElement('.author');

  allConcurrently('Hide Items', [
    { name: 'hide-items-owned', task: hideOwnedItems },
    { name: 'hide-items-unobtainable', task: hideUnobtainableItems },
  ]);
};

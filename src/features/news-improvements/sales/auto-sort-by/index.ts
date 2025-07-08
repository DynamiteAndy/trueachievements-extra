import { newsImprovements } from '@ta-x-globals';
import { allConcurrently, waitForAttributeChange, waitForElement } from '@ta-x-utilities';

const applyBody = async (): Promise<void> => {
  const saleTables = [...document.querySelectorAll('table.sale')] as HTMLElement[];

  await allConcurrently(
    'AutoSortBy - Tables',
    saleTables.map((saleTable: HTMLElement) => ({
      name: 'auto-sort-by-table',
      task: async (): Promise<void> => {
        const tableHeader = ([...saleTable.querySelectorAll('.headers [data-sort]')] as HTMLElement[]).find((th) =>
          newsImprovements.sales.autoSortByValue.includes(th.innerText.replace(' ', '-').toLowerCase().trim())
        );

        if (!tableHeader) {
          return;
        }

        do {
          tableHeader.click();

          await waitForAttributeChange(tableHeader, ['class'], 250);
        } while (!tableHeader.classList.contains(`sorting-${newsImprovements.sales.autoSortByOrder}`));
      }
    }))
  );
};

export default async (): Promise<void> => {
  if (!newsImprovements.sales.autoSortBy) {
    return;
  }
  if (newsImprovements.sales.autoSortByValue.includes('product') && newsImprovements.sales.autoSortByOrder === 'asc') {
    return;
  }

  const salesTable = await waitForElement('.newsitem .sale [data-sort]');
  if (!salesTable) {
    return;
  }

  await waitForElement('.author');

  await applyBody();
};

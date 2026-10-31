import { readFixtureDocument, required } from '@ta-x-test';

// One of the site's ad rows, as captured live: a cell spanning the table, holding an in-content ad slot (`div.dyn-lb`).
// The site's scripts add them once the page has loaded, so specs insert a copy where the site would
export const capturedAdRow = (): HTMLTableRowElement => {
  const slot = required(
    readFixtureDocument('@ta-x-test-views/sale-article/owned-picks-with-ad-row.html').querySelector('div.dyn-lb')
  );

  return document.importNode(required(slot.closest('tr')), true);
};

// The in-content ad slot alone, as the site also adds between a sale's groups
export const capturedAdSlot = (): Element => required(capturedAdRow().querySelector('div.dyn-lb'));

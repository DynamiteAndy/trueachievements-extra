import { callAll } from '@ta-x-lib';
import { mount } from '@ta-x-page';
import { settings, whileSetting } from '@ta-x-storage';

import { saleRows } from '../sale-tables';
import { signedInGamer } from '../signed-in-gamer';

import { storeId, wishlistOnSale, type WishlistOnSale } from './wishlist';
import { WishlistPill, type WishlistPillProps } from './WishlistPill';

const { highlightWishlistItems, highlightBundlesContainingWishlistItems } = settings.news.sales;

// Matched by store id, never by game link: a sale's edition and bundle rows link only their base game's page
const kindOf = (row: Element, wishlist: WishlistOnSale, withContaining: boolean): WishlistPillProps['kind'] | null => {
  const ids = [...row.querySelectorAll('a')].map(storeId).filter((id) => id !== null);

  if (ids.some((id) => wishlist.items.has(id))) {
    return 'item';
  }

  return withContaining && ids.some((id) => wishlist.containing.has(id)) ? 'containing' : null;
};

// Labels each sale row whose product is on the gamer's wishlist (and, with the second setting, each product containing
// one); returns what takes the labels away. Turned off while the wishlist is looked up, it labels nothing
const labelWishlistRows = async (aborted: AbortSignal): Promise<() => void> => {
  const unmounts: (() => void)[] = [];
  const takeAllAway = (): void => callAll(unmounts);
  const gamer = await signedInGamer();
  const wishlist = gamer ? await wishlistOnSale(gamer.gamerPage) : null;

  if (!wishlist || aborted.aborted) {
    return takeAllAway;
  }

  const withContaining = highlightBundlesContainingWishlistItems.peek();

  for (const row of document.querySelectorAll(saleRows)) {
    const kind = kindOf(row, wishlist, withContaining);
    // The site's ad rows have no link
    const name = row.querySelector('td:first-child a');

    if (kind && name?.parentNode) {
      unmounts.push(mount(<WishlistPill kind={kind} />, name.parentNode, name.nextSibling).unmount);
    }
  }

  return takeAllAway;
};

// While the setting is on, live: turned off, the labels go; the second setting changed labels the rows afresh.
// sales/index.ts starts it once the tables are parsed. Returns the stop
export default (): (() => void) =>
  whileSetting(
    [highlightWishlistItems, highlightBundlesContainingWishlistItems],
    () => {
      // Both read every time, so changing the second while on labels afresh; only the first decides whether it's on
      const [on] = [highlightWishlistItems.value, highlightBundlesContainingWishlistItems.value];

      return on;
    },
    labelWishlistRows
  );

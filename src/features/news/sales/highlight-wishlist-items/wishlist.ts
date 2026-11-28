import { fetchOk, memoizeFetchExtract } from '@ta-x-fetch';
import { siteUrl } from '@ta-x-site';

// A store id: 12 letters and digits (9MZ8F6B0SL7M)
const storeIdPart = /^[a-z0-9]{12}$/i;

// The Xbox store id a buy link goes to. The site's buy links (a sale row's price, a wishlist listing's) are
// `/ext?u=<store address>`, the address ending in the product's store id, which is the same in every region; a few
// add a SKU after it (`/9N5DLKQ7W3QX/0010`), so the id is the last part of the address shaped like one. Null for any
// other link
export const storeId = (link: Element | null): string | null => {
  const href = link?.getAttribute('href');
  if (!href) {
    return null;
  }

  try {
    const ext = new URL(href, siteUrl);
    const store = ext.pathname === '/ext' ? ext.searchParams.get('u') : null;
    const id = store ? new URL(store).pathname.split('/').findLast((part) => storeIdPart.test(part)) : undefined;

    return id?.toUpperCase() ?? null;
  } catch {
    return null;
  }
};

// The store ids of what the gamer's wishlist has on sale: the wishlisted games and DLC themselves, and the products
// containing one of them (editions, bundles, passes), which the wishlist lists beside each item
export interface WishlistOnSale {
  items: Set<string>;
  containing: Set<string>;
}

// A listing is a product containing the item when the site calls it a bundle, or notes what of it is on the wishlist
// ("2 DLC, 1 on your wishlist"); the item's own says "Single game" or "DLC only"
const isContaining = (listing: Element): boolean =>
  listing.querySelector('.wl-pill.bundle') !== null ||
  (listing.querySelector('.wl-title small')?.textContent.includes('on your wishlist') ?? false);

const add = (ids: Set<string>, link: Element | null): void => {
  const id = storeId(link);
  if (id) {
    ids.add(id);
  }
};

// Only the two lists of ids are cached, not the wishlist page, so a sale article opened later skips parsing it; a
// visit to the page reads them afresh. Its fetch is fetchOk's, looked up at each call
const fetchWishlistOnSale = memoizeFetchExtract<{ items: string[]; containing: string[] }>(
  (url, options) => fetchOk(url, options),
  (wishlist) => {
    const onSale: WishlistOnSale = { items: new Set(), containing: new Set() };

    for (const item of wishlist.querySelectorAll('.wl-item')) {
      // An item on sale as itself alone has its buy link in its head instead of a list of listings
      add(onSale.items, item.querySelector('.wl-head .wl-price a'));

      for (const listing of item.querySelectorAll('.wl-row')) {
        add(isContaining(listing) ? onSale.containing : onSale.items, listing.querySelector('.wl-cost a'));
      }
    }

    return { items: [...onSale.items], containing: [...onSale.containing] };
  },
  '#on-sale'
);

// Kept a shorter while than other fetched pages, as what's on sale changes
export const wishlistOnSale = async (gamerPage: string): Promise<WishlistOnSale> => {
  const url = `${gamerPage}/wishlist?sale=1`;
  const { items, containing } = await fetchWishlistOnSale(url, {}, { deleteAfter: { value: 1, period: 'hours' } });

  return { items: new Set(items), containing: new Set(containing) };
};

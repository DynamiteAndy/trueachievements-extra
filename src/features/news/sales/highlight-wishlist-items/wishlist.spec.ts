import * as taxFetch from '@ta-x-fetch';
import { emptyMemoizedFetches, readFixture, readFixtureDocument, required } from '@ta-x-test';

import { storeId, wishlistOnSale } from './wishlist';

describe('news/sales/highlight-wishlist-items/wishlist', () => {
  const gamerPage = 'https://www.trueachievements.com/gamer/Dynamite+Andy';

  describe('storeId', () => {
    const link = (href: string): HTMLAnchorElement => {
      const anchor = document.createElement('a');
      anchor.setAttribute('href', href);
      return anchor;
    };

    // The sale article spells the address's name part Age-of-Mythology-Retold--Obsidian-Mirror, the wishlist
    // age-of-mythology-retold--obsidian-mirror: only the id is the same
    test("should read the store id at the end of a buy link's store address, in capitals", () => {
      const buyLink = required(
        readFixtureDocument('@ta-x-test-views/sale-article/black-friday-wishlist-dlc.html').querySelector(
          'a[href^="/ext"][href*="Obsidian-Mirror"]'
        )
      );

      expect(storeId(buyLink)).toBe('9MZ8F6B0SL7M');
      expect(storeId(link('/ext?u=https%3A%2F%2Fwww.xbox.com%2Fen-GB%2Fgames%2Fstore%2Fx%2F9mz8f6b0sl7m'))).toBe(
        '9MZ8F6B0SL7M'
      );
    });

    // A few of the site's buy links add a SKU after the id (seen on the Black Friday sale's in-game currency)
    test('should read the store id before a SKU at the end of the address', () => {
      const address = 'https://www.xbox.com/games/store/NAEU-TERA-Coin-1000/9N5DLKQ7W3QX/0010';

      expect(storeId(link(`/ext?u=${encodeURIComponent(address)}`))).toBe('9N5DLKQ7W3QX');
    });

    test.each([
      ['a buy link whose store address has no id', '/ext?u=https%3A%2F%2Fwww.xbox.com%2Fgames%2Fstore%2Fx%2F0010'],
      ['a game link', '/game/Rebel-Galaxy/achievements'],
      ['a product link', '/products/60067/DEATHLOOP-Deluxe-Pack'],
      ['a buy link without a store address', '/ext'],
      ['a buy link whose store address is not an address', '/ext?u=not%20an%20address'],
      ['a buy link whose store address has no path', '/ext?u=https%3A%2F%2Fwww.xbox.com']
    ])('should give null for %s', (_, href) => {
      expect(storeId(link(href))).toBeNull();
    });

    test('should give null for no link, or a link with no address', () => {
      expect(storeId(null)).toBeNull();
      expect(storeId(document.createElement('a'))).toBeNull();
    });
  });

  describe('wishlistOnSale', () => {
    let realCache = (): void => undefined;
    beforeEach(() => {
      realCache = emptyMemoizedFetches();
    });
    const answer = (page: string) => vi.spyOn(taxFetch, 'fetchOk').mockImplementation(async () => new Response(page));

    test('should split the listings into the wishlisted items themselves and the products containing them', async () => {
      answer(readFixture('@ta-x-test-views/gamer-wishlist/on-sale.html'));

      const { items, containing } = await wishlistOnSale(gamerPage);

      expect([...items]).toEqual([
        // Obsidian Mirror's own listing ("DLC only")
        '9MZ8F6B0SL7M',
        // Monster Hunter Stories 3, Railway Empire: their "Game" listings
        '9NT1VLG29DG8',
        'BW8JQLJ2GDT8',
        // Rebel Galaxy: a single buy link in its head, no listings
        'C3MVXTCDKT77',
        // RuneScape: Dragonwilds, Starsand Island
        '9P402RWR63H4',
        '9P86LLDCL5CC'
      ]);
      expect([...containing]).toEqual([
        // The Expansion Pass: an add-on, but "2 DLC, 1 on your wishlist"
        '9N2Z26T7355C',
        // The editions and bundles ("Bundle")
        '9PL329PMRF57',
        '9NSF119BSP0M',
        '9PMT3JMG30R1',
        '9N72SM3MH0SR',
        '9P1LG9CJVH72',
        '9NLFW0TMBNVQ'
      ]);
    });

    test('should give nothing for a wishlist with nothing on sale', async () => {
      answer('<html><body><main></main></body></html>');

      const { items, containing } = await wishlistOnSale(gamerPage);

      expect([items.size, containing.size]).toEqual([0, 0]);
    });

    // Every sale article reads it: only the ids are kept, for an hour, so a later one parses no wishlist page
    test('should keep only the lists of ids, and read them from the cache the next time', async () => {
      realCache();
      const fetchSpy = answer(readFixture('@ta-x-test-views/gamer-wishlist/on-sale.html'));
      const url = `${gamerPage}/wishlist?sale=1`;

      const first = await wishlistOnSale(gamerPage);
      const parse = vi.spyOn(DOMParser.prototype, 'parseFromString');
      const again = await wishlistOnSale(gamerPage);

      expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(url, {});
      expect(parse).not.toHaveBeenCalled();
      expect(again).toEqual(first);
      expect(Object.keys(JSON.parse(required(await taxFetch.memoizedFetches.get(`${url}#on-sale`))))).toEqual([
        'items',
        'containing'
      ]);
      expect(await taxFetch.memoizedFetches.get(url)).toBeNull();
    });
  });
});

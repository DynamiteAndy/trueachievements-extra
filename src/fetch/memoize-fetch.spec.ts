import { fromNow } from '@ta-x-lib';
import { find, required, useFakeTimers } from '@ta-x-test';

import { MemoizeFetch, memoizedFetches, memoizeFetchExtract, refreshMemoizedExtracts } from './memoize-fetch';

describe('fetch/memoize-fetch (MemoizeFetch)', () => {
  const respond = (body: string) => vi.fn(async () => new Response(body));

  test('should fetch a page the first time and return the cached copy after that', async () => {
    const fetch = respond('<html>page</html>');
    const { memoizeFetch } = new MemoizeFetch(fetch);

    expect(await memoizeFetch('https://www.trueachievements.com/game/BLUD')).toBe('<html>page</html>');
    expect(await memoizeFetch('https://www.trueachievements.com/game/BLUD')).toBe('<html>page</html>');

    expect(fetch).toHaveBeenCalledExactlyOnceWith('https://www.trueachievements.com/game/BLUD', undefined);
  });

  test("should fetch the page when the cache can't be opened", async () => {
    // e.g. its database held up by another tab's connection: the open rejects once it gives up
    vi.spyOn(memoizedFetches, 'get').mockRejectedValueOnce(new Error('blocked'));
    vi.spyOn(memoizedFetches, 'set').mockRejectedValueOnce(new Error('blocked'));
    const fetch = respond('<html>page</html>');

    expect(await new MemoizeFetch(fetch).memoizeFetch('https://www.trueachievements.com/game/BLUD')).toBe(
      '<html>page</html>'
    );
    expect(fetch).toHaveBeenCalledExactlyOnceWith('https://www.trueachievements.com/game/BLUD', undefined);
  });

  test('should fetch again once the cached copy has expired', async () => {
    const fetch = respond('<html>page</html>');
    const { memoizeFetch } = new MemoizeFetch(fetch);

    await memoizeFetch(
      'https://www.trueachievements.com/game/BLUD',
      {},
      { deleteAfter: { value: -1, period: 'seconds' } }
    );
    await memoizeFetch('https://www.trueachievements.com/game/BLUD');

    expect(fetch.mock.calls).toEqual([
      ['https://www.trueachievements.com/game/BLUD', {}],
      ['https://www.trueachievements.com/game/BLUD', undefined]
    ]);
  });

  test('should keep a page for a day by default', async () => {
    useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-15T19:30:00Z') });
    const setSpy = vi.spyOn(memoizedFetches, 'set');

    await new MemoizeFetch(respond('<html>page</html>')).memoizeFetch('https://www.trueachievements.com/game/BLUD', {});

    expect(required(setSpy.mock.calls[0][2]).getTime()).toBe(
      new Date('2026-11-15T19:30:00Z').getTime() + 24 * 60 * 60 * 1000
    );
  });

  // Each page is its own record, so pages cached by different instances don't overwrite each other
  test("should keep every instance's cached pages", async () => {
    const pages = new MemoizeFetch(respond('<html>page</html>'));
    const guides = new MemoizeFetch(respond('<html>guide</html>'));

    await pages.memoizeFetch('https://www.trueachievements.com/game/BLUD');
    await guides.memoizeFetch('https://www.xboxachievements.com/game/blud/guide/');

    const fetch = respond('<html>refetched</html>');
    const later = new MemoizeFetch(fetch);
    expect(await later.memoizeFetch('https://www.trueachievements.com/game/BLUD')).toBe('<html>page</html>');
    expect(await later.memoizeFetch('https://www.xboxachievements.com/game/blud/guide/')).toBe('<html>guide</html>');
    expect(fetch).not.toHaveBeenCalled();
  });

  // A POST answered at an address another feature GETs keeps its own copy
  test('should cache a page under its cache key when given one, fetching its address', async () => {
    const fetch = vi.fn(async () => new Response('posted answer'));
    const memoize = new MemoizeFetch(fetch);
    await memoizedFetches.set('https://example.com/page', 'got page', fromNow({ value: 1, period: 'days' }));

    const body = await memoize.memoizeFetch(
      'https://example.com/page',
      { method: 'POST' },
      { cacheKey: 'https://example.com/page#posted' }
    );

    expect(body).toBe('posted answer');
    expect(fetch).toHaveBeenCalledExactlyOnceWith('https://example.com/page', { method: 'POST' });
    expect(await memoizedFetches.get('https://example.com/page#posted')).toBe('posted answer');
    expect(await memoizedFetches.get('https://example.com/page')).toBe('got page');
    expect(
      await memoize.memoizeFetch(
        'https://example.com/page',
        { method: 'POST' },
        { cacheKey: 'https://example.com/page#posted' }
      )
    ).toBe('posted answer');
    expect(fetch).toHaveBeenCalledOnce();
  });

  test('should replace a cached page with an updated copy', async () => {
    const fetch = respond('<html>page</html>');
    const { memoizeFetch, updateMemoizedFetch } = new MemoizeFetch(fetch);
    await memoizeFetch('https://www.trueachievements.com/win-xbox-games');

    await updateMemoizedFetch('https://www.trueachievements.com/win-xbox-games', '<html>opted in</html>');

    expect(await memoizeFetch('https://www.trueachievements.com/win-xbox-games')).toBe('<html>opted in</html>');
    expect(fetch).toHaveBeenCalledExactlyOnceWith('https://www.trueachievements.com/win-xbox-games', undefined);
  });

  // An instance with its own fetch (the walkthrough preview's public page) parses through its own fetch and cache
  test("should parse a page from the instance's own fetch, kept as it says", async () => {
    useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-15T19:30:00Z') });
    const fetch = respond('<html><body><h1>Xbox One Walkthrough</h1></body></html>');
    const setSpy = vi.spyOn(memoizedFetches, 'set');

    const page = await new MemoizeFetch(fetch).memoizeFetchDocument(
      'https://www.trueachievements.com/game/Xbox-One/walkthrough',
      { method: 'POST' },
      { deleteAfter: { value: 4, period: 'hours' } }
    );

    expect(find('h1', page).textContent).toBe('Xbox One Walkthrough');
    expect(fetch).toHaveBeenCalledExactlyOnceWith('https://www.trueachievements.com/game/Xbox-One/walkthrough', {
      method: 'POST'
    });
    expect(required(setSpy.mock.calls[0][2])).toEqual(new Date('2026-11-15T23:30:00Z'));
  });
});

describe('fetch/memoize-fetch (memoizeFetchExtract)', () => {
  const url = 'https://www.trueachievements.com/gamer/Dynamite+Andy/wishlist?sale=1';
  const page = '<html><body><a href="/game/BLUD">BLUD</a><a href="/game/Hades">Hades</a></body></html>';
  const links = (document: Document): string[] =>
    [...document.querySelectorAll('a')].map((link) => link.getAttribute('href') ?? '');

  test('should keep only what it reads from the page, under its cache key, and read that back the next time', async () => {
    useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-15T19:30:00Z') });
    const fetch = vi.fn(async () => new Response(page));
    const setSpy = vi.spyOn(memoizedFetches, 'set');
    const read = vi.fn(links);
    const extract = memoizeFetchExtract(fetch, read, '#links');
    const options = { deleteAfter: { value: 1, period: 'hours' } } as const;

    expect(await extract(url, { method: 'POST' }, options)).toEqual(['/game/BLUD', '/game/Hades']);
    expect(await extract(url, { method: 'POST' }, options)).toEqual(['/game/BLUD', '/game/Hades']);

    expect(fetch).toHaveBeenCalledExactlyOnceWith(url, { method: 'POST' });
    expect(read).toHaveBeenCalledOnce();
    expect(setSpy.mock.calls).toEqual([
      [`${url}#links`, '["/game/BLUD","/game/Hades"]', new Date('2026-11-15T20:30:00Z')]
    ]);
    expect(await memoizedFetches.get(url)).toBeNull();
  });

  // For a page got another way (a post's answer): what's read from it is kept as the extract, as long as asked
  test('should keep what it reads from a page it is given as the extract, read back without a fetch', async () => {
    useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-15T19:30:00Z') });
    const fetch = vi.fn(async () => new Response(page));
    const extract = memoizeFetchExtract(fetch, links, '#given');
    const given = new DOMParser().parseFromString('<a href="/game/Hades">Hades</a>', 'text/html');

    await extract.update(url, given, { deleteAfter: { value: 1, period: 'hours' } });

    expect(await extract(url, {})).toEqual(['/game/Hades']);
    expect(fetch).not.toHaveBeenCalled();
    vi.setSystemTime(new Date('2026-11-15T20:30:01Z'));
    expect(await memoizedFetches.get(`${url}#given`)).toBeNull();
  });

  // A visit to the page reads what's kept from it afresh, keeping the copy's expiry; an extract not cached stays so
  test("should write what's read from a visited page over its cached extract, and only a cached one", async () => {
    useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-15T19:30:00Z') });
    const extract = memoizeFetchExtract(
      vi.fn(async () => new Response(page)),
      links,
      '#visited'
    );
    await extract(url, {}, { deleteAfter: { value: 1, period: 'hours' } });
    const visited = new DOMParser().parseFromString('<a href="/game/Hades">Hades</a>', 'text/html');
    const other = 'https://www.trueachievements.com/gamer/Someone/wishlist?sale=1';

    await refreshMemoizedExtracts(url, visited);
    await refreshMemoizedExtracts(other, visited);

    expect(await memoizedFetches.get(`${url}#visited`)).toBe('["/game/Hades"]');
    expect(await memoizedFetches.get(`${other}#visited`)).toBeNull();
    vi.setSystemTime(new Date('2026-11-15T20:30:01Z'));
    expect(await memoizedFetches.get(`${url}#visited`)).toBeNull();
  });
});

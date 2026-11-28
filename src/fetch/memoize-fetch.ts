import { type Duration, fromNow } from '@ta-x-lib';
import { IndexedDbService } from '@ta-x-storage';

import { fetchOk } from './fetch-ok';

export type MemoizedFetchOptions = {
  deleteAfter?: Duration;
  // What the page is cached under, when its address alone doesn't tell it apart (a POST answered at an address another
  // feature GETs). The address by default
  cacheKey?: string;
};

// When a fetched page should be fetched again: `deleteAfter` from now (a day by default, so counts and lists the
// script reads from other pages stay current)
const expiryTime = ({ deleteAfter = { value: 1, period: 'days' } }: MemoizedFetchOptions = {}): Date =>
  fromNow(deleteAfter);

// Fetched pages, one record per URL with its own expiry, shared by every MemoizeFetch
export const memoizedFetches = new IndexedDbService<string>('trueachievements-extra', 'memoized-fetches');

export class MemoizeFetch {
  private fetch: (url: string, options?: RequestInit) => Promise<Response>;

  constructor(_fetch: (url: string, options?: RequestInit) => Promise<Response>) {
    this.fetch = _fetch;
  }

  memoizeFetch = async (
    url: string,
    fetchOpts?: RequestInit,
    memoizeOptions?: MemoizedFetchOptions
  ): Promise<string> => {
    // The cache only saves fetches, so a cache that can't be read or written just means fetching
    const cachedResponse = await memoizedFetches.get(memoizeOptions?.cacheKey ?? url).catch(() => null);

    if (cachedResponse !== null) {
      return cachedResponse;
    }

    const body = await (await this.fetch(url, fetchOpts)).text();

    await this.updateMemoizedFetch(url, body, memoizeOptions);
    return body;
  };

  // A site page, fetched (or read from the cache) and parsed, ready to query
  memoizeFetchDocument = async (
    url: string,
    fetchOpts: RequestInit = {},
    memoizeOptions?: MemoizedFetchOptions
  ): Promise<Document> =>
    new DOMParser().parseFromString(await this.memoizeFetch(url, fetchOpts, memoizeOptions), 'text/html');

  // Features call these without waiting, so a cache failure is ignored rather than left unhandled
  updateMemoizedFetch = async (url: string, body: string, memoizeOptions?: MemoizedFetchOptions): Promise<void> => {
    await memoizedFetches.set(memoizeOptions?.cacheKey ?? url, body, expiryTime(memoizeOptions)).catch(() => undefined);
  };
}

// Every extract's key suffix and reader, for refreshMemoizedExtracts
const extracts: { suffix: string; read: (page: Document) => unknown }[] = [];

type MemoizedExtract<T> = ((
  url: string,
  fetchOpts: RequestInit,
  memoizeOptions?: MemoizedFetchOptions
) => Promise<T>) & {
  // Keeps what `read` takes from `page` as the extract of `url`: for a page got some other way (a post's answer)
  update: (url: string, page: Document, memoizeOptions?: MemoizedFetchOptions) => Promise<void>;
};

// A memoized fetch of what `read` takes from a page, kept as JSON: for a large page read only for a little of it, so
// later reads skip parsing the whole page. `read` gives back a plain value (no Set or Map). It's kept at the page's
// address plus `suffix` (`#on-sale`), apart from the page itself, and a visit to the page reads it afresh
// (refreshMemoizedExtracts). `fetch` makes the request (fetchOk)
export const memoizeFetchExtract = <T>(
  fetch: (url: string, options?: RequestInit) => Promise<Response>,
  read: (page: Document) => T,
  suffix: string
): MemoizedExtract<T> => {
  const extracting = new MemoizeFetch(async (url, options) => {
    const page = new DOMParser().parseFromString(await (await fetch(url, options)).text(), 'text/html');
    return new Response(JSON.stringify(read(page)));
  });
  extracts.push({ suffix, read });
  const keyed = (url: string, memoizeOptions?: MemoizedFetchOptions): MemoizedFetchOptions => ({
    ...memoizeOptions,
    cacheKey: `${url}${suffix}`
  });

  return Object.assign(
    async (url: string, fetchOpts: RequestInit, memoizeOptions?: MemoizedFetchOptions) =>
      JSON.parse(await extracting.memoizeFetch(url, fetchOpts, keyed(url, memoizeOptions))) as T,
    {
      update: async (url: string, page: Document, memoizeOptions?: MemoizedFetchOptions) =>
        extracting.updateMemoizedFetch(url, JSON.stringify(read(page)), keyed(url, memoizeOptions))
    }
  );
};

// A visited page's extracts, read from it now and written over their cached copies, keeping each one's expiry, and
// only while it's cached (as refreshMemoizedFetch). Read before anything waits, so it's the page as given
export const refreshMemoizedExtracts = async (href: string, page: Document): Promise<void> => {
  const read = extracts.map(({ suffix, read: readPage }) => [`${href}${suffix}`, JSON.stringify(readPage(page))]);

  await Promise.all(read.map(([key, body]) => refreshMemoizedFetch(key, body)));
};

// The one memoized fetch features use, through fetchOk
const memoize = new MemoizeFetch(fetchOk);
export const memoizeFetch = memoize.memoizeFetch;
export const updateMemoizedFetch = memoize.updateMemoizedFetch;
export const memoizeFetchDocument = memoize.memoizeFetchDocument;

// Writes a newer copy of a page over its cached one, keeping the expiry it was cached with (each caller chose how long
// its pages stay), and only while it's still cached. A failed write is ignored, as the copy only saves a fetch
export const refreshMemoizedFetch = async (key: string, body: string): Promise<void> => {
  await memoizedFetches.replace(key, body).catch(() => undefined);
};

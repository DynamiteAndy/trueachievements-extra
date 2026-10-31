import * as taxFetch from '@ta-x-fetch';

// memoizeFetchDocument calls memoizeFetch inside its own module, out of reach of a spy on @ta-x-fetch, so specs that
// stub pages with vi.spyOn(taxFetch, 'memoizeFetch') route it through that spy (spyable thanks to the vi.mock in
// test/mocks/setup.ts).
export const fetchDocumentsThroughMemoizeFetch = () =>
  vi
    .spyOn(taxFetch, 'memoizeFetchDocument')
    .mockImplementation(async (...args) =>
      new DOMParser().parseFromString(await taxFetch.memoizeFetch(...args), 'text/html')
    );

// For a feature reading through memoizeFetchExtract, whose fetch a spec stubs with vi.spyOn(taxFetch, 'fetchOk'): the
// cache is left empty and answers at once, so a tick or two finishes a lookup (a real IndexedDB round trip takes
// longer). Returns what puts the real cache back, for the test of what's cached
export const emptyMemoizedFetches = (): (() => void) => {
  const get = vi.spyOn(taxFetch.memoizedFetches, 'get').mockResolvedValue(null);
  const set = vi.spyOn(taxFetch.memoizedFetches, 'set').mockResolvedValue(undefined);

  return () => {
    get.mockRestore();
    set.mockRestore();
  };
};

// What a fetched page with nothing we read in it looks like
export const emptyPage = '<html><body><main></main></body></html>';

// Answers memoizeFetch with the page for the first key the URL contains, in order, else an empty page
export const fetchPagesByUrl = (pages: Record<string, string>) =>
  vi
    .spyOn(taxFetch, 'memoizeFetch')
    .mockImplementation(
      async (url: string) => Object.entries(pages).find(([part]) => url.includes(part))?.[1] ?? emptyPage
    );

// The fetch a test replaced first, put back once when it ends (a test can stub again, to answer differently)
let replacedFetch: typeof fetch | undefined;

// The page's own fetch for this test, answering as `answer` does: what the HTTP intercept wraps. The network mock's
// fetch (test/mocks/network.ts, which refuses every request) comes back when the test ends, even when it fails, so call
// it in the test or its `beforeEach` with no `afterEach` of its own. Not `vi.stubGlobal`: unstubbing every global would
// take the setup's Tampermonkey stubs too
export const stubPageFetch = <T extends (...args: Parameters<typeof fetch>) => Promise<Response>>(answer: T) => {
  if (replacedFetch === undefined) {
    replacedFetch = globalThis.fetch;
    onTestFinished(() => {
      globalThis.fetch = replacedFetch ?? globalThis.fetch;
      replacedFetch = undefined;
    });
  }
  const pageFetch = vi.fn(answer);
  globalThis.fetch = pageFetch;

  return pageFetch;
};

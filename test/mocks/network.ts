// Specs never reach the network. A fetch that no spec stubbed (happy-dom's own would really send it) is refused, and
// the test that was running when it was made fails, naming the address. A refused fetch alone isn't enough, since
// features catch fetch errors (e.g. show owner progress asks for a link instead). Specs stub `fetch` with
// `stubPageFetch` (@ta-x-test), which puts this one back when the test ends.
const unexpectedFetches: string[] = [];

const offlineFetch = async (input: RequestInfo | URL): Promise<Response> => {
  const url = input instanceof Request ? input.url : String(input);

  unexpectedFetches.push(url);
  throw new TypeError(`Specs don't reach the network: stub this fetch (${url})`);
};

Object.defineProperty(globalThis, 'fetch', { value: offlineFetch, writable: true, configurable: true });

afterEach(() => {
  if (unexpectedFetches.length > 0) {
    const urls = unexpectedFetches.splice(0);

    throw new Error(`A spec fetched from the network (stub it instead): ${urls.join(', ')}`);
  }
});

import { stubPageFetch } from './fetch';

// In order: the second test checks what the first left behind
describe('test/support/fetch stubPageFetch', { shuffle: false }, () => {
  const networkFetch = globalThis.fetch;

  test('should answer as given, the latest stub winning', async () => {
    stubPageFetch(async () => new Response('first'));
    const latest = stubPageFetch(async () => new Response('second'));

    expect(await (await fetch('https://example.com/')).text()).toBe('second');
    expect(latest).toHaveBeenCalledOnce();
  });

  test("should put the network mock's fetch back once the test that stubbed it ends", () => {
    expect(globalThis.fetch).toBe(networkFetch);
  });
});

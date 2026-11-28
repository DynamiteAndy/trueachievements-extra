import { logger } from '@ta-x-lib';
import { stubPageFetch } from '@ta-x-test';

import { httpIntercept } from './http-intercept';

describe('HttpInterceptService', () => {
  // What the spec replaces, put back after each test (not vi.unstubAllGlobals, which would take the setup's
  // Tampermonkey stubs too)
  const specXMLHttpRequest = globalThis.XMLHttpRequest;

  // By default the page's fetch answers every request with 200 "ok"
  let siteFetch: ReturnType<typeof stubPageFetch<() => Promise<Response>>>;
  beforeEach(() => {
    siteFetch = stubPageFetch(async () => new Response('ok'));
  });

  afterEach(() => {
    globalThis.XMLHttpRequest = specXMLHttpRequest;
  });

  test('delivers response events, with their request, to listeners', async () => {
    const seen: [string, number][] = [];

    httpIntercept.onResponse((event) => {
      seen.push([event.req.url, event.res.status]);
    });

    const res = await fetch('https://example.com/api');

    expect(seen).toEqual([['https://example.com/api', 200]]);
    expect(res.status).toBe(200);
  });

  test('should only intercept while something listens, leaving the page its own fetch otherwise', async () => {
    expect(httpIntercept.intercepting).toBe(false);
    expect(globalThis.fetch).toBe(siteFetch);

    const stopFirst = httpIntercept.onResponse(() => {});
    const stopSecond = httpIntercept.onResponse(() => {});
    const patchedFetch = globalThis.fetch;

    expect(httpIntercept.intercepting).toBe(true);
    expect(patchedFetch).not.toBe(siteFetch);

    // A second listener doesn't patch again, and removing one of two keeps intercepting
    stopFirst();
    expect(globalThis.fetch).toBe(patchedFetch);

    stopSecond();
    expect(httpIntercept.intercepting).toBe(false);
    expect(globalThis.fetch).toBe(siteFetch);
  });

  test('should give the page its own fetch back once a one-off listener has matched', async () => {
    const seen: string[] = [];

    // Like the sticky header waiting for the gamer header
    httpIntercept.onResponse(
      ({ req }) => {
        if (!req.url.endsWith('/gamerheader')) {
          return false;
        }
        seen.push(req.url);
      },
      { once: true }
    );

    await fetch('https://example.com/other');
    expect(httpIntercept.intercepting).toBe(true);

    await fetch('https://example.com/gamerheader');

    expect(seen).toEqual(['https://example.com/gamerheader']);
    expect(httpIntercept.intercepting).toBe(false);
    expect(globalThis.fetch).toBe(siteFetch);
  });

  test('should run a one-off listener once for two matching requests in flight together', async () => {
    const seen: string[] = [];
    httpIntercept.onResponse(
      ({ req }) => {
        seen.push(req.url);
      },
      { once: true }
    );

    await Promise.all([fetch('https://example.com/first'), fetch('https://example.com/second')]);

    expect(seen).toHaveLength(1);
    expect(httpIntercept.intercepting).toBe(false);
  });

  test('unregistering one listener leaves other listeners registered', async () => {
    const calls: string[] = [];
    const unregisterFirst = httpIntercept.onResponse(() => {
      calls.push('first');
    });
    httpIntercept.onResponse(() => {
      calls.push('second');
    });

    unregisterFirst();
    await fetch('https://example.com/api');

    expect(calls).toEqual(['second']);
  });

  test("doesn't run a listener an earlier one unregistered during the same response", async () => {
    const calls: string[] = [];
    let unregisterSecond = (): void => undefined;
    httpIntercept.onResponse(() => {
      calls.push('first');
      unregisterSecond();
    });
    unregisterSecond = httpIntercept.onResponse(
      () => {
        calls.push('second');
      },
      { once: true }
    );

    await fetch('https://example.com/api');

    expect(calls).toEqual(['first']);
  });

  test('once: true removes a listener that throws, giving the page its fetch back', async () => {
    const logged = vi.spyOn(logger, 'error').mockImplementation(() => {});
    let calls = 0;

    httpIntercept.onResponse(
      () => {
        calls++;
        throw new Error('broken');
      },
      { once: true }
    );

    await fetch('https://example.com/first');
    await fetch('https://example.com/second');

    expect(calls).toBe(1);
    expect(logged).toHaveBeenCalledOnce();
    expect(globalThis.fetch).toBe(siteFetch);
  });

  test('the unregister function returned alongside once: true is still safe to call after it already auto-unregistered', async () => {
    const calls: string[] = [];
    const unregister = httpIntercept.onResponse(
      () => {
        calls.push('called');
      },
      { once: true }
    );

    await fetch('https://example.com/first');
    expect(() => unregister()).not.toThrow();

    await fetch('https://example.com/second');
    expect(calls).toEqual(['called']);
  });

  test('stop clears listeners so they no longer fire', async () => {
    const calls: string[] = [];
    httpIntercept.onResponse(() => {
      calls.push('called');
    });
    httpIntercept.stop();

    expect(httpIntercept.intercepting).toBe(false);
    await fetch('https://example.com/api');

    expect(calls).toEqual([]);
  });

  describe('a listener that throws', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    test("doesn't stop the response, or the response listeners after it", async () => {
      const after: number[] = [];
      httpIntercept.onResponse(() => {
        throw new Error('response listener broke');
      });
      httpIntercept.onResponse((event) => {
        after.push(event.res.status);
      });

      const res = await fetch('https://example.com/api');

      expect(await res.text()).toBe('ok');
      expect(after).toEqual([200]);
    });
  });

  describe('XMLHttpRequest traffic', () => {
    // A stand-in for the browser's XMLHttpRequest (happy-dom's would go to the network): it answers every request with
    // 201 "xhr ok" (not 200, which a Response gives by default). The interceptor wraps whichever XMLHttpRequest is the
    // page's when it starts
    class FakeXHR extends EventTarget {
      static readonly DONE = 4;
      static readonly LOADING = 3;
      responseType: XMLHttpRequestResponseType = '';
      // Its response, read through getters: the interceptor reads them as `super.status` and so on, which an own
      // field wouldn't answer
      private answer = { readyState: 0, status: 0, statusText: '', body: '' };

      get readyState(): number {
        return this.answer.readyState;
      }

      get status(): number {
        return this.answer.status;
      }

      get statusText(): string {
        return this.answer.statusText;
      }

      get response(): string {
        return this.answer.body;
      }

      get responseText(): string {
        return this.answer.body;
      }

      open(): void {}

      setRequestHeader(): void {}

      getAllResponseHeaders(): string {
        return 'content-type: text/plain\r\n';
      }

      send(): void {
        queueMicrotask(() => {
          this.answer = { readyState: 4, status: 201, statusText: 'Created', body: 'xhr ok' };
          ['readystatechange', 'load', 'loadend'].forEach((type) => this.dispatchEvent(new Event(type)));
        });
      }
    }

    // Sends a GET through the page's XMLHttpRequest, resolving with it once loaded
    const get = (url: string): Promise<XMLHttpRequest> =>
      new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => resolve(xhr));
        xhr.open('GET', url);
        xhr.send();
      });

    beforeEach(() => {
      globalThis.XMLHttpRequest = FakeXHR as unknown as typeof XMLHttpRequest;
    });

    test('delivers response events, with their request, to listeners, and the response to the page', async () => {
      const responses: [string, number][] = [];
      const bodies: Promise<string>[] = [];
      httpIntercept.onResponse((event) => {
        responses.push([event.req.url, event.res.status]);
        bodies.push(event.res.clone().text());
      });

      const xhr = await get('https://example.com/xhr');

      expect(responses).toEqual([['https://example.com/xhr', 201]]);
      expect(await Promise.all(bodies)).toEqual(['xhr ok']);
      expect(xhr.status).toBe(201);
      expect(xhr.responseText).toBe('xhr ok');
    });

    test('gives the page its own XMLHttpRequest back once nothing listens', async () => {
      const unregister = httpIntercept.onResponse(() => undefined);
      expect(XMLHttpRequest).not.toBe(FakeXHR);

      unregister();

      expect(XMLHttpRequest).toBe(FakeXHR);
    });
  });
});

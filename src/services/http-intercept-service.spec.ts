import { httpIntercept } from './http-intercept-service';

describe('HttpInterceptService', () => {
  afterEach(() => {
    httpIntercept.stop();
    vi.unstubAllGlobals();
  });

  test('start delivers request and response events to listeners', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('ok', { status: 200 }))
    );

    const requestUrls: string[] = [];
    const responseStatuses: number[] = [];

    httpIntercept.onRequest((event) => {
      requestUrls.push(event.req.url);
    });
    httpIntercept.onResponse((event) => {
      responseStatuses.push(event.res.status);
    });
    httpIntercept.start();

    const res = await fetch('https://example.com/api');

    expect(requestUrls).toEqual(['https://example.com/api']);
    expect(responseStatuses).toEqual([200]);
    expect(res.status).toBe(200);
  });

  test('modify() on a request listener replaces the outgoing request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (req: Request) => new Response(req.url))
    );

    httpIntercept.onRequest((event) => {
      event.modify(() => new Request('https://example.com/modified'));
    });
    httpIntercept.start();

    const res = await fetch('https://example.com/original');

    expect(await res.text()).toBe('https://example.com/modified');
  });

  test('modify() on a response listener replaces the incoming response when awaited', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('original', { status: 200 }))
    );

    httpIntercept.onResponse(async (event) => {
      await event.modify(async (res) => new Response('replaced', { status: res.status }));
    });
    httpIntercept.start();

    const res = await fetch('https://example.com/api');

    expect(await res.text()).toBe('replaced');
  });

  test('two request listeners that build a fresh Request from scratch: only the last one survives', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (req: Request) => new Response(req.url))
    );

    httpIntercept.onRequest((event) => event.modify(() => new Request('https://example.com/first')));
    httpIntercept.onRequest((event) => event.modify(() => new Request('https://example.com/second')));
    httpIntercept.start();

    const res = await fetch('https://example.com/original');

    expect(await res.text()).toBe('https://example.com/second');
  });

  test('two request listeners that each derive from the request they were given: both changes persist', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (req: Request) => {
        const body = await req.text();
        return new Response(JSON.stringify({ header: req.headers.get('x-a'), body }));
      })
    );

    // Listener 1 adds a header, preserving everything else via `req` (the
    // request it was given, not a fresh one).
    httpIntercept.onRequest((event) => {
      event.modify((req) => new Request(req, { headers: { ...Object.fromEntries(req.headers), 'x-a': 'one' } }));
    });
    // Listener 2 rewrites the body, based on the request it was given --
    // which already includes listener 1's header change. Built from
    // `req.url` + explicit init rather than `new Request(req, { body })`:
    // happy-dom's Request silently drops a body override when chained off
    // an existing Request that already has one (confirmed against plain
    // undici, which handles this correctly per spec -- this is a test
    // environment quirk, not something HttpInterceptService does).
    httpIntercept.onRequest(async (event) => {
      await event.modify(async (req) => {
        const previousBody = await req.text();
        return new Request(req.url, { method: 'POST', headers: req.headers, body: `${previousBody}-modified` });
      });
    });
    httpIntercept.start();

    const res = await fetch('https://example.com/original', { method: 'POST', body: 'original' });
    const result = JSON.parse(await res.text());

    expect(result.header).toBe('one');
    expect(result.body).toBe('original-modified');
  });

  test('two response listeners that each derive from the response they were given: both changes persist', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('original', { status: 200, headers: { 'x-a': 'zero' } }))
    );

    httpIntercept.onResponse(async (event) => {
      const headers = new Headers(event.res.headers);
      headers.set('x-a', 'one');
      await event.modify(async (res) => new Response(await res.text(), { status: res.status, headers }));
    });
    httpIntercept.onResponse(async (event) => {
      const previousBody = await event.res.text();
      await event.modify(
        async (res) => new Response(`${previousBody}-modified`, { status: res.status, headers: res.headers })
      );
    });
    httpIntercept.start();

    const res = await fetch('https://example.com/api');

    expect(res.headers.get('x-a')).toBe('one');
    expect(await res.text()).toBe('original-modified');
  });

  test('two response listeners that build a fresh Response from scratch: only the last one survives', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('original', { status: 200 }))
    );

    httpIntercept.onResponse(async (event) => {
      await event.modify(async () => new Response('first'));
    });
    httpIntercept.onResponse(async (event) => {
      await event.modify(async () => new Response('second'));
    });
    httpIntercept.start();

    const res = await fetch('https://example.com/api');

    expect(await res.text()).toBe('second');
  });

  test('start is idempotent', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response())
    );

    httpIntercept.start();
    const patchedFetch = globalThis.fetch;
    httpIntercept.start();

    expect(globalThis.fetch).toBe(patchedFetch);
  });

  test('the unregister function returned by onRequest stops that listener from firing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('ok'))
    );

    const calls: string[] = [];
    const unregister = httpIntercept.onRequest(() => {
      calls.push('called');
    });
    httpIntercept.start();

    unregister();
    await fetch('https://example.com/api');

    expect(calls).toEqual([]);
  });

  test('the unregister function returned by onResponse stops that listener from firing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('ok'))
    );

    const calls: string[] = [];
    const unregister = httpIntercept.onResponse(() => {
      calls.push('called');
    });
    httpIntercept.start();

    unregister();
    await fetch('https://example.com/api');

    expect(calls).toEqual([]);
  });

  test('unregistering one listener leaves other listeners registered', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('ok'))
    );

    const calls: string[] = [];
    const unregisterFirst = httpIntercept.onResponse(() => {
      calls.push('first');
    });
    httpIntercept.onResponse(() => {
      calls.push('second');
    });
    httpIntercept.start();

    unregisterFirst();
    await fetch('https://example.com/api');

    expect(calls).toEqual(['second']);
  });

  test('once: true auto-unregisters an onRequest listener after its first call', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('ok'))
    );

    const calls: string[] = [];
    httpIntercept.onRequest(
      (event) => {
        calls.push(event.req.url);
      },
      { once: true }
    );
    httpIntercept.start();

    await fetch('https://example.com/first');
    await fetch('https://example.com/second');

    expect(calls).toEqual(['https://example.com/first']);
  });

  test('once: true auto-unregisters an onResponse listener after its first call', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('ok'))
    );

    const calls: number[] = [];
    httpIntercept.onResponse(
      (event) => {
        calls.push(event.res.status);
      },
      { once: true }
    );
    httpIntercept.start();

    await fetch('https://example.com/first');
    await fetch('https://example.com/second');

    expect(calls).toHaveLength(1);
  });

  test('once: true keeps an onRequest listener registered across calls where it returns false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('ok'))
    );

    const calls: string[] = [];
    httpIntercept.onRequest(
      (event) => {
        if (!event.req.url.endsWith('/match')) {
          return false;
        }

        calls.push(event.req.url);
      },
      { once: true }
    );
    httpIntercept.start();

    await fetch('https://example.com/skip-one');
    await fetch('https://example.com/skip-two');
    await fetch('https://example.com/match');
    await fetch('https://example.com/skip-three');

    expect(calls).toEqual(['https://example.com/match']);
  });

  test('once: true keeps an onResponse listener registered across calls where it returns false', async () => {
    vi.stubGlobal('fetch', vi.fn(async (req: Request) => new Response(req.url)));

    const matched: string[] = [];
    httpIntercept.onResponse(
      async (event) => {
        if (!event.req.url.endsWith('/match')) {
          return false;
        }

        matched.push(await event.res.text());
      },
      { once: true }
    );
    httpIntercept.start();

    await fetch('https://example.com/skip-one');
    await fetch('https://example.com/match');
    await fetch('https://example.com/skip-two');

    expect(matched).toEqual(['https://example.com/match']);
  });

  test('the unregister function returned alongside once: true is still safe to call after it already auto-unregistered', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('ok'))
    );

    const calls: string[] = [];
    const unregister = httpIntercept.onResponse(
      () => {
        calls.push('called');
      },
      { once: true }
    );
    httpIntercept.start();

    await fetch('https://example.com/first');
    expect(() => unregister()).not.toThrow();

    await fetch('https://example.com/second');
    expect(calls).toEqual(['called']);
  });

  test('stop clears listeners so they no longer fire', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('ok'))
    );

    const calls: string[] = [];
    httpIntercept.onRequest(() => {
      calls.push('called');
    });
    httpIntercept.start();
    httpIntercept.stop();
    httpIntercept.start();

    await fetch('https://example.com/api');

    expect(calls).toEqual([]);
  });
});

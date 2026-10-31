import { outcome, setHtml, stillParsing, tick, useFakeTimers, withoutBody } from '@ta-x-test';

import { mutationObserver } from './mutation-observer';
import { bodyReady, waitForElement, waitForElementWhileParsing, whenParsed } from './wait';

// The element waits on fake timers: each timeout is advanced through rather than sat out. Mutation records still
// arrive in a microtask, which advancing the timers also runs. The parse waits stay on real timers, as tick() lets the
// parser run
const useTimeoutTimers = (): void => {
  useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
};

describe('waitForElement', () => {
  beforeEach(() => {
    useTimeoutTimers();
    setHtml('@ta-x-test-views/empty.html');
  });

  test('should return null if no element is provided', async () => {
    const element = await waitForElement('body', { root: null });

    expect(element).toBeNull();
  });

  test('should return element if element is found immediately', async () => {
    const element = await waitForElement('body');

    expect(element).toBe(document.body);
  });

  test('should return null once the timeout passes without the element', async () => {
    const promise = waitForElement('.does-not-exist', { timeoutMs: 250 });

    await vi.advanceTimersByTimeAsync(249);
    expect(await outcome(promise)).toEqual({ settled: false });

    await vi.advanceTimersByTimeAsync(1);

    expect(await outcome(promise)).toEqual({ settled: true, value: null });
  });

  // Most callers pass no timeout
  test('should wait 10 seconds when no timeout is given', async () => {
    const promise = waitForElement('.does-not-exist');

    await vi.advanceTimersByTimeAsync(9_999);
    expect(await outcome(promise)).toEqual({ settled: false });

    await vi.advanceTimersByTimeAsync(1);

    expect(await outcome(promise)).toEqual({ settled: true, value: null });
  });

  test('should return element if found after a mutation', async () => {
    const promise = waitForElement('.should-trigger-mutation', { root: document.body });

    await vi.advanceTimersByTimeAsync(1000);
    expect(await outcome(promise)).toEqual({ settled: false });

    const elementToObserve = document.createElement('div');
    elementToObserve.className = 'should-trigger-mutation';
    document.body.appendChild(elementToObserve);

    // toBe: toEqual would take any element that looks the same
    const { settled, value } = await outcome(promise);
    expect(settled).toBe(true);
    expect(value).toBe(elementToObserve);
  });

  // The later one is added first, so the first reported isn't the first on the page
  test('should return the first on the page of several elements added together', async () => {
    const promise = waitForElement('.should-trigger-mutation', { root: document.body });

    const [first, second] = ['first', 'second'].map((id) => {
      const element = document.createElement('div');
      element.className = 'should-trigger-mutation';
      element.id = id;
      return element;
    });
    document.body.append(second);
    document.body.insertBefore(first, second);

    const { settled, value } = await outcome(promise);
    expect(settled).toBe(true);
    expect(value).toBe(first);
  });

  // The page watcher is page-wide: a wait left registered would run on every later change to the page
  test.each([
    {
      end: 'finds its element',
      endIt: async (): Promise<void> => {
        document.body.append(Object.assign(document.createElement('div'), { className: 'later' }));
      }
    },
    {
      end: 'times out',
      endIt: async (): Promise<void> => {
        await vi.advanceTimersByTimeAsync(250);
      }
    },
    {
      end: 'is aborted',
      endIt: async (controller: AbortController): Promise<void> => {
        controller.abort();
      }
    }
  ])('should stop watching the page and its timer once it $end', async ({ endIt }) => {
    const unregisters: ReturnType<typeof vi.fn>[] = [];
    const onElementAdded = mutationObserver.onElementAdded.bind(mutationObserver);
    vi.spyOn(mutationObserver, 'onElementAdded').mockImplementation((...args) => {
      const unregister = vi.fn(onElementAdded(...args));
      unregisters.push(unregister);
      return unregister;
    });
    const controller = new AbortController();
    const promise = waitForElement('.later', { root: document.body, timeoutMs: 250, signal: controller.signal });

    await endIt(controller);

    expect((await outcome(promise)).settled).toBe(true);
    expect(unregisters).toHaveLength(1);
    expect(unregisters[0]).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  test('should return null immediately if an already-aborted signal is passed, without waiting for the timeout', async () => {
    const controller = new AbortController();
    controller.abort();

    const promise = waitForElement('.does-not-exist', { timeoutMs: 5000, signal: controller.signal });

    expect(await outcome(promise)).toEqual({ settled: true, value: null });
  });

  test('should return null as soon as the signal aborts, without waiting for the timeout', async () => {
    const controller = new AbortController();
    const promise = waitForElement('.does-not-exist', { timeoutMs: 5000, signal: controller.signal });

    await vi.advanceTimersByTimeAsync(50);
    expect(await outcome(promise)).toEqual({ settled: false });

    controller.abort();

    expect(await outcome(promise)).toEqual({ settled: true, value: null });
  });
});

describe('waitForElementWhileParsing', () => {
  test('should resolve with an element already parsed', async () => {
    document.body.innerHTML = '<p class="target"></p>';

    await expect(waitForElementWhileParsing('.target')).resolves.toBe(document.querySelector('.target'));
  });

  test('should resolve with null on a parsed page without one', async () => {
    await expect(waitForElementWhileParsing('.target')).resolves.toBeNull();
  });

  test('should resolve as soon as the parser adds one', async () => {
    stillParsing();

    const waiting = waitForElementWhileParsing('.target');
    const target = document.createElement('p');
    target.className = 'target';
    document.body.append(target);

    await expect(waiting).resolves.toBe(target);
  });

  test('should resolve with null once the page is parsed without one', async () => {
    const finishParsing = stillParsing();

    const waiting = waitForElementWhileParsing('.target');
    finishParsing();

    await expect(waiting).resolves.toBeNull();
  });
});

describe('whenParsed', () => {
  test('should resolve straight away once the document is parsed', async () => {
    await expect(whenParsed()).resolves.toBeUndefined();
  });

  test('should wait for DOMContentLoaded while the document is still loading', async () => {
    const finishParsing = stillParsing();
    let parsed = false;

    const waiting = whenParsed().then(() => {
      parsed = true;
    });
    await tick();

    expect(parsed).toBe(false);

    finishParsing();
    await waiting;

    expect(parsed).toBe(true);
  });
});

describe('bodyReady', () => {
  test('should resolve with the body straight away once there is one', async () => {
    await expect(bodyReady()).resolves.toBe(document.body);
  });

  test('should wait for the body while the page has none, as at document-start', async () => {
    const addBody = withoutBody();
    let body: HTMLElement | undefined;

    const waiting = bodyReady().then((ready) => {
      body = ready;
    });
    await tick();

    expect(body).toBeUndefined();

    const added = addBody();
    await waiting;

    expect(body).toBe(added);
  });

  test('should share one wait between callers waiting together', async () => {
    const addBody = withoutBody();

    const first = bodyReady();
    const second = bodyReady();
    expect(second).toBe(first);

    const added = addBody();

    await expect(first).resolves.toBe(added);
  });

  test('should wait afresh for a body removed after an earlier wait ended', async () => {
    const addFirstBody = withoutBody();
    const firstWait = bodyReady();
    addFirstBody();
    await firstWait;

    const addSecondBody = withoutBody();
    const secondWait = bodyReady();
    expect(secondWait).not.toBe(firstWait);

    const added = addSecondBody();

    await expect(secondWait).resolves.toBe(added);
  });
});

import { mutationObserver } from './mutation-observer';

// Resolves once the document has been parsed. Our script starts at document-start, so on a long page it can run before
// the rest of the page is there
export const whenParsed = (): Promise<void> =>
  document.readyState === 'loading'
    ? new Promise((resolve) => document.addEventListener('DOMContentLoaded', () => resolve(), { once: true }))
    : Promise.resolve();

// Resolves with <body> once the parser has added it (at once if it's there). Our script starts at document-start, when
// the page may have no body yet. Callers waiting together share one observer; only the wait is kept, not the body, so
// a body added later (or a replaced one) is the one handed out
let pendingBody: Promise<HTMLElement> | null = null;
export const bodyReady = (): Promise<HTMLElement> => {
  if (document.body) {
    return Promise.resolve(document.body);
  }

  pendingBody ??= new Promise((resolve) => {
    mutationObserver.onElementAdded(
      'body',
      (body) => {
        pendingBody = null;
        resolve(document.body ?? body);
      },
      { root: document.documentElement, once: true }
    );
  });

  return pendingBody;
};

// How a wait looks: where (the whole page unless given; null finds nothing), for how long, and until what gives up
interface WaitOptions {
  root?: Document | Element | null;
  timeoutMs?: number;
  signal?: AbortSignal;
}

/** The first element matching `selector`, or null once `timeoutMs` passes without one. `signal` lets a caller give up
 * early (e.g. on a failed ajax response the awaited markup depends on) instead of waiting out the full `timeoutMs`;
 * an already-aborted signal resolves immediately with null. */
export const waitForElement = async <T extends Element = HTMLElement>(
  selector: string,
  { root = document.documentElement, timeoutMs = 10_000, signal }: WaitOptions = {}
): Promise<T | null> => {
  if (!root) {
    return null;
  }

  const initialMatch = root.querySelector<T>(selector);
  if (initialMatch) {
    return initialMatch;
  }

  if (signal?.aborted) {
    return null;
  }

  return new Promise<T | null>((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let unregister: (() => void) | undefined;

    const cleanup = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      if (unregister) {
        unregister();
      }

      signal?.removeEventListener('abort', onAbort);
    };

    const onAbort = () => {
      cleanup();
      resolve(null);
    };

    signal?.addEventListener('abort', onAbort, { once: true });

    unregister = mutationObserver.onElementAdded(
      selector,
      (addedElement) => {
        cleanup();
        resolve(root.querySelector<T>(selector) ?? (addedElement as unknown as T));
      },
      { root }
    );

    timeoutId = setTimeout(() => {
      cleanup();
      resolve(null);
    }, timeoutMs);
  });
};

// The first element matching `selector` as soon as the parser adds it, or null once the page is parsed without one.
// For a step that should go as early as it can (one that navigates, so the rest of the page is wasted), where waiting
// for `whenParsed()` would be too late and a timeout would be a guess
export const waitForElementWhileParsing = async <T extends Element = HTMLElement>(
  selector: string
): Promise<T | null> => {
  const parsed = new AbortController();
  void whenParsed().then(() => parsed.abort());
  // The parse ends the wait, not the timeout: a long page can take a while
  const found = await waitForElement<T>(selector, { timeoutMs: 600_000, signal: parsed.signal });
  parsed.abort();

  return found ?? document.querySelector<T>(selector);
};

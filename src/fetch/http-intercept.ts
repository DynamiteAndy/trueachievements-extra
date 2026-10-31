import { Vista, interceptFetch, interceptXHR, type FetchContext } from '@rxliuli/vista';
import { logger } from '@ta-x-lib';

// What a response listener is given. `res` is a Fetch-style Response for both `fetch()` and `XMLHttpRequest` traffic
interface HttpResponseEvent {
  readonly req: Request;
  readonly res: Response;
}

// A listener returns false to say "not this one" (see `onResponse`'s `once`)
type ResponseListener = (event: HttpResponseEvent) => void | boolean;

interface Matcher {
  once: boolean;
  callback: ResponseListener;
}

/**
 * Intercepts the responses to `fetch()` and `XMLHttpRequest` traffic. Wraps `@rxliuli/vista` behind
 * an `onResponse` registration API so call sites don't depend on Vista's middleware shape directly.
 *
 * It only intercepts while something listens: the first listener starts it and removing the last one stops it, which
 * gives the page its own `fetch` and `XMLHttpRequest` back.
 *
 * Listeners run in registration order, and only read the response.
 */
class HttpInterceptServiceImpl {
  private vista: Vista<FetchContext> | null = null;
  // In registration order. Removing one replaces the array, so a response already going through the listeners isn't
  // disturbed (fire skips one removed since)
  private matchers: Matcher[] = [];

  /** Returns an unregister function. Pass `once: true` to auto-unregister after this listener
   * runs, like `mutationObserver`'s `once`: there's no built-in notion of "match" for arbitrary
   * traffic, so the listener itself decides: return `false` to say "not this one, keep listening",
   * anything else counts as a match and unregisters. Without `once`, call the returned function
   * yourself once the listener's done its job, so it doesn't keep running against every response
   * for the rest of the page's life. */
  onResponse(callback: ResponseListener, { once = false }: { once?: boolean } = {}): () => void {
    const matcher: Matcher = { once, callback };
    this.matchers.push(matcher);
    this.start();

    return () => {
      this.remove(matcher);
    };
  }

  /** Whether `fetch()` and `XMLHttpRequest` are being intercepted (while any listener is registered). */
  get intercepting(): boolean {
    return this.vista !== null;
  }

  // Starts intercepting `fetch()` and `XMLHttpRequest` traffic, if it isn't already
  private start(): void {
    if (this.vista) {
      return;
    }

    this.vista = new Vista([interceptFetch, interceptXHR]).use(async (context, next) => {
      await next();

      const event: HttpResponseEvent = { req: context.req, res: context.res };
      for (const matcher of this.matchers) {
        this.fire(matcher, event);
      }
    });

    this.vista.intercept();
  }

  private fire(matcher: Matcher, event: HttpResponseEvent): void {
    // The loop goes over the listeners it started with: one unregistered since (an earlier listener's doing, or a once
    // listener that matched) doesn't run
    if (!this.matchers.includes(matcher)) {
      return;
    }

    // A once listener that throws counts as done, so it's removed rather than left listening (and the interception
    // left on)
    let matched = true;
    try {
      matched = matcher.callback(event) !== false;
    } catch (error) {
      logger.error('httpIntercept', 'response listener threw', error);
    } finally {
      if (matcher.once && matched) {
        this.remove(matcher);
      }
    }
  }

  // Gives the page its own `fetch()` and `XMLHttpRequest` back once nothing listens. A request already on its way still
  // finishes
  private remove(matcher: Matcher): void {
    this.matchers = this.matchers.filter((m) => m !== matcher);
    if (this.matchers.length === 0) {
      this.vista?.destroy();
      this.vista = null;
    }
  }

  /** Stops intercepting and clears listeners. Mainly useful for tests. */
  stop(): void {
    this.vista?.destroy();
    this.vista = null;
    this.matchers = [];
  }
}

export const httpIntercept = new HttpInterceptServiceImpl();

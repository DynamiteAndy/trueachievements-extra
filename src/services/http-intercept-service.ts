import { Vista, interceptFetch, interceptXHR } from '@rxliuli/vista';
import { logger } from './logger-service';

/**
 * Payload delivered to request listeners. `req` is the outgoing Fetch/XHR
 * request as Vista normalises it, already reflecting any changes made by
 * listeners registered before this one — so a listener that wants to layer
 * a change on top of what earlier listeners did should derive its
 * replacement from `req` (e.g. `new Request(req, { headers: ... })`) rather
 * than building a request from scratch. Call `modify()` to replace it; if
 * more than one listener calls `modify()`, the last call's result is what's
 * actually sent (listener order is registration order — see `onRequest`).
 * "Last write wins" only means the *last returned Request object* wins —
 * whether an earlier listener's change survives inside that object depends
 * on whether the later listener's `fn` incorporated `req` or discarded it.
 * `modify()` returns a promise — `await` it if `fn` is async (e.g. it needs
 * to read the previous body via `req.text()`/`req.json()` before
 * transforming it), or the next listener may run before the replacement
 * request is recorded.
 */
export interface HttpRequestEvent {
  readonly req: Request;
  modify(fn: (req: Request) => Request | Promise<Request>): Promise<void>;
}

/**
 * Payload delivered to response listeners. `res` is the Fetch-style Response
 * for both `fetch()` and `XMLHttpRequest` traffic, already reflecting any
 * changes made by listeners registered before this one — same composition
 * rule as `HttpRequestEvent`: derive your replacement from `res` to layer a
 * change on top of earlier listeners' changes, or build from scratch to
 * discard them. `modify()` returns a promise — `await` it if `fn` is async,
 * or the next listener may run before the replacement response is recorded.
 */
export interface HttpResponseEvent {
  readonly req: Request;
  readonly res: Response;
  modify(fn: (res: Response) => Response | Promise<Response>): Promise<void>;
}

type RequestListener = (event: HttpRequestEvent) => void | boolean | Promise<void | boolean>;
type ResponseListener = (event: HttpResponseEvent) => void | boolean | Promise<void | boolean>;

interface RequestMatcher {
  once: boolean;
  callback: RequestListener;
}

interface ResponseMatcher {
  once: boolean;
  callback: ResponseListener;
}

/**
 * Intercepts `fetch()` and `XMLHttpRequest` traffic — the Phase 0 replacement
 * for the abandoned `ajax-interceptor` package. Wraps `@rxliuli/vista` behind
 * an `onRequest`/`onResponse` registration API so call sites don't depend on
 * Vista's middleware shape directly.
 *
 * Listener order is registration order. Each listener receives the
 * request/response as already modified by earlier listeners, so changes
 * compose as long as a listener's `modify()` function derives its
 * replacement from the value it's given — see `HttpRequestEvent`/
 * `HttpResponseEvent` for the full composition rule.
 */
class HttpInterceptServiceImpl {
  private vista: Vista<import('@rxliuli/vista').FetchContext> | null = null;
  private requestMatchers: RequestMatcher[] = [];
  private responseMatchers: ResponseMatcher[] = [];

  /** Returns an unregister function. Pass `once: true` to auto-unregister after this listener
   * runs, same as `MutationObserverService`'s `once` -- unlike that selector-matched version,
   * there's no built-in notion of "match" for arbitrary request traffic, so the listener itself
   * decides: return `false` to say "not this one, keep listening", anything else counts as a
   * match and unregisters. Without `once`, call the returned function yourself once the
   * listener's done its job, so it doesn't keep running against every request for the rest of
   * the page's life. */
  onRequest(callback: RequestListener, opts: { once?: boolean } = {}): () => void {
    const matcher: RequestMatcher = { once: opts.once ?? false, callback };

    return this.registerRequest(matcher);
  }

  /** Returns an unregister function. Pass `once: true` to auto-unregister after this listener
   * runs, same as `MutationObserverService`'s `once` -- unlike that selector-matched version,
   * there's no built-in notion of "match" for arbitrary response traffic, so the listener itself
   * decides: return `false` to say "not this one, keep listening", anything else counts as a
   * match and unregisters. Without `once`, call the returned function yourself once the
   * listener's done its job, so it doesn't keep running against every response for the rest of
   * the page's life. */
  onResponse(callback: ResponseListener, opts: { once?: boolean } = {}): () => void {
    const matcher: ResponseMatcher = { once: opts.once ?? false, callback };

    return this.registerResponse(matcher);
  }

  private registerRequest(matcher: RequestMatcher): () => void {
    this.requestMatchers.push(matcher);

    return () => {
      this.requestMatchers = this.requestMatchers.filter((m) => m !== matcher);
    };
  }

  private registerResponse(matcher: ResponseMatcher): () => void {
    this.responseMatchers.push(matcher);

    return () => {
      this.responseMatchers = this.responseMatchers.filter((m) => m !== matcher);
    };
  }

  /** Starts intercepting `fetch()` and `XMLHttpRequest` traffic. Idempotent. */
  start(): void {
    if (this.vista) {
      return;
    }

    this.vista = new Vista([interceptFetch, interceptXHR]).use(async (context, next) => {
      let req = context.req;
      for (const matcher of this.requestMatchers) {
        try {
          await this.fireRequest(matcher, {
            req,
            modify: async (fn) => {
              req = await fn(req);
            }
          });
        } catch (error) {
          logger.error('httpIntercept', 'request listener threw', error);
        }
      }
      context.req = req;

      await next();

      let res = context.res;
      for (const matcher of this.responseMatchers) {
        try {
          await this.fireResponse(matcher, {
            req,
            res,
            modify: async (fn) => {
              res = await fn(res);
            }
          });
        } catch (error) {
          logger.error('httpIntercept', 'response listener threw', error);
        }
      }
      context.res = res;
    });

    this.vista.intercept();
  }

  private async fireRequest(matcher: RequestMatcher, event: HttpRequestEvent): Promise<void> {
    const matched = (await matcher.callback(event)) !== false;

    if (matcher.once && matched) {
      this.requestMatchers = this.requestMatchers.filter((m) => m !== matcher);
    }
  }

  private async fireResponse(matcher: ResponseMatcher, event: HttpResponseEvent): Promise<void> {
    const matched = (await matcher.callback(event)) !== false;

    if (matcher.once && matched) {
      this.responseMatchers = this.responseMatchers.filter((m) => m !== matcher);
    }
  }

  /** Stops intercepting and clears listeners. Mainly useful for tests. */
  stop(): void {
    this.vista?.destroy();
    this.vista = null;
    this.requestMatchers = [];
    this.responseMatchers = [];
  }
}

export const httpIntercept = new HttpInterceptServiceImpl();

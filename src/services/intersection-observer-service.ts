/**
 * A single real `IntersectionObserver` per distinct `root`/`rootMargin`/`threshold`
 * combination, shared by every consumer that would otherwise spin up its own -- same
 * rationale as `ResizeObserverService` and `MutationObserverService`, kept as a separate
 * service since none of these browser APIs have anything in common beyond being
 * "observers". Unlike `ResizeObserver`, `IntersectionObserver`'s config is fixed at
 * construction and applies to every target it observes, so a single global instance
 * can't serve callers that disagree on `root`/`rootMargin`/`threshold` -- instead, each
 * distinct combination gets its own native observer, and callers using the same (or
 * default) options share one.
 */

type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

interface IntersectionMatcher {
  element: Element;
  once: boolean;
  callback: IntersectionCallback;
}

class IntersectionObserverServiceImpl {
  private observersByRoot = new Map<Element | Document | null, Map<string, IntersectionObserver>>();
  private matchers: IntersectionMatcher[] = [];

  /**
   * Fires `callback` whenever `element`'s intersection with `options.root` (default the
   * viewport) crosses `options.threshold`. Pass `once: true` to auto-unregister after the
   * first firing. Returns an unregister function.
   */
  observe(
    element: Element,
    callback: IntersectionCallback,
    opts: IntersectionObserverInit & { once?: boolean } = {}
  ): () => void {
    const { once, ...observerOptions } = opts;
    const matcher: IntersectionMatcher = { element, once: once ?? false, callback };
    const observer = this.ensureObserver(observerOptions);

    return this.register(matcher, observer);
  }

  private register(matcher: IntersectionMatcher, observer: IntersectionObserver): () => void {
    this.matchers.push(matcher);
    observer.observe(matcher.element);

    return () => {
      this.matchers = this.matchers.filter((m) => m !== matcher);

      if (!this.matchers.some((m) => m.element === matcher.element)) {
        observer.unobserve(matcher.element);
      }
    };
  }

  private ensureObserver(options: IntersectionObserverInit): IntersectionObserver {
    const root = options.root ?? null;
    const key = JSON.stringify({ rootMargin: options.rootMargin ?? '', threshold: options.threshold ?? 0 });

    let observersByKey = this.observersByRoot.get(root);
    if (!observersByKey) {
      observersByKey = new Map();
      this.observersByRoot.set(root, observersByKey);
    }

    let observer = observersByKey.get(key);
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          this.handleEntry(entry);
        }
      }, options);
      observersByKey.set(key, observer);
    }

    return observer;
  }

  private handleEntry(entry: IntersectionObserverEntry): void {
    const matchingMatchers = this.matchers.filter((m) => m.element === entry.target);

    for (const matcher of matchingMatchers) {
      this.fire(matcher, entry);
    }
  }

  private fire(matcher: IntersectionMatcher, entry: IntersectionObserverEntry): void {
    if (matcher.once) {
      this.matchers = this.matchers.filter((m) => m !== matcher);
    }

    void matcher.callback(entry);
  }

  /** Disconnects every shared observer and clears all registrations. Mainly useful for tests. */
  stop(): void {
    this.observersByRoot.forEach((observersByKey) => observersByKey.forEach((observer) => observer.disconnect()));
    this.observersByRoot.clear();
    this.matchers = [];
  }
}

export const intersectionObserver = new IntersectionObserverServiceImpl();

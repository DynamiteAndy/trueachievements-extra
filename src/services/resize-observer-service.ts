/**
 * A single real `ResizeObserver`, shared by every consumer that would
 * otherwise spin up its own -- same rationale as `MutationObserverService`,
 * kept as a separate service since the two browser APIs have nothing in
 * common beyond both being "observers". Unlike a `MutationObserver`
 * matcher, no selector-matching is needed here: `ResizeObserver` already
 * lets one instance watch several elements directly, and each entry reports
 * back the exact `target` that changed.
 */

type ResizeCallback = (entry: ResizeObserverEntry) => void;

interface ResizeMatcher {
  element: Element;
  once: boolean;
  callback: ResizeCallback;
}

class ResizeObserverServiceImpl {
  private observer: ResizeObserver | null = null;
  private matchers: ResizeMatcher[] = [];

  /** Fires `callback` whenever `element`'s box size changes. Pass `once: true` to
   * auto-unregister after the first firing. Returns an unregister function. */
  observe(element: Element, callback: ResizeCallback, opts: { once?: boolean } = {}): () => void {
    const matcher: ResizeMatcher = { element, once: opts.once ?? false, callback };

    return this.register(matcher);
  }

  private register(matcher: ResizeMatcher): () => void {
    this.matchers.push(matcher);
    this.ensureObserver();
    this.observer?.observe(matcher.element);

    return () => {
      this.matchers = this.matchers.filter((m) => m !== matcher);

      if (!this.matchers.some((m) => m.element === matcher.element)) {
        this.observer?.unobserve(matcher.element);
      }
    };
  }

  private ensureObserver(): void {
    if (this.observer) {
      return;
    }

    this.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.handleEntry(entry);
      }
    });
  }

  private handleEntry(entry: ResizeObserverEntry): void {
    const matchingMatchers = this.matchers.filter((m) => m.element === entry.target);

    for (const matcher of matchingMatchers) {
      this.fire(matcher, entry);
    }
  }

  private fire(matcher: ResizeMatcher, entry: ResizeObserverEntry): void {
    if (matcher.once) {
      this.matchers = this.matchers.filter((m) => m !== matcher);
    }

    void matcher.callback(entry);
  }

  /** Disconnects the shared observer and clears all registrations. Mainly useful for tests. */
  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.matchers = [];
  }
}

export const resizeObserver = new ResizeObserverServiceImpl();

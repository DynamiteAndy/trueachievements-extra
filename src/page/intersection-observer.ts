/**
 * A single real `IntersectionObserver` per distinct `root`/`rootMargin`/`threshold`
 * combination, shared by every consumer that would otherwise spin up its own. Unlike
 * `ResizeObserver`, `IntersectionObserver`'s config is fixed at
 * construction and applies to every target it observes, so a single global instance
 * can't serve callers that disagree on `root`/`rootMargin`/`threshold` -- instead, each
 * distinct combination gets its own native observer, and callers using the same (or
 * default) options share one.
 *
 * Matchers are kept per native observer and found by their element, so an entry only
 * reaches the matchers registered on the observer (the options) that reported it. It keeps
 * the mutation observer's safeguards too: one callback throwing doesn't stop the others,
 * and an element is unobserved as soon as its last matcher on that observer goes, however
 * it goes.
 */

import { logger } from '@ta-x-lib';

type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

interface IntersectionMatcher {
  element: Element;
  observer: IntersectionObserver;
  callback: IntersectionCallback;
}

class IntersectionObserverServiceImpl {
  private observersByRoot = new Map<Element | Document | null, Map<string, IntersectionObserver>>();
  private matchers = new Map<IntersectionObserver, Map<Element, Set<IntersectionMatcher>>>();

  /**
   * Fires `callback` whenever `element`'s intersection with `options.root` (default the
   * viewport) crosses `options.threshold`. Returns an unregister function.
   */
  observe(element: Element, callback: IntersectionCallback, options: IntersectionObserverInit = {}): () => void {
    return this.register({ element, observer: this.ensureObserver(options), callback });
  }

  private register(matcher: IntersectionMatcher): () => void {
    const byElement = this.matchers.get(matcher.observer) ?? new Map<Element, Set<IntersectionMatcher>>();
    const forElement = byElement.get(matcher.element) ?? new Set();
    // A native observer ignores observe() of an element it already watches, so it's dropped first: the new matcher
    // then gets a first entry too
    if (forElement.size > 0) {
      matcher.observer.unobserve(matcher.element);
    }
    forElement.add(matcher);
    byElement.set(matcher.element, forElement);
    this.matchers.set(matcher.observer, byElement);
    matcher.observer.observe(matcher.element);

    return () => this.unregister(matcher);
  }

  private unregister(matcher: IntersectionMatcher): void {
    const byElement = this.matchers.get(matcher.observer);
    const forElement = byElement?.get(matcher.element);

    if (!forElement?.delete(matcher)) {
      return;
    }

    if (forElement.size === 0) {
      byElement?.delete(matcher.element);
      matcher.observer.unobserve(matcher.element);
    }

    // Its last element gone, the native observer is disconnected and dropped; the next register makes a new one
    if (byElement?.size === 0) {
      this.drop(matcher.observer);
    }
  }

  private drop(observer: IntersectionObserver): void {
    observer.disconnect();
    this.matchers.delete(observer);
    for (const [root, observersByKey] of this.observersByRoot) {
      for (const [key, each] of observersByKey) {
        if (each === observer) {
          observersByKey.delete(key);
        }
      }
      if (observersByKey.size === 0) {
        this.observersByRoot.delete(root);
      }
    }
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
      observer = new IntersectionObserver((entries, reporter) => {
        for (const entry of entries) {
          this.handleEntry(entry, reporter);
        }
      }, options);
      observersByKey.set(key, observer);
    }

    return observer;
  }

  private handleEntry(entry: IntersectionObserverEntry, observer: IntersectionObserver): void {
    const forElement = this.matchers.get(observer)?.get(entry.target);

    if (!forElement) {
      return;
    }

    // Going through the Set itself skips a matcher that has unregistered since (by a callback for an earlier entry in
    // this batch)
    for (const matcher of forElement) {
      this.fire(matcher, entry);
    }
  }

  // One matcher's callback throwing mustn't stop the others, or the entries still to handle
  private fire(matcher: IntersectionMatcher, entry: IntersectionObserverEntry): void {
    try {
      matcher.callback(entry);
    } catch (error) {
      logger.error('intersection-observer', error);
    }
  }

  /** Disconnects every shared observer and clears all registrations. Mainly useful for tests. */
  stop(): void {
    this.observersByRoot.forEach((observersByKey) => observersByKey.forEach((observer) => observer.disconnect()));
    this.observersByRoot.clear();
    // Each element's Set emptied too, not only the map: an entry being handled goes through its element's Set, so
    // stopped from one of its callbacks, the rest of that Set would still fire (as in the mutation observer)
    this.matchers.forEach((byElement) => byElement.forEach((forElement) => forElement.clear()));
    this.matchers.clear();
  }
}

export const intersectionObserver = new IntersectionObserverServiceImpl();

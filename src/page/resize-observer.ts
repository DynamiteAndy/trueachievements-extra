/**
 * A single real `ResizeObserver`, shared by every consumer that would
 * otherwise spin up its own. Unlike a `MutationObserver`
 * matcher, no selector-matching is needed here: `ResizeObserver` already
 * lets one instance watch several elements directly, and each entry reports
 * back the exact `target` that changed.
 *
 * It keeps the mutation observer's safeguards: matchers are found by their
 * element, so an entry only reaches its own; and one callback throwing
 * doesn't stop the others. An element is unobserved as soon as its last
 * matcher goes, however it goes. There's nothing to configure beyond that:
 * the native observer only does work for the elements it observes.
 */

import { logger } from '@ta-x-lib';

type ResizeCallback = (entry: ResizeObserverEntry) => void;

interface ResizeMatcher {
  element: Element;
  callback: ResizeCallback;
}

class ResizeObserverServiceImpl {
  private observer: ResizeObserver | null = null;
  private matchers = new Map<Element, Set<ResizeMatcher>>();

  /** Fires `callback` whenever `element`'s box size changes. Returns an unregister function. */
  observe(element: Element, callback: ResizeCallback): () => void {
    return this.register({ element, callback });
  }

  private register(matcher: ResizeMatcher): () => void {
    const forElement = this.matchers.get(matcher.element) ?? new Set();
    forElement.add(matcher);
    this.matchers.set(matcher.element, forElement);
    this.ensureObserver();
    this.observer?.observe(matcher.element);

    return () => this.unregister(matcher);
  }

  private unregister(matcher: ResizeMatcher): void {
    const forElement = this.matchers.get(matcher.element);

    if (!forElement?.delete(matcher)) {
      return;
    }

    if (forElement.size === 0) {
      this.matchers.delete(matcher.element);
      this.observer?.unobserve(matcher.element);
    }
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
    const forElement = this.matchers.get(entry.target);

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
  private fire(matcher: ResizeMatcher, entry: ResizeObserverEntry): void {
    try {
      matcher.callback(entry);
    } catch (error) {
      logger.error('resize-observer', error);
    }
  }

  /** Disconnects the shared observer and clears all registrations. Mainly useful for tests. */
  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.matchers.clear();
  }
}

export const resizeObserver = new ResizeObserverServiceImpl();

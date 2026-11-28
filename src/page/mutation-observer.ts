/**
 * A single real `MutationObserver` on `document.documentElement`, shared by
 * every consumer that would otherwise spin up its own.
 *
 * Observing `document.documentElement` rather than `document.body` is
 * deliberate: this userscript runs at `document-start`, where `<body>`
 * doesn't exist yet. `document.documentElement` exists as soon as any script
 * can run, and mutations under `document.body` are still observed as its
 * descendant, so nothing that scopes to `body` loses coverage.
 *
 * The observer only watches what its matchers need: nothing while none are
 * registered, child lists while any are, and attributes only while an
 * attribute matcher (`onAttributeChange`) is registered,
 * limited to the attributes they name. Attribute changes happen all over the
 * site's pages (its own scripts, ads), so watching every one of them would
 * run every matcher for each.
 */

import { logger } from '@ta-x-lib';

type ElementCallback = (element: HTMLElement) => void | Promise<void>;

interface AddedMatcher {
  kind: 'added';
  selector: string;
  // Null for the page's <body>, read as each element is checked: it doesn't exist yet at document-start
  root: Document | Element | null;
  once: boolean;
  callback: ElementCallback;
}

interface AttributeMatcher {
  kind: 'attribute';
  element: Element;
  attributeFilter: string[];
  // Fires for every change, until unregistered
  once: false;
  callback: ElementCallback;
}

interface RemovedMatcher {
  kind: 'removed';
  element: Element;
  // Removal happens once: the matcher goes when it fires
  once: true;
  callback: ElementCallback;
}

type Matcher = AddedMatcher | AttributeMatcher | RemovedMatcher;

class MutationObserverServiceImpl {
  private observer: MutationObserver | null = null;
  // Kept per kind, so each mutation only goes through the matchers of its own kind, and "still registered" is a
  // lookup rather than a scan. Attribute matchers are found by the element they watch
  private addedMatchers = new Set<AddedMatcher>();
  private attributeMatchers = new Map<Element, Set<AttributeMatcher>>();
  private removedMatchers = new Set<RemovedMatcher>();
  // The options the observer is observing with, as JSON (null while disconnected)
  private observing: string | null = null;

  /**
   * Fires `callback` when a node matching `selector` (itself or a
   * descendant) is added anywhere under `root` (default the page's `<body>`, once there is one).
   * Returns an unregister function. Pass `once: true` to auto-unregister
   * after the first match — this is what `waitForElement` uses.
   */
  onElementAdded(
    selector: string,
    callback: ElementCallback,
    opts: { root?: Document | Element; once?: boolean } = {}
  ): () => void {
    return this.register({
      kind: 'added',
      selector,
      root: opts.root ?? null,
      once: opts.once ?? false,
      callback
    });
  }

  /**
   * Fires `callback` when one of `attributeFilter`'s attributes changes on
   * `element` itself. Returns an unregister function.
   */
  onAttributeChange(element: Element, attributeFilter: string[], callback: ElementCallback): () => void {
    return this.register({ kind: 'attribute', element, attributeFilter, once: false, callback });
  }

  /**
   * Fires `callback` once `element` has left the page (it, or an ancestor, was removed). Fires once; returns an
   * unregister function.
   */
  onElementRemoved(element: Element, callback: ElementCallback): () => void {
    return this.register({ kind: 'removed', element, once: true, callback });
  }

  private register(matcher: Matcher): () => void {
    if (matcher.kind === 'added') {
      this.addedMatchers.add(matcher);
    } else if (matcher.kind === 'removed') {
      this.removedMatchers.add(matcher);
    } else {
      const forElement = this.attributeMatchers.get(matcher.element) ?? new Set();
      forElement.add(matcher);
      this.attributeMatchers.set(matcher.element, forElement);
    }
    this.configure();

    return () => this.unregister(matcher);
  }

  private isRegistered(matcher: Matcher): boolean {
    if (matcher.kind === 'added') {
      return this.addedMatchers.has(matcher);
    }
    if (matcher.kind === 'removed') {
      return this.removedMatchers.has(matcher);
    }
    return this.attributeMatchers.get(matcher.element)?.has(matcher) ?? false;
  }

  private unregister(matcher: Matcher): void {
    if (!this.isRegistered(matcher)) {
      return;
    }

    if (matcher.kind === 'added') {
      this.addedMatchers.delete(matcher);
    } else if (matcher.kind === 'removed') {
      this.removedMatchers.delete(matcher);
    } else {
      const forElement = this.attributeMatchers.get(matcher.element);
      forElement?.delete(matcher);
      if (forElement?.size === 0) {
        this.attributeMatchers.delete(matcher.element);
      }
    }
    this.configure();
  }

  // What the registered matchers need the observer to watch
  private getOptions(): MutationObserverInit | null {
    const attributeMatchers = [...this.attributeMatchers.values()].flatMap((forElement) => [...forElement]);

    if (this.addedMatchers.size === 0 && this.removedMatchers.size === 0 && attributeMatchers.length === 0) {
      return null;
    }

    if (attributeMatchers.length === 0) {
      return { childList: true, subtree: true };
    }

    const attributeFilter = [...new Set(attributeMatchers.flatMap((matcher) => matcher.attributeFilter))].sort();

    return { childList: true, subtree: true, attributes: true, attributeFilter };
  }

  // Observes with the options the matchers need, only touching the observer when they change (waitForElement
  // registers and unregisters often)
  private configure(): void {
    const options = this.getOptions();
    const key = options && JSON.stringify(options);

    if (key === this.observing) {
      return;
    }

    // Records already queued are still delivered to the matchers registered by then, as they would have been
    const pending = this.observer?.takeRecords() ?? [];
    this.observer?.disconnect();

    if (options) {
      this.observer ??= new MutationObserver((mutations) => this.handleMutations(mutations));
      this.observer.observe(document.documentElement, options);
    }

    this.observing = key;

    if (pending.length > 0) {
      queueMicrotask(() => this.handleMutations(pending));
    }
  }

  private handleMutations(mutations: MutationRecord[]): void {
    let removed = false;

    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        this.handleAdded(mutation.addedNodes);
        removed ||= mutation.removedNodes.length > 0;
      }

      if (mutation.type === 'attributes') {
        this.handleAttributeMatchers(mutation);
      }
    }

    if (removed) {
      this.handleRemoved();
    }
  }

  // Checked once a batch has been handled: an element moved within the page (removed, then added back) is still on it
  private handleRemoved(): void {
    for (const matcher of this.removedMatchers) {
      if (!matcher.element.isConnected) {
        this.fire(matcher, matcher.element as HTMLElement);
      }
    }
  }

  private handleAdded(addedNodes: NodeList): void {
    if (this.addedMatchers.size === 0) {
      return;
    }

    for (const node of addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      const element = node as HTMLElement;

      // A Set can be gone through while matchers unregister (a `once` firing) or register (from a callback): one
      // deleted before it's reached is skipped, so only a `once` matcher's own further matches need stopping (below)
      for (const matcher of this.addedMatchers) {
        if (!(matcher.root ?? document.body)?.contains(element)) {
          continue;
        }

        // A match can hold more matches (a list item holding a list): all are reported, unless only the first is wanted
        const matchesItself = element.matches(matcher.selector);
        const matches =
          matchesItself && matcher.once
            ? [element]
            : [...(matchesItself ? [element] : []), ...element.querySelectorAll<HTMLElement>(matcher.selector)];

        for (const match of matches) {
          if (matcher.once && !this.addedMatchers.has(matcher)) {
            break;
          }

          this.fire(matcher, match);
        }
      }
    }
  }

  private handleAttributeMatchers(mutation: MutationRecord): void {
    const forElement = this.attributeMatchers.get(mutation.target as Element);
    if (!forElement) {
      return;
    }

    for (const matcher of forElement) {
      if (matcher.attributeFilter.includes(mutation.attributeName ?? '')) {
        this.fire(matcher, mutation.target as HTMLElement);
      }
    }
  }

  // One matcher's callback throwing (or rejecting) mustn't stop the others, or the mutations still to handle
  private fire(matcher: Matcher, element: HTMLElement): void {
    if (matcher.once) {
      this.unregister(matcher);
    }

    const report = (error: unknown) => logger.error('mutation-observer', error);

    try {
      const result = matcher.callback(element);

      if (result instanceof Promise) {
        result.catch(report);
      }
    } catch (error) {
      report(error);
    }
  }

  /** Disconnects the shared observer and clears all matchers. Mainly useful for tests. */
  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.observing = null;
    this.addedMatchers.clear();
    this.removedMatchers.clear();
    // Each element's Set emptied too, not only the map: an attribute change being handled goes through its element's
    // Set, so stopped from one of its callbacks, the rest of that Set would still fire
    this.attributeMatchers.forEach((forElement) => forElement.clear());
    this.attributeMatchers.clear();
  }
}

export const mutationObserver = new MutationObserverServiceImpl();

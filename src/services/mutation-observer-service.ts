/**
 * A single real `MutationObserver` on `document.documentElement`, shared by
 * every consumer that would otherwise spin up its own. Just a
 * `MutationObserver` wrapper -- see `ResizeObserverService` for the
 * equivalent over `ResizeObserver`, kept as a separate service rather than
 * folded into this one since the two browser APIs have nothing in common
 * beyond both being "observers". Replaces:
 * - `utilities/html-element-util.ts`'s `waitForElement`/`waitForElements`,
 *   which used to create a transient observer per call.
 * - `features/miscellaneous-improvements/emojis/index.ts`'s `listen()`,
 *   which created a page-wide observer that was never disconnected (a
 *   confirmed leak in its own test suite: 6+ calls across `emojis.spec.ts`
 *   each left behind a live observer).
 * - `components/accordion/accordion.ts`'s own page-wide observer.
 *
 * Observing `document.documentElement` rather than `document.body` is
 * deliberate: this userscript runs at `document-start`, where `<body>`
 * doesn't exist yet. `ensureObserver` assigns `this.observer` before calling
 * `.observe()`, so if that call ever threw (`.observe(null, ...)` throws),
 * every later registration would silently no-op forever - the whole service
 * going dark for the rest of the page's life. `document.documentElement`
 * exists as soon as any script can run, and mutations under `document.body`
 * are still observed as its descendant, so nothing that scopes to `body`
 * loses coverage.
 */

type ElementCallback = (element: HTMLElement) => void | Promise<void>;

interface AddedMatcher {
  kind: 'added';
  selector: string;
  root: Document | Element;
  once: boolean;
  callback: ElementCallback;
}

interface MutationMatcher {
  kind: 'mutation';
  selector: string;
  attributeFilter?: string[];
  once: boolean;
  callback: ElementCallback;
}

type Matcher = AddedMatcher | MutationMatcher;

class MutationObserverServiceImpl {
  private observer: MutationObserver | null = null;
  private matchers: Matcher[] = [];

  /**
   * Fires `callback` when a node matching `selector` (itself or a
   * descendant) is added anywhere under `root` (default `document.body`).
   * Returns an unregister function. Pass `once: true` to auto-unregister
   * after the first match — this is what `waitForElement` uses.
   */
  onElementAdded(
    selector: string,
    callback: ElementCallback,
    opts: { root?: Document | Element; once?: boolean } = {}
  ): () => void {
    const matcher: AddedMatcher = {
      kind: 'added',
      selector,
      root: opts.root ?? document.body,
      once: opts.once ?? false,
      callback
    };

    return this.register(matcher);
  }

  /**
   * Fires `callback` when a `childList` or `attributes` mutation's target
   * lies within an element matching `selector` (the target itself or an
   * ancestor, via `closest()`). Matches accordion's original behaviour:
   * both content changes (nodes added/removed) and attribute changes (e.g.
   * a class toggle) re-fire the callback so it can resync derived state
   * like a max-height. Pass `attributeFilter` to only react to specific
   * attribute names, same as `MutationObserverInit.attributeFilter`.
   */
  onMutation(
    selector: string,
    callback: ElementCallback,
    opts: { attributeFilter?: string[]; once?: boolean } = {}
  ): () => void {
    const matcher: MutationMatcher = {
      kind: 'mutation',
      selector,
      attributeFilter: opts.attributeFilter,
      once: opts.once ?? false,
      callback
    };

    return this.register(matcher);
  }

  private register(matcher: Matcher): () => void {
    this.matchers.push(matcher);
    this.ensureObserver();

    return () => {
      this.matchers = this.matchers.filter((m) => m !== matcher);
    };
  }

  private ensureObserver(): void {
    if (this.observer) {
      return;
    }

    this.observer = new MutationObserver((mutations) => this.handleMutations(mutations));
    this.observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  }

  private handleMutations(mutations: MutationRecord[]): void {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        this.handleAdded(mutation.addedNodes);
      }

      this.handleMutationMatchers(mutation);
    }
  }

  private handleAdded(addedNodes: NodeList): void {
    const addedMatchers = this.matchers.filter((matcher): matcher is AddedMatcher => matcher.kind === 'added');
    if (addedMatchers.length === 0) {
      return;
    }

    for (const node of addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      const element = node as HTMLElement;

      for (const matcher of addedMatchers) {
        if (matcher.once && !this.matchers.includes(matcher)) {
          continue;
        }

        if (!matcher.root.contains(element)) {
          continue;
        }

        const matches = element.matches(matcher.selector)
          ? [element]
          : Array.from(element.querySelectorAll<HTMLElement>(matcher.selector));

        for (const match of matches) {
          if (matcher.once && !this.matchers.includes(matcher)) {
            break;
          }

          this.fire(matcher, match);
        }
      }
    }
  }

  private handleMutationMatchers(mutation: MutationRecord): void {
    const mutationMatchers = this.matchers.filter((matcher): matcher is MutationMatcher => matcher.kind === 'mutation');
    if (mutationMatchers.length === 0) {
      return;
    }

    if (mutation.type === 'childList' && mutation.addedNodes.length === 0 && mutation.removedNodes.length === 0) {
      return;
    }

    if (!(mutation.target instanceof HTMLElement)) {
      return;
    }

    for (const matcher of mutationMatchers) {
      if (
        matcher.attributeFilter &&
        mutation.type === 'attributes' &&
        !matcher.attributeFilter.includes(mutation.attributeName ?? '')
      ) {
        continue;
      }

      const match = mutation.target.closest<HTMLElement>(matcher.selector);
      if (match) {
        this.fire(matcher, match);
      }
    }
  }

  private fire(matcher: Matcher, element: HTMLElement): void {
    if (matcher.once) {
      this.matchers = this.matchers.filter((m) => m !== matcher);
    }

    void matcher.callback(element);
  }

  /** Disconnects the shared observer and clears all matchers. Mainly useful for tests. */
  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.matchers = [];
  }
}

export const mutationObserver = new MutationObserverServiceImpl();

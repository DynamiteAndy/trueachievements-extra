import { waitForElement } from '@ta-x-page';
import { useEffect, useState } from 'preact/hooks';

// The element `selector` finds under `root`: from the first render if it's already there (so effects using it run while
// the controller mounts, before the page's other tasks read what they change), or once it turns up (the script runs
// while the page loads), or null. The wait stops if the component goes first, and doesn't start while `wanted` is false
// (an option that's off)
export const useElement = (selector: string, root: Element | null, wanted = true): HTMLElement | null => {
  const [element, setElement] = useState<HTMLElement | null>(() => root?.querySelector<HTMLElement>(selector) ?? null);

  useEffect(() => {
    if (!wanted || !root || element) {
      return undefined;
    }

    const gone = new AbortController();
    void waitForElement(selector, { root, signal: gone.signal }).then((found) => {
      if (!gone.signal.aborted) {
        setElement(found);
      }
    });

    return () => gone.abort();
  }, [selector, root, wanted, element]);

  return element;
};

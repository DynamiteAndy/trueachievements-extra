import { mutationObserver } from '@ta-x-services';

export const isSelectElement = (el: HTMLElement): boolean => el.nodeName === 'SELECT';
export const isCheckboxElement = (el: HTMLElement): boolean =>
  el.nodeName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox';

export const classListContains = (element: HTMLElement | Element | null, classes: string | string[]): boolean => {
  const classArray = Array.isArray(classes) ? classes : [classes];
  return classArray.some((className: string) => element?.classList?.contains(className));
};

export const waitForElement = async <T extends Element = HTMLElement>(
  selector: string,
  root: Document | Element | null = document.documentElement,
  timeoutMS = 10_000,
  signal?: AbortSignal
): Promise<T | null> => {
  const elements = await waitForElements<T>(selector, root, timeoutMS, signal);
  return elements[0] ?? null;
};

/** `signal` lets a caller give up early (e.g. on a failed ajax response the awaited markup
 * depends on) instead of waiting out the full `timeoutMS`; an already-aborted signal resolves
 * immediately with `[]`. */
export const waitForElements = async <T extends Element = HTMLElement>(
  selector: string,
  root: Document | Element | null = document.documentElement,
  timeoutMS = 10_000,
  signal?: AbortSignal
): Promise<T[]> => {
  if (!root) {
    return [];
  }

  const initialMatches = Array.from(root.querySelectorAll<T>(selector));
  if (initialMatches.length > 0) {
    return initialMatches;
  }

  if (signal?.aborted) {
    return [];
  }

  return new Promise<T[]>((resolve) => {
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
      resolve([]);
    };

    signal?.addEventListener('abort', onAbort, { once: true });

    unregister = mutationObserver.onElementAdded(
      selector,
      (addedElement) => {
        const matches = Array.from(root.querySelectorAll<T>(selector));
        const results = matches.length > 0 ? matches : [addedElement as unknown as T];

        cleanup();
        resolve(results);
      },
      { root }
    );

    timeoutId = setTimeout(() => {
      cleanup();
      resolve([]);
    }, timeoutMS);
  });
};

export const waitForAttributeChange = (element: HTMLElement, attributeFilter: string[], timeoutMs = 1000): Promise<void> =>
  new Promise((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let unregister: (() => void) | undefined;

    const cleanup = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      unregister?.();
    };

    unregister = mutationObserver.onMutation(
      '*',
      (changedElement) => {
        if (changedElement !== element) {
          return;
        }

        cleanup();
        resolve();
      },
      { attributeFilter }
    );

    timeoutId = setTimeout(() => {
      cleanup();
      resolve();
    }, timeoutMs);
  });

export const getElementCoordinates = (element: HTMLElement): { top: number; left: number } => {
  const box = element.getBoundingClientRect();
  const docEl = document.documentElement;

  const scrollTop = window.scrollY || docEl.scrollTop;
  const scrollLeft = window.scrollX || docEl.scrollLeft;

  const top = box.top + scrollTop - docEl.clientTop;
  const left = box.left + scrollLeft - docEl.clientLeft;

  return {
    top: Math.round(top),
    left: Math.round(left),
  };
};

export const removeAllChildren = (element: HTMLElement): void => {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
};

export const waitForImages = (el: HTMLElement | Element): Promise<void> =>
  new Promise((resolve) => {
    const images = Array.from(el.querySelectorAll<HTMLImageElement>('img'));
    const pendingImages = images.filter((img) => img.src !== '' && !img.complete);

    if (pendingImages.length === 0) {
      resolve();
      return;
    }

    let loadedCount = 0;
    const checkDone = () => {
      loadedCount++;

      if (loadedCount === pendingImages.length) {
        resolve();
      }
    };

    pendingImages.forEach((imgEl) => {
      const tracker = new Image();
      tracker.addEventListener('load', checkDone, { once: true });
      tracker.addEventListener('error', checkDone, { once: true });
      tracker.src = imgEl.src;
    });
  });

export const extractText = (element: HTMLElement | Element): string[] =>
  [...element.childNodes]
    .filter((child) => (child.nodeType === 3 || child.nodeName === 'STRONG') && child.parentNode === element)
    .filter((child) => child.textContent.trim())
    .map((textNode) => textNode.textContent.trim());

// TA-X Elements

export const isTAXListElement = (el: HTMLElement): boolean => {
  if (el.nodeName !== 'DIV' || !el.classList.contains('frm-lst')) {
    return false;
  }

  return el.querySelector(`#${el.getAttribute('data-list-id')}`) !== null;
};

export const isTAXChildListElement = (el: HTMLElement): boolean => {
  if (!el.getAttribute('data-for-list')) {
    return false;
  }

  const parent = el.closest('.frm-lst');
  if (parent === null) {
    return false;
  }

  return parent.querySelector(`#${parent.getAttribute('data-list-id')}`) !== null;
};

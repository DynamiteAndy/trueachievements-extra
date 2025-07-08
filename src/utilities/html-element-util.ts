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
  timeoutMS = 10_000
): Promise<T | null> => {
  if (!root) return null;

  const found = root.querySelector<T>(selector);
  if (found) return found;

  return new Promise<T | null>((resolve) => {
    const timeout = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeoutMS);

    const observer = new MutationObserver(() => {
      const el = root.querySelector<T>(selector);
      if (el) {
        observer.disconnect();
        clearTimeout(timeout);
        resolve(el);
      }
    });

    observer.observe(root, { childList: true, subtree: true });
  });
};

export const waitForElements = async <T extends Element = HTMLElement>(
  selector: string,
  root: Document | Element | null = document.documentElement,
  timeoutMS = 10_000
): Promise<T[]> => {
  if (!root) return [];

  const found = [...root.querySelectorAll<T>(selector)];
  if (found.length) return found;

  return new Promise<T[]>((resolve) => {
    const timeout = setTimeout(() => {
      observer.disconnect();
      resolve([]);
    }, timeoutMS);

    const observer = new MutationObserver(() => {
      const found = [...root.querySelectorAll<T>(selector)];
      if (found.length) {
        observer.disconnect();
        clearTimeout(timeout);
        resolve(found);
      }
    });

    observer.observe(root, { childList: true, subtree: true });
  });
};

export const getElementCoordinates = (element: HTMLElement): { top: number; left: number } => {
  const box = element.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;
  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
};

export const removeAllChildren = (element: HTMLElement): void => {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
};

export const waitForImages = (el: HTMLElement | Element): Promise<void> =>
  new Promise((resolve) => {
    const allImgs: { src: string; element: HTMLImageElement }[] = [];
    const filtered = ([...el.querySelectorAll('img')] as HTMLImageElement[]).filter((imgEl: HTMLImageElement) => {
      if (imgEl.src === '') {
        return false;
      }

      const img = new Image();
      img.src = imgEl.src;
      return !img.complete;
    });

    filtered.forEach((item: HTMLImageElement) => {
      allImgs.push({
        src: item.src,
        element: item
      });
    });

    const allImgsLength = allImgs.length;
    let allImgsLoaded = 0;

    if (allImgsLength === 0) {
      resolve();
    }

    allImgs.forEach((img) => {
      const image = new Image();
      const resolveIfLoaded = () => {
        allImgsLoaded++;

        if (allImgsLoaded === allImgsLength) {
          resolve();
        }
      };

      image.addEventListener('load', resolveIfLoaded);
      image.addEventListener('error', resolveIfLoaded);

      image.src = img.src;
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

export const isSelectElement = (el: HTMLElement): boolean => el.nodeName === 'SELECT';
export const isCheckboxElement = (el: HTMLElement): boolean => el.nodeName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox';

export const classListContains = (element: HTMLElement, classes: string|string[]): boolean => {
  const classArray = Array.isArray(classes) ? classes : [classes];

  for (let i = 0; i < classArray.length; i++) {
    if (element.classList.contains(classArray[i])) {
      return true;
    }
  }

  return false;
};

export const waitForElement = (selector: string, element: Document | HTMLElement | Element = document.documentElement, timeoutMS = 10000): Promise<HTMLElement> => new Promise(resolve => {
  if (element === null) return null;
  if (element === document.documentElement) {
    element = document.documentElement;
  } 
  
  if (element.querySelector(selector)) {
    return resolve(element.querySelector(selector) as HTMLElement);
  }

  /* eslint-disable prefer-const */
  let observer: MutationObserver;
  /* eslint-enable prefer-const */

  const timeout = setTimeout(() => {
    observer.disconnect();
    resolve(null);
  }, timeoutMS);

  observer = new MutationObserver(() => {
    if (element.querySelector(selector)) {
      observer.disconnect();
      clearTimeout(timeout);
      resolve(element.querySelector(selector) as HTMLElement);
    }
  });

  observer.observe(element, {
    childList: true,
    subtree: true
  });
});
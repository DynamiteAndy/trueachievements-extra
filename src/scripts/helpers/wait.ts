export const waitForElement = (selector: string, element: Document | HTMLElement = document.documentElement, timeoutMS = 10000): Promise<HTMLElement> => new Promise(resolve => {
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

  observer.observe(element || document.documentElement, {
    childList: true,
    subtree: true
  });
});

export const until = (predFn) => {
  const poll = (done: any) => (predFn() ? done() : setTimeout(() => poll(done), 250));
  return new Promise(poll);
};
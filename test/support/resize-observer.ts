import { resizeObserver } from '@ta-x-page';

import { required } from './elements';

// The shared resize observer, stubbed for this test (happy-dom lays nothing out, so nothing ever resizes): it keeps
// each element's callback for the test to call, and stops following an element when its stop function is called. The
// spy is restored with the others when the test ends
export const stubResizeObserver = () => {
  const followed = new Map<Element, () => void>();
  const observe = vi.spyOn(resizeObserver, 'observe').mockImplementation((element, callback) => {
    followed.set(element, () => callback({} as ResizeObserverEntry));
    return () => {
      followed.delete(element);
    };
  });

  return {
    observe,
    // The element resizing, as the resize observer reports it
    resize: (element: Element): void => required(followed.get(element))(),
    // Whether the element's size is still followed
    follows: (element: Element): boolean => followed.has(element),
    // How many elements' sizes are followed
    followedSizes: (): number => followed.size
  };
};

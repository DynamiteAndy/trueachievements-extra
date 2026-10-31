import { find, setHtml, stubResizeObserver } from '@ta-x-test';

import type { MockInstance } from 'vitest';

import { stickUnderHeader, type StickUnderHeaderOptions } from './stick-under-header';
import * as stickyHelperModule from './sticky';
import styles from './styles';

// For the stickUnderHeader specs, which spec it on the editor's toolbar (the real edit page's markup), the first
// element it looked after: the editor and its toolbar, the site's header, and what the page does to them. Each spec
// calls `useFakeTimers` and `setUpEditor` in its beforeEach
export const { variables } = styles;

export const container = (): HTMLElement => find('.mce-tinymce');
export const toolbar = (): HTMLElement => find('.mce-toolbar-grp');
const editArea = (): HTMLElement => find<HTMLElement>('.mce-edit-area', container());
// The place it holds while stuck, null where a test checks it's gone
export const spacer = (): HTMLElement | null => {
  const before = toolbar().previousElementSibling;
  return before instanceof HTMLElement && before.classList.contains(styles.spacer) ? before : null;
};
export const ownVariable = (name: string): string => toolbar().style.getPropertyValue(name);
export const stuck = (): boolean => toolbar().classList.contains(styles.stuck);
export const atEnd = (): boolean => toolbar().classList.contains(styles.atEnd);

export const scroll = async (): Promise<void> => {
  window.dispatchEvent(new Event('scroll'));
  await vi.advanceTimersByTimeAsync(0);
};
// One of the element's transitions ending (happy-dom runs none)
export const transitionEnd = (element: Element, propertyName: string): void => {
  element.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName }));
};

// The editor `top` px down the window (negative once scrolled past), `height` px tall
export const placeEditorAt = (top: number, height = 800): void => {
  container().getBoundingClientRect = () => ({ top, height, bottom: top + height, left: 0 }) as DOMRect;
};
export const editAreaBottom = (bottom: number): void => {
  editArea().getBoundingClientRect = () => ({ bottom }) as DOMRect;
};

// The resize observer's stub (happy-dom doesn't lay anything out)
let resizes: ReturnType<typeof stubResizeObserver>;
// The sticky helper, stubbed
let sticky: MockInstance<typeof stickyHelperModule.applyStickyElementStyle>;

// The element resizing, as its resize observer reports it
export const resize = (element: Element): void => resizes.resize(element);
// How many elements' sizes are followed
export const followedSizes = (): number => resizes.followedSizes();
// The sticky helper's stub, which places the element under the header
export const stickyHelper = (): MockInstance<typeof stickyHelperModule.applyStickyElementStyle> => sticky;

// On fake timers (the spec's own `useFakeTimers()`)
export const setUpEditor = (): void => {
  resizes = stubResizeObserver();
  setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-editor.html');
  Object.defineProperty(toolbar(), 'offsetHeight', { value: 68, configurable: true });
  toolbar().getBoundingClientRect = () => ({ top: 399, left: 0, height: 68, width: 1170 }) as DOMRect;
  placeEditorAt(399);
  editAreaBottom(1200);
  // The site's header isn't in the fixture, so the sticky helper is stubbed: it puts the element 79px down (on the
  // element itself, as the helper does)
  sticky = vi
    .spyOn(stickyHelperModule, 'applyStickyElementStyle')
    .mockImplementation((property, element, _container, _header, opts) => {
      element.style.setProperty(property, `${79 + (opts?.paddingFromTop ?? 0)}px`);
    });
};

// Looks after the toolbar, kept above the editing area unless `options` says otherwise; stopped when the test ends
// (stopping it again is harmless)
export const stickToolbar = (options: Partial<StickUnderHeaderOptions> = {}): (() => void) => {
  const stop = stickUnderHeader({
    element: toolbar(),
    container: container(),
    end: editArea(),
    ...options
  });
  onTestFinished(stop);
  return stop;
};

// The site's <header> (79px tall), which the fixture doesn't have
export const siteHeader = (): HTMLElement => {
  const header = document.createElement('header');
  Object.defineProperty(header, 'offsetHeight', { value: 79, configurable: true });
  document.body.prepend(header);
  return header;
};

// The header sliding: Chrome's transition on it, from one transform to another (happy-dom runs no animations).
// `begun: false`: just begun, with no start time until its first frame (`begin`)
export const headerSliding = (from: string, to: string, { begun = true } = {}) => {
  const header = find('header');
  let begin = (): void => undefined;
  let end = (): void => undefined;
  const startTime = 1000 + header.getAnimations().length;
  const slide = {
    transitionProperty: 'transform',
    startTime: begun ? startTime : null,
    ready: new Promise<void>((resolve) => {
      begin = () => {
        slide.startTime = startTime;
        resolve();
      };
    }),
    finished: new Promise<void>((resolve) => {
      end = resolve;
    }),
    effect: {
      getKeyframes: () => [
        { offset: 0, easing: 'linear', transform: from },
        { offset: 1, easing: 'linear', transform: to }
      ],
      getTiming: () => ({ duration: 500, delay: 0, easing: 'ease' })
    }
  };
  header.getAnimations = () => [slide as unknown as Animation];
  return Object.assign(slide as unknown as Animation, { begin: () => begin(), end: () => end() });
};

// The element's copies of the header's slides: each cancellable, with every start time it's given (given none, a
// running animation stops where it is)
export const copiesOfSlides = () => {
  const made: { startTime: number | null; startTimes: (number | null)[]; cancel: ReturnType<typeof vi.fn> }[] = [];
  const animate = vi.fn((_keyframes: Keyframe[], _options: KeyframeAnimationOptions) => {
    const startTimes: (number | null)[] = [];
    const copy = {
      startTimes,
      cancel: vi.fn(),
      get startTime(): number | null {
        return startTimes.at(-1) ?? null;
      },
      set startTime(time: number | null) {
        startTimes.push(time);
      }
    };
    made.push(copy);
    return copy as unknown as Animation;
  });
  toolbar().animate = animate;

  return { animate, last: () => made[made.length - 1] };
};

// The header's slide (its show / hide transform), as far as it has got: the stuck element's is a copy of it
export const slidTo = (y: number): void => {
  find<HTMLElement>('header').style.transform = `matrix(1, 0, 0, 1, 0, ${y})`;
};

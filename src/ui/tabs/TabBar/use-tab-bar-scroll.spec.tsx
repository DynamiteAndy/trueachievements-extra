import { find, mountInPage, stubResizeObserver } from '@ta-x-test';
import { useRef } from 'preact/hooks';
import { act } from 'preact/test-utils';

import type { Mock } from 'vitest';

import styles from '../styles';
import { TabLink } from '../TabLink';

import { scrollTargetFor, useDragScroll, useScrollToSelected } from './use-tab-bar-scroll';

describe('useDragScroll', () => {
  // A tab bar with two tabs, dragged by the hook
  const Bar = () => {
    const tabBar = useRef<HTMLUListElement>(null);
    useDragScroll(tabBar);

    return (
      <ul ref={tabBar} class={styles.tabsLinkContainer}>
        {['one', 'two'].map((id) => (
          <TabLink key={id} id={id} selected={id === 'one'} onClick={() => undefined}>
            {id}
          </TabLink>
        ))}
      </ul>
    );
  };

  beforeEach(() => {
    mountInPage(<Bar />);
  });

  test('should let the tab bar be dragged sideways', () => {
    const bar = find<HTMLElement>(`.${styles.tabsLinkContainer}`);
    // happy-dom doesn't work pageX out from clientX
    const mouse = (type: string, pageX: number) =>
      bar.dispatchEvent(Object.assign(new MouseEvent(type, { bubbles: true, cancelable: true }), { pageX }));

    bar.scrollLeft = 30;
    mouse('mousedown', 100);
    expect(bar).toHaveExactClasses([styles.tabsLinkContainer, styles.tabScroll]);

    mouse('mousemove', 90);
    expect(bar.scrollLeft).toBe(60);

    mouse('mouseleave', 90);
    expect(bar).toHaveExactClasses([styles.tabsLinkContainer]);

    mouse('mousemove', 50);
    expect(bar.scrollLeft).toBe(60);
  });

  // A right press can open the context menu, which takes its release and would leave the drag going
  test.each([1, 2])('should not drag the tab bar with mouse button %i', (button) => {
    const bar = find<HTMLElement>(`.${styles.tabsLinkContainer}`);
    const mouse = (type: string, pageX: number) =>
      bar.dispatchEvent(Object.assign(new MouseEvent(type, { bubbles: true, cancelable: true, button }), { pageX }));

    bar.scrollLeft = 30;
    mouse('mousedown', 100);
    mouse('mousemove', 90);

    expect(bar).toHaveExactClasses([styles.tabsLinkContainer]);
    expect(bar.scrollLeft).toBe(30);
  });
});

describe('scrollTargetFor', () => {
  // A 300px bar scrolled to scrollLeft, and a link whose box starts at linkLeft (as on screen) and is 100px wide
  const measure = ({
    scrollLeft = 0,
    clientWidth = 300,
    linkLeft
  }: {
    scrollLeft?: number;
    clientWidth?: number;
    linkLeft: number;
  }) => {
    const bar = document.createElement('ul');
    const link = document.createElement('li');
    Object.defineProperty(bar, 'clientWidth', { value: clientWidth });
    Object.defineProperty(bar, 'scrollLeft', { value: scrollLeft });
    bar.getBoundingClientRect = () => ({ left: 10, width: clientWidth }) as DOMRect;
    link.getBoundingClientRect = () => ({ left: 10 + linkLeft, width: 100 }) as DOMRect;
    return scrollTargetFor(bar, link);
  };

  test('leaves a tab that is already in view', () => {
    expect(measure({ linkLeft: 150 })).toBeNull();
  });

  test("scrolls just far enough to show a tab past the bar's right edge", () => {
    // It runs from 250 to 350 in the content, so the bar scrolls 50px to end at 350
    expect(measure({ linkLeft: 250 })).toBe(50);
  });

  test("scrolls back to show a tab past the bar's left edge", () => {
    // Scrolled 200px, a tab 50px left of the bar's edge starts at 150 in the content
    expect(measure({ scrollLeft: 200, linkLeft: -50 })).toBe(150);
  });

  test('leaves a bar with no width alone (hidden, as in the closed settings menu)', () => {
    expect(measure({ clientWidth: 0, linkLeft: 250 })).toBeNull();
  });
});

describe('useScrollToSelected', () => {
  let bar: HTMLElement;
  let resizes: ReturnType<typeof stubResizeObserver>;
  let scrollTo: Mock<(options: ScrollToOptions) => void>;

  // A bar 100px wide holding a selected link 150px to 250px along, past its right edge
  const Bar = ({ selected }: { selected: string }) => {
    const ref = useRef<HTMLUListElement>(null);
    useScrollToSelected(ref, selected);

    return (
      <ul ref={ref}>
        <li role="tab" aria-selected="true">
          {selected}
        </li>
      </ul>
    );
  };

  const mountBar = () => {
    const { root } = mountInPage(<Bar selected="two" />);
    bar = find('ul');
    Object.defineProperty(bar, 'clientWidth', { value: 100, configurable: true });
    bar.getBoundingClientRect = () => ({ left: 0, width: 100 }) as DOMRect;
    find('li', bar).getBoundingClientRect = () => ({ left: 150, width: 100 }) as DOMRect;
    scrollTo = vi.fn<(options: ScrollToOptions) => void>();
    bar.scrollTo = scrollTo as HTMLElement['scrollTo'];
    return root;
  };

  beforeEach(() => {
    resizes = stubResizeObserver();
  });

  test("watches the bar's size through the shared resize observer", () => {
    mountBar();

    expect(resizes.observe).toHaveBeenCalledExactlyOnceWith(bar, expect.any(Function));
  });

  test('scrolls the selected tab into view at once when the bar resizes', () => {
    mountBar();

    resizes.resize(bar);

    // 250 - 100: just far enough to show the link's right edge
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 150, behavior: 'auto' });
  });

  // Someone who asked their system for less motion gets the jump, not the smooth scroll
  test.each([
    { motion: 'with motion on', reduced: false, behavior: 'smooth' },
    { motion: 'with reduced motion', reduced: true, behavior: 'auto' }
  ])('scrolls a newly selected tab into view ($behavior) $motion', async ({ reduced, behavior }) => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) => ({ matches: reduced && query === '(prefers-reduced-motion: reduce)' }) as MediaQueryList
    );
    const root = mountBar();
    scrollTo.mockClear();

    await act(() => root.render(<Bar selected="three" />));

    expect(scrollTo).toHaveBeenCalledWith({ left: 150, behavior });
  });

  test('stops watching once unmounted', async () => {
    const root = mountBar();

    expect(resizes.follows(bar)).toBe(true);
    await act(() => root.unmount());

    expect(resizes.follows(bar)).toBe(false);
  });
});

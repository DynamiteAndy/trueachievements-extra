import { httpIntercept } from '@ta-x-fetch';
import { slideClasses, stickyHeaderHeight, intersectionObserver } from '@ta-x-page';
import { isAppliedLive, settings } from '@ta-x-storage';
import {
  changeSettingLive,
  expectAppliesLive,
  find,
  required,
  setHtml,
  setSettings,
  stubResizeObserver,
  tick,
  useFakeTimers
} from '@ta-x-test';
import { act } from 'preact/test-utils';

import type { MockInstance } from 'vitest';

import { settingsMenuOpen } from '../settings-menu';

import { narrowestColumn } from './fit-menus';
import { USER_SCROLL_MS } from './StickyHeader';
import styles from './styles';

import stickyHeader from '.';

describe('sticky-header', () => {
  const { stickyHeader: stickyHeaderClass } = styles;
  const { yHide, yHideNoTransition, yShow } = slideClasses;
  const header = (): HTMLElement => find('header');
  const siteMenu = (): HTMLElement => find('.nav-gamer');
  const animations = (): string[] =>
    [yShow, yHide, yHideNoTransition].filter((className) => header().classList.contains(className));
  let scrollTop: number;
  let observeIntersection: MockInstance<(typeof intersectionObserver)['observe']>;

  // The header's visibility is the controller's state, so the re-render is flushed before checking it
  // The user scrolling: a wheel, then the scroll it makes
  const scrollTo = async (top: number): Promise<void> => {
    scrollTop = top;
    await act(() => {
      window.dispatchEvent(new Event('wheel'));
      window.dispatchEvent(new Event('scroll'));
    });
  };

  // The browser scrolling on its own: putting a reloaded page back, or keeping content in view as the page shifts
  const browserScrollsTo = async (top: number): Promise<void> => {
    scrollTop = top;
    await act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  };

  // Runs it, stopping it when the test ends (inside act, so its effects' clean-ups run; stopping again is harmless);
  // resolves with its stop once the header it waits for is fixed
  const run = async (): Promise<() => void> => {
    let stop = (): void => undefined;
    await act(async () => {
      stop = stickyHeader();
      await tick();
    });
    onTestFinished(() => act(stop));

    return stop;
  };

  beforeEach(() => {
    scrollTop = 0;
    vi.spyOn(document.documentElement, 'scrollTop', 'get').mockImplementation(() => scrollTop);
    setSettings({
      'allPages.stickyHeader.enabled': true,
      'allPages.stickyHeader.remainStuck': false
    });
    // Whether the page is at its top: the spacer on screen (scrolled past it by default)
    observeIntersection = vi.spyOn(intersectionObserver, 'observe').mockImplementation((_, callback) => {
      callback({ isIntersecting: false } as IntersectionObserverEntry);
      return () => undefined;
    });
    setHtml('@ta-x-test-views/home-page/header-signed-in.html');
  });

  test('should fix the header, with a spacer holding its place before it', async () => {
    const before = header().previousElementSibling;

    await run();

    expect(header().classList).toContain(stickyHeaderClass);
    expect(required(header().previousElementSibling).previousElementSibling).toBe(before);
  });

  test("should keep the header's height variable and its spacer in step as the header grows (the site fills it in after load)", async () => {
    const heightVariable = (): string => document.documentElement.style.getPropertyValue(stickyHeaderHeight);
    const spacerHeight = (): string => required(header().previousElementSibling as HTMLElement | null).style.height;
    let height = 50;
    Object.defineProperty(header(), 'offsetHeight', { get: () => height, configurable: true });
    const { observe, resize } = stubResizeObserver();

    await run();
    expect([heightVariable(), spacerHeight()]).toEqual(['50px', '50px']);

    height = 79;
    await act(() => resize(header()));

    expect(observe.mock.calls.filter(([element]) => element === header())).toHaveLength(1);
    expect([heightVariable(), spacerHeight()]).toEqual(['79px', '79px']);
  });

  test('should take the height the header has grown to by the time it starts watching, with no resize to say so', async () => {
    // The resize service may already watch the header, so it sends this listener nothing
    let reads = 0;
    Object.defineProperty(header(), 'offsetHeight', { get: () => (reads++ === 0 ? 50 : 79), configurable: true });
    stubResizeObserver();

    await run();

    expect(required(header().previousElementSibling as HTMLElement | null).style.height).toBe('79px');
  });

  test("should stay as it is when the browser keeps the page still as the header changes height, just after the user's wheel", async () => {
    let height = 50;
    Object.defineProperty(header(), 'offsetHeight', { get: () => height, configurable: true });
    const { resize } = stubResizeObserver();
    await run();
    await scrollTo(300);
    await scrollTo(600);
    await scrollTo(500);
    expect(animations()).toEqual([yShow]);

    // Growing (the promo bar filled in) moves the page down by as much, within a second of the wheel
    height = 79;
    await act(() => resize(header()));
    await browserScrollsTo(529);
    expect(animations()).toEqual([yShow]);

    // Shrinking back while out of view moves it up by as much
    await scrollTo(800);
    expect(animations()).toEqual([yHide]);
    height = 50;
    await act(() => resize(header()));
    await browserScrollsTo(771);
    expect(animations()).toEqual([yHide]);

    // The user's next scroll compares with where the page really is: down from 771, though above 800
    await scrollTo(780);
    expect(animations()).toEqual([yHide]);
    await scrollTo(760);
    expect(animations()).toEqual([yShow]);
  });

  test('should come back into its place when the browser keeps the page still as the header shrinks, landing at the top', async () => {
    let height = 79;
    Object.defineProperty(header(), 'offsetHeight', { get: () => height, configurable: true });
    const { resize } = stubResizeObserver();
    // Loaded 29px down: out of view from the start (intended), as the page has been scrolled past it
    const scrollY = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(29);
    await run();
    expect(animations()).toEqual([yHideNoTransition]);
    scrollY.mockRestore();
    scrollTop = 29;

    // Narrower, the header loses 29px: the page moves up by as much, to its very top
    height = 50;
    await act(() => resize(header()));
    await browserScrollsTo(0);

    // Not left out of view over an empty space
    expect(animations()).toEqual([]);
  });

  test('should slide in on the first scroll up from where a reloaded page was put back before it started', async () => {
    // The browser put the page back 1200px down before the script ran, with no scroll event after it
    const scrollY = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1200);
    await run();
    expect(animations()).toEqual([yHideNoTransition]);
    scrollY.mockRestore();

    await scrollTo(1100);

    expect(animations()).toEqual([yShow]);
  });

  test('should go out of view without sliding when the browser puts a reloaded page back part way down', async () => {
    // Mounted before the browser restores the position: the page is at its top then
    await run();
    expect(animations()).toEqual([]);

    await browserScrollsTo(617);

    expect(animations()).toEqual([yHideNoTransition]);
  });

  test.each([
    { scrollY: 500, page: 'part way down' },
    { scrollY: 40, page: "less than the header's 79px down (intended)" }
  ])('should start out of view, without sliding, on a page loaded $page', async ({ scrollY }) => {
    Object.defineProperty(header(), 'offsetHeight', { get: () => 79, configurable: true });
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(scrollY);

    await run();

    expect(animations()).toEqual([yHideNoTransition]);
  });

  test('should stay put on scroll when set to remain stuck', async () => {
    setSettings({ 'allPages.stickyHeader.remainStuck': true });
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(500);

    await run();
    await scrollTo(300);
    await scrollTo(600);

    expect(header().classList).toContain(stickyHeaderClass);
    expect(animations()).toEqual([]);
  });

  // Remain Stuck applies as it changes
  describe('Remain Stuck changed with the page open', () => {
    const { remainStuck } = settings.allPages.stickyHeader;
    const setRemainStuck = (value: boolean): Promise<void> => changeSettingLive(remainStuck, value);

    test('should bring a hidden header back and keep it in view once ticked', async () => {
      await run();
      await scrollTo(300);
      await scrollTo(600);
      expect(animations()).toEqual([yHide]);

      await setRemainStuck(true);
      expect(animations()).toEqual([yShow]);

      await scrollTo(900);
      expect(animations()).toEqual([yShow]);
    });

    test('should slide out of view again scrolling down once unticked', async () => {
      setSettings({ 'allPages.stickyHeader.remainStuck': true });
      await run();
      await scrollTo(300);
      expect(animations()).toEqual([]);

      await setRemainStuck(false);
      // In view until the next scroll down, rather than snapping away
      expect(animations()).toEqual([]);

      await scrollTo(600);
      expect(animations()).toEqual([yHide]);
      await scrollTo(500);
      expect(animations()).toEqual([yShow]);
    });

    // Registered as applied live, the settings menu's reload notice leaves it out (reload-notice.spec); unmounted, it's
    // left in again
    test('should need no reload while mounted (registered as applied live), and be let go of once unmounted', async () => {
      const unmount = await run();
      expect(isAppliedLive(remainStuck)).toBe(true);

      await act(unmount);

      expect(isAppliedLive(remainStuck)).toBe(false);
    });
  });

  test("should stop waiting for the site's gamer panel once unmounted, letting go of the site's requests", async () => {
    siteMenu().remove();
    const unmount = await run();
    // Waiting for the panel listens for the site's gamerheader request
    expect(httpIntercept.intercepting).toBe(true);

    await act(unmount);
    await tick();

    expect(httpIntercept.intercepting).toBe(false);
  });

  test('should give the header back as it was once unmounted', async () => {
    const before = required(header().parentElement).innerHTML;
    const unmount = await run();
    await scrollTo(300);
    await scrollTo(600);

    await act(unmount);
    await scrollTo(300);

    // Exactly: the fixture's header gets no empty class attribute
    expect(required(header().parentElement).innerHTML).toBe(before);
  });

  // Shift+Tab up from the page into a slid-away header: the browser doesn't scroll for a fixed element, so it would
  // focus links out of sight
  test('should come into view when the focus goes into it while slid away', async () => {
    await run();
    await scrollTo(800);
    await scrollTo(900);
    expect(animations()).toEqual([yHide]);

    await act(() => find('a', header()).focus());

    expect(animations()).toEqual([yShow]);
  });

  test('should stop following the focus once stopped', async () => {
    const stop = await run();
    await scrollTo(800);
    await scrollTo(900);
    expect(animations()).toEqual([yHide]);

    await act(stop);
    header().classList.add(yHide);
    await act(() => find('a', header()).focus());

    expect(animations()).toEqual([yHide]);
  });

  // A control the keyboard focuses, or an anchor jumped to, lands below the fixed header rather than under it
  test("should make the page scroll focus and anchors to below the header, by the header's height", async () => {
    const unmount = await run();

    expect(document.documentElement.style.getPropertyValue('scroll-padding-top')).toBe(
      document.documentElement.style.getPropertyValue(stickyHeaderHeight)
    );
    expect(document.documentElement.style.getPropertyValue('scroll-padding-top')).not.toBe('');

    await act(unmount);
    expect(document.documentElement.style.getPropertyValue('scroll-padding-top')).toBe('');
  });

  test("should let go of the page once unmounted: the header's height variable and size, and the window's inputs", async () => {
    const { follows } = stubResizeObserver();
    const adding = vi.spyOn(window, 'addEventListener');
    const removing = vi.spyOn(window, 'removeEventListener');
    // Each listener with whether it's caught on the way down: one removed without its capture is still there
    const listeners = (calls: unknown[][]): unknown[][] =>
      calls.map(([type, listener, options]) => [
        type,
        listener,
        typeof options === 'object' ? Boolean((options as EventListenerOptions).capture) : Boolean(options)
      ]);
    const unmount = await run();
    expect(follows(header())).toBe(true);
    expect(document.documentElement.style.getPropertyValue(stickyHeaderHeight)).not.toBe('');
    expect(adding.mock.calls.map(([type]) => type)).toEqual(
      expect.arrayContaining(['wheel', 'touchmove', 'keydown', 'pointerdown', 'pointerup', 'scroll'])
    );

    await act(unmount);

    expect(follows(header())).toBe(false);
    expect(document.documentElement.style.getPropertyValue(stickyHeaderHeight)).toBe('');
    expect(listeners(removing.mock.calls)).toEqual(expect.arrayContaining(listeners(adding.mock.calls)));
  });

  describe('turned on and off with the page open (applied live)', () => {
    const changeEnabled = (value: boolean): Promise<void> =>
      act(() => changeSettingLive(settings.allPages.stickyHeader.enabled, value));

    test('should need no reload while running (registered as applied live), and be let go of once stopped', async () => {
      const stop = await run();
      expect(isAppliedLive(settings.allPages.stickyHeader.enabled)).toBe(true);

      await act(stop);

      expect(isAppliedLive(settings.allPages.stickyHeader.enabled)).toBe(false);
    });

    test('should apply live: on, off and on again give the same page each time', async () => {
      setSettings({ 'allPages.stickyHeader.enabled': false });
      await run();

      await expectAppliesLive(settings.allPages.stickyHeader.enabled, () => required(header().parentElement).innerHTML);
    });

    test('should fix the header once turned on', async () => {
      setSettings({ 'allPages.stickyHeader.enabled': false });
      const before = header().previousElementSibling;
      await run();
      expect(header().classList).not.toContain(stickyHeaderClass);
      // No spacer
      expect(header().previousElementSibling).toBe(before);

      await changeEnabled(true);
      await act(tick);

      expect(header().classList).toContain(stickyHeaderClass);
      expect(required(header().previousElementSibling).previousElementSibling).toBe(before);
    });
  });

  describe('Fit Menus To Window', () => {
    const { fitMenus } = settings.allPages.stickyHeader;
    const { fitMenu, fitMenuColumns, fitMenuGroup, fitMenuScrolls, variables } = styles;
    // The menu's top in the window, under its item
    const MENU_TOP = 36;
    const item = (): HTMLElement => find('.nav-primary .items > li');
    let menuHeight: number;
    let windowHeight: number;
    let windowWidth: number;

    // The pointer entering the item, which shows its menu
    const openMenu = (): void => {
      item().dispatchEvent(new PointerEvent('pointerenter'));
    };
    const columns = (): number => Number(item().style.getPropertyValue(variables.menuColumns) || 1);
    // Untouched: the site's item has no attributes of its own
    const untouched = (): boolean => item().attributes.length === 0;

    beforeEach(() => {
      setHtml('@ta-x-test-views/home-page/header-signed-in-gaming-menu.html');
      setSettings({ 'allPages.stickyHeader.fitMenus': true });
      menuHeight = 1000;
      windowHeight = 600;
      windowWidth = 1280;
      vi.spyOn(window, 'innerHeight', 'get').mockImplementation(() => windowHeight);
      vi.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => windowWidth);
      // happy-dom has no layout: the menu's groups shared evenly between its columns
      vi.spyOn(find(':scope > div', item()), 'getBoundingClientRect').mockImplementation(
        () => ({ top: MENU_TOP, bottom: MENU_TOP + Math.ceil(menuHeight / columns()) }) as DOMRect
      );
    });

    test('should leave a menu that fits the window as the site has it', async () => {
      menuHeight = windowHeight - MENU_TOP;
      await run();

      openMenu();

      expect(untouched()).toBe(true);
    });

    test.each([
      [1000, 2],
      [1500, 3]
    ])('should give a menu %ipx tall in a short window just enough columns to fit, %i', async (height, expected) => {
      menuHeight = height;
      await run();

      openMenu();

      expect(item()).toHaveExactClasses([fitMenu]);
      expect(columns()).toBe(expected);
    });

    test('should give it three columns at most, then scroll inside', async () => {
      menuHeight = 1700;
      await run();

      openMenu();

      expect(columns()).toBe(3);
      expect(item()).toHaveExactClasses([fitMenu, fitMenuScrolls]);
    });

    test("should give the stylesheet the columns' width and gap with their count, and each group its longest link", async () => {
      linksMeasure(100);
      await run();

      openMenu();

      // Two links of 100px side by side, with the 8px gap
      expect(
        [variables.menuColumnWidth, variables.menuColumnGap].map((name) => item().style.getPropertyValue(name))
      ).toEqual(['208px', '0.5rem']);
      expect(
        [...item().querySelectorAll<HTMLElement>(`.${fitMenuGroup}`)].map((group) =>
          group.style.getPropertyValue(variables.groupLinkWidth)
        )
      ).toEqual(['100px', '100px', '100px']);
    });

    test('should leave the menu as the site has it below its desktop layout, where it has its own mobile menu', async () => {
      // happy-dom matches media queries against its own window, which a spec can't narrow: reported narrower than the
      // site's desktop breakpoint
      vi.spyOn(window, 'matchMedia').mockImplementation(
        (query) =>
          ({
            matches: query !== '(min-width: 768px)',
            media: query,
            addEventListener: () => undefined,
            removeEventListener: () => undefined
          }) as unknown as MediaQueryList
      );
      await run();

      openMenu();

      expect(untouched()).toBe(true);
    });

    // Each link's width on one line, as measured when the menu opens (happy-dom lays nothing out). Anything else
    // measures empty, as happy-dom has it (the menu's own spy, on the element, comes first)
    const linksMeasure = (width: number): void => {
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        return this.matches(`.${fitMenuGroup} > div > a`) ? ({ width } as DOMRect) : new DOMRect();
      });
    };

    // happy-dom's root font size is 16px, so the gap between columns is 8px; its menu has no padding
    const columnWidth = (): number => parseFloat(item().style.getPropertyValue(variables.menuColumnWidth));

    test('should make its columns only as wide as its longest links need, so more fit across the window', async () => {
      menuHeight = 1500;
      windowWidth = 900;
      linksMeasure(120);
      await run();

      openMenu();

      // Two are too tall; three fit across at two 120px links and the gap
      expect(columns()).toBe(3);
      expect(columnWidth()).toBe(2 * 120 + 8);
      expect(item()).toHaveExactClasses([fitMenu]);
    });

    test('should scroll a menu too tall even in three columns, as tall as the window leaves, and stop once it fits', async () => {
      menuHeight = 3000;
      windowWidth = 900;
      // Its scrollbar, once it scrolls: the menu 10px wider than its contents
      const menu = find(':scope > div', item());
      Object.defineProperty(menu, 'offsetWidth', { configurable: true, get: () => 310 });
      Object.defineProperty(menu, 'clientWidth', { configurable: true, get: () => 300 });
      await run();

      openMenu();
      expect(columns()).toBe(3);
      expect(item()).toHaveExactClasses([fitMenu, fitMenuScrolls]);
      expect(item().style.getPropertyValue(variables.menuMaxHeight)).toBe(`${windowHeight - MENU_TOP}px`);
      // Widened by it, so the columns keep their width
      expect(item().style.getPropertyValue(variables.menuScrollbar)).toBe('10px');

      // Tall enough for the site's own single column
      windowHeight = 4000;
      openMenu();
      expect(untouched()).toBe(true);
    });

    test('should narrow its columns no further than its longest links need, scrolling instead', async () => {
      menuHeight = 1500;
      windowWidth = 900;
      // Two of these links side by side need 298px: three columns across 900px would be 294px
      linksMeasure(145);
      await run();

      openMenu();

      expect(columns()).toBe(2);
      expect(item()).toHaveExactClasses([fitMenu, fitMenuScrolls]);
    });

    test("should leave the site's own menu when not even two columns fit across", async () => {
      windowWidth = 600;
      // Two of these links side by side need 298px: two columns across 600px would be 296px
      linksMeasure(145);
      await run();

      openMenu();

      expect(untouched()).toBe(true);
    });

    test('should put the menu back as the pointer leaves its item, so no box of ours is left in it', async () => {
      const menu = find(':scope > div', item());
      const nodes = [...menu.childNodes];
      await run();
      openMenu();
      expect(columns()).toBe(2);

      item().dispatchEvent(new PointerEvent('pointerleave'));

      expect(untouched()).toBe(true);
      expect([...menu.childNodes]).toEqual(nodes);
    });

    test('should leave a menu fitted as a finger lifts from a tap, which keeps the menu open', async () => {
      await run();
      openMenu();

      item().dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'touch' }));

      expect(columns()).toBe(2);
    });

    test("should put every menu back as the window drops below the site's desktop layout", async () => {
      // The desktop query's listener, to say the layout has changed (happy-dom's window can't be narrowed from a spec)
      let onLayoutChange: ((event: { matches: boolean }) => void) | undefined;
      const removeEventListener = vi.fn();
      vi.spyOn(window, 'matchMedia').mockImplementation(
        (query) =>
          ({
            matches: true,
            media: query,
            addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
              onLayoutChange = listener;
            },
            removeEventListener
          }) as unknown as MediaQueryList
      );
      const unmount = await run();
      openMenu();
      expect(columns()).toBe(2);

      required(onLayoutChange)({ matches: false });

      expect(untouched()).toBe(true);
      // Let go of once unmounted
      await act(unmount);
      expect(removeEventListener).toHaveBeenCalledWith('change', onLayoutChange);
    });

    test('should hold each heading with its links in a box of ours while fitted, and give them back in order after', async () => {
      const menu = find(':scope > div', item());
      const nodes = [...menu.childNodes];
      await run();

      openMenu();
      expect([...menu.children].map((child) => child.className)).toEqual([fitMenuColumns]);
      const groups = [...find(`.${fitMenuColumns}`, menu).children];
      // A box per heading, each starting with it
      expect(groups.map((group) => [group.className, group.firstElementChild?.matches('[data-tgl]')])).toEqual(
        [...menu.querySelectorAll('[data-tgl]')].map(() => [fitMenuGroup, true])
      );
      // Every node in them, in order, the space before the first heading left loose
      expect(
        [...find(`.${fitMenuColumns}`, menu).childNodes].flatMap((node) =>
          node instanceof Element && node.classList.contains(fitMenuGroup) ? [...node.childNodes] : [node]
        )
      ).toEqual(nodes);

      windowHeight = 1200;
      openMenu();
      expect([...menu.childNodes]).toEqual(nodes);
      expect(untouched()).toBe(true);
    });

    test('should keep the menu in the window, moved along from under the menu bar as far as it must', async () => {
      menuHeight = 1500;
      windowWidth = 900;
      // The menu bar's place: centring a nearly window-wide menu under it would run it off the right. Stubbed before the
      // links, as a spy on the element after the prototype's would take over the prototype's
      vi.spyOn(required(item().parentElement), 'getBoundingClientRect').mockReturnValue({
        left: 300,
        width: 400
      } as DOMRect);
      linksMeasure(140);
      await run();

      openMenu();

      // Three columns of two 140px links and the gap, flush with the window's right, given from the bar's left
      const menuWidth = 3 * (2 * 140 + 8) + 2 * 8;
      expect(item().style.getPropertyValue(variables.menuLeft)).toBe(`${900 - menuWidth - 300}px`);
    });

    // A scrolling menu: the menu bar's place, the links' width, and a 10px scrollbar once it scrolls
    const scrollingMenu = (linkWidth: number): void => {
      menuHeight = 3000;
      windowWidth = 900;
      // Stubbed before the links, as a spy on the element after the prototype's would take over the prototype's
      vi.spyOn(required(item().parentElement), 'getBoundingClientRect').mockReturnValue({
        left: 300,
        width: 400
      } as DOMRect);
      linksMeasure(linkWidth);
      const menu = find(':scope > div', item());
      Object.defineProperty(menu, 'offsetWidth', { configurable: true, get: () => 310 });
      Object.defineProperty(menu, 'clientWidth', { configurable: true, get: () => 300 });
    };

    test("should count a scrolling menu's scrollbar in keeping it in the window", async () => {
      scrollingMenu(140);
      await run();

      openMenu();

      // Three columns of two 140px links and the gap, and the scrollbar, flush with the window's right
      expect(columns()).toBe(3);
      const menuWidth = 3 * (2 * 140 + 8) + 2 * 8 + 10;
      expect(item().style.getPropertyValue(variables.menuLeft)).toBe(`${900 - menuWidth - 300}px`);
    });

    test('should give a scrolling menu a column fewer when its scrollbar would take it past the window', async () => {
      // Three columns of 292px fit across 900px only without the scrollbar
      scrollingMenu(142);
      await run();

      openMenu();

      expect(columns()).toBe(2);
      expect(item()).toHaveExactClasses([fitMenu, fitMenuScrolls]);
    });

    test('should leave a border out of the scrollbar it measures', async () => {
      scrollingMenu(140);
      // A 2px border either side: 4px of the 14px between its outer and inner widths
      const menu = find(':scope > div', item());
      menu.style.border = '2px solid';
      Object.defineProperty(menu, 'offsetWidth', { configurable: true, get: () => 314 });
      await run();

      openMenu();

      expect(item().style.getPropertyValue(variables.menuScrollbar)).toBe('10px');
    });

    test('should keep two columns at least, even when the scrollbar leaves them a little wide', async () => {
      // Two columns of 296px fill 600px exactly, before the scrollbar
      scrollingMenu(144);
      windowWidth = 600;
      await run();

      openMenu();

      expect(columns()).toBe(2);
    });

    test('should apply live, turned off putting every menu back as the site has it', async () => {
      setSettings({ 'allPages.stickyHeader.fitMenus': false });
      await run();
      openMenu();
      expect(untouched()).toBe(true);

      await changeSettingLive(fitMenus, true);
      openMenu();
      expect(columns()).toBe(2);

      await changeSettingLive(fitMenus, false);
      expect(untouched()).toBe(true);
      openMenu();
      expect(untouched()).toBe(true);
    });

    test('should need no reload while mounted (registered as applied live), and be let go of once unmounted', async () => {
      const unmount = await run();
      expect(isAppliedLive(fitMenus)).toBe(true);

      await act(unmount);

      expect(isAppliedLive(fitMenus)).toBe(false);
    });
  });

  describe("one of the site's menus in the header", () => {
    // The site's Gaming item, whose menu shows while it's hovered: happy-dom has no pointer, so :hover is reported
    let hovered: boolean;

    beforeEach(async () => {
      setHtml('@ta-x-test-views/home-page/header-signed-in-gaming-menu.html');
      const item = find<HTMLElement>('.nav-primary .items > li:not(.search)');
      const matches = item.matches.bind(item);
      hovered = false;
      vi.spyOn(item, 'matches').mockImplementation((selector) => (selector === ':hover' ? hovered : matches(selector)));
      await run();
    });

    test("should keep the header put while it shows, and move it again once it's gone", async () => {
      hovered = true;
      await scrollTo(300);
      await scrollTo(600);
      expect(animations()).toEqual([]);

      hovered = false;
      await scrollTo(900);
      expect(animations()).toEqual([yHide]);
    });
  });

  describe('scrolling', () => {
    beforeEach(async () => {
      await run();
    });

    test("should slide out on a first scroll that jumps past it from the top, before the spacer's watcher reports", async () => {
      Object.defineProperty(header(), 'offsetHeight', { get: () => 50, configurable: true });
      // At the top: the spacer on screen, as last reported
      const [[spacer, onIntersect]] = observeIntersection.mock.calls;
      onIntersect({ isIntersecting: true, target: spacer } as IntersectionObserverEntry);

      // Within its height it stays in its place
      await scrollTo(30);
      expect(animations()).toEqual([]);

      // One step to the end of a short page (a scrollbar drag, Page Down, a wheel without smooth scrolling)
      await scrollTo(677);
      expect(animations()).toEqual([yHide]);
    });

    test('should hide scrolling down and show again scrolling up', async () => {
      await scrollTo(300);
      await scrollTo(600);
      expect(animations()).toEqual([yHide]);

      await scrollTo(500);
      expect(animations()).toEqual([yShow]);
    });

    test('should move the header within the scroll event, before the sticky elements that follow it read it', async () => {
      // A scroll listener added after the header's, as the sticky page history's and editor toolbar's are
      const seen: string[][] = [];
      const listening = new AbortController();
      onTestFinished(() => listening.abort());
      window.addEventListener('scroll', () => seen.push(animations()), { signal: listening.signal });

      await act(() => {
        window.dispatchEvent(new Event('wheel'));
        scrollTop = 300;
        window.dispatchEvent(new Event('scroll'));
        scrollTop = 600;
        window.dispatchEvent(new Event('scroll'));
        scrollTop = 500;
        window.dispatchEvent(new Event('scroll'));
      });

      // The first scroll is down from the top, where the header was in its place
      expect(seen).toEqual([[yHide], [yHide], [yShow]]);
    });

    test('should stop being out of view back at the top, and stay in view if it slid into view', async () => {
      await scrollTo(300);
      await scrollTo(600);
      // The spacer comes back on screen
      const [[spacer, onIntersect]] = observeIntersection.mock.calls;
      onIntersect({ isIntersecting: true, target: spacer } as IntersectionObserverEntry);

      await scrollTo(0);
      expect(animations()).toEqual([]);

      onIntersect({ isIntersecting: false, target: spacer } as IntersectionObserverEntry);
      await scrollTo(300);
      await scrollTo(200);
      onIntersect({ isIntersecting: true, target: spacer } as IntersectionObserverEntry);
      await scrollTo(0);
      expect(animations()).toEqual([yShow]);
    });

    test("should not slide in when the browser scrolls up on its own (the page shifting above what's in view)", async () => {
      useFakeTimers({ toFake: ['performance'] });
      await scrollTo(300);
      await scrollTo(600);
      expect(animations()).toEqual([yHide]);

      // A page shrinking as it loads moves it up, once the user has stopped scrolling
      vi.advanceTimersByTime(USER_SCROLL_MS + 1);
      await browserScrollsTo(561);

      expect(animations()).toEqual([yHide]);
      // A later scroll by the user compares with where the page really is
      await scrollTo(520);
      expect(animations()).toEqual([yShow]);
    });

    test('should come back into its place, without sliding, when the page is scrolled to its very top on its own', async () => {
      useFakeTimers({ toFake: ['performance'] });
      await scrollTo(300);
      await scrollTo(600);
      expect(animations()).toEqual([yHide]);

      vi.advanceTimersByTime(USER_SCROLL_MS + 1);
      await browserScrollsTo(0);

      expect(animations()).toEqual([]);
    });

    test("should count scrolling while a pointer is held down (dragging the scrollbar) as the user's", async () => {
      useFakeTimers({ toFake: ['performance'] });
      await scrollTo(300);
      await scrollTo(600);
      await act(() => {
        window.dispatchEvent(new Event('pointerdown'));
      });
      vi.advanceTimersByTime(5000);

      await browserScrollsTo(400);

      expect(animations()).toEqual([yShow]);
    });

    test.each([
      {
        menu: 'our settings menu',
        open: async () => {
          settingsMenuOpen.value = true;
        }
      },
      {
        menu: "the site's gamer menu",
        open: async () => {
          siteMenu().classList.add('open');
          // Reported by the mutation observer
          await tick();
        }
      }
    ])('should stay put while $menu is open', async ({ open }) => {
      await scrollTo(300);
      expect(animations()).toEqual([yHide]);
      await open();

      // Up would slide it in
      await scrollTo(200);

      expect(animations()).toEqual([yHide]);
    });

    test('should move again once our menu closes, even if the site menu changed meanwhile', async () => {
      settingsMenuOpen.value = true;
      siteMenu().classList.add('open');
      await tick();
      siteMenu().classList.remove('open');
      await tick();

      // The site menu closing doesn't count as ours closing
      await scrollTo(300);
      await scrollTo(600);
      expect(animations()).toEqual([]);

      settingsMenuOpen.value = false;
      await scrollTo(900);
      expect(animations()).toEqual([yHide]);
    });
  });

  describe('narrowestColumn', () => {
    test.each([
      { name: 'two of the longest link side by side, with the gap', widths: [60.2, 133.4, 118], expected: 275 },
      {
        name: "two of the longest link, leaving out one too long for half the site's own menu, which wraps there anyway",
        widths: [133, 145, 147],
        expected: 298
      },
      { name: "the site's width when every link is that long", widths: [147, 160], expected: 300 }
    ])('should be $name', ({ widths, expected }) => {
      expect(narrowestColumn(widths, 8)).toBe(expected);
    });
  });
});

import {
  addClasses,
  slideClasses,
  stickyHeaderHeight,
  clearStickyAnimations,
  mutationObserver,
  resizeObserver
} from '@ta-x-page';
import { applyLive, settings } from '@ta-x-storage';
import { useCallback, useLayoutEffect, useRef, useState } from 'preact/hooks';

import { settingsMenuOpen, waitForSiteGamerPanel } from '../../settings-menu';
import { fitMenusToWindow, NAV_MENU_ITEMS } from '../fit-menus';
import { HeaderSpacer } from '../HeaderSpacer';
import styles from '../styles';

const { stickyHeader } = settings.allPages;
const { yHide, yHideNoTransition, yShow } = slideClasses;

// How long after a wheel, touch or key a scroll still counts as the user's (a wheel's smooth scroll runs on after it)
export const USER_SCROLL_MS = 1000;

// Where the header is: in its place at the top of the page, slid into view, slid out of view, or out of view without
// sliding (on a page loaded part way down)
type StickyHeaderVisibility = 'static' | 'shown' | 'hidden' | 'hidden-instantly';

const visibilityClass: Record<StickyHeaderVisibility, string | null> = {
  static: null,
  shown: yShow,
  hidden: yHide,
  'hidden-instantly': yHideNoTransition
};

interface StickyHeaderProps {
  // The site's <header>, made fixed
  header: HTMLElement;
}

// Watches the site's gamer menu, read from its class (its wait gives up if the site's request for it fails). The site
// adds the panel once and keeps it, toggling only its class. Returns a stop function
const watchSiteMenu = (onChange: (open: boolean) => void): (() => void) => {
  const stopped = new AbortController();
  let stopWatchingMenu: (() => void) | undefined;
  void waitForSiteGamerPanel(stopped.signal).then((navGamer) => {
    if (stopped.signal.aborted) {
      return;
    }

    onChange(Boolean(navGamer?.classList.contains('open')));
    if (navGamer) {
      stopWatchingMenu = mutationObserver.onAttributeChange(navGamer, ['class'], () =>
        onChange(navGamer.classList.contains('open'))
      );
    }
  });

  return () => {
    stopped.abort();
    stopWatchingMenu?.();
  };
};

// A controller for the site's header: it fixes it to the top of the window, slides it out of view scrolling down and
// back scrolling up (unless set to remain stuck), and keeps still while one of the site's menus or our settings menu is
// open. It renders the spacer that holds the header's place in the page, before the header. Its visibility is its
// useState (Preact DevTools switches it in a dev build), but a scroll applies it to the header at once as well: the
// sticky page history and editor toolbar read the header's classes in the same scroll event, so they mustn't wait for
// a re-render
export const StickyHeader = ({ header }: StickyHeaderProps) => {
  // Read with .value, so changing it in the menu re-renders the header and applies at once, either way
  const remainStuck = stickyHeader.remainStuck.value;
  const fitMenus = stickyHeader.fitMenus.value;
  // Whether the page is at its top: from the spacer once it's watched, worked out once the header is fixed until then
  const atTopRef = useRef(true);
  const previousScrollTopRef = useRef<number>(undefined);
  const siteMenuOpenRef = useRef(false);
  // How much the header last changed height by, until the next scroll: the browser scrolls the page by as much to keep
  // what's in view still, which isn't the user's scroll even within `USER_SCROLL_MS` of their wheel
  const heightChangeRef = useRef(0);
  const [visibility, setVisibility] = useState<StickyHeaderVisibility>('static');
  // Read once, as its first value is all useState keeps (offsetHeight lays the page out, on every render otherwise)
  const [height, setHeight] = useState(() => header.offsetHeight);
  const [background, setBackground] = useState(() => getComputedStyle(header).backgroundColor);
  const visibilityRef = useRef(visibility);

  const applyVisibility = useCallback(
    (next: StickyHeaderVisibility) => {
      const className = visibilityClass[next];

      visibilityRef.current = next;
      clearStickyAnimations(header);
      if (className) {
        header.classList.add(className);
      }
    },
    [header]
  );

  const show = useCallback(
    (next: StickyHeaderVisibility) => {
      applyVisibility(next);
      setVisibility(next);
    },
    [applyVisibility]
  );

  const onAtTopChange = useCallback((onScreen: boolean) => {
    atTopRef.current = onScreen;
  }, []);

  useLayoutEffect(() => {
    const giveClassesBack = addClasses(header, styles.stickyHeader);

    // A page loaded any way down starts with the header out of view, without sliding: it's been scrolled past
    // (intended, even less than the header's height down). As the page loads only: Remain Stuck turned off later
    // leaves the header in view until the next scroll down
    atTopRef.current = window.scrollY <= header.offsetTop;
    if (!stickyHeader.remainStuck.peek() && !atTopRef.current) {
      show('hidden-instantly');
    }
    // Where the page is as it starts, so the user's first scroll has something to compare with: up from a reloaded
    // page's place (the browser can put it back before this runs, with no scroll to say so) slides it in, and down from
    // the top slides it out. A place the browser puts it back to later is a scroll the user didn't make, which sets it
    previousScrollTopRef.current = window.scrollY;
    const stopApplyingLive = applyLive(stickyHeader.remainStuck, stickyHeader.fitMenus);

    return () => {
      stopApplyingLive();
      clearStickyAnimations(header);
      giveClassesBack();
    };
  }, [header, show]);

  // The header's height, which the spacer holds in the page and the elements stuck under it slide by (the
  // `slide-under-sticky-header` mixin). It follows the header's size: the site fills the header in after load, so it
  // can grow after it's first set. Read again as it starts watching, as the header can grow between the first
  // render and this effect, and the resize service doesn't tell a listener added later the size it already has
  useLayoutEffect(() => {
    let measured: number | undefined;
    const measure = (): void => {
      const next = header.offsetHeight;
      if (measured !== undefined && next !== measured) {
        heightChangeRef.current = next - measured;
      }
      measured = next;
      document.documentElement.style.setProperty(stickyHeaderHeight, `${next}px`);
      // A control the keyboard focuses, or an anchor jumped to, is scrolled to just below the fixed header, not under it.
      // Kept on while it's hidden too: the focus scroll comes first, and the header then slides in over the page
      document.documentElement.style.setProperty('scroll-padding-top', `${next}px`);
      setHeight(next);
      setBackground(getComputedStyle(header).backgroundColor);
    };

    measure();
    const stopObserving = resizeObserver.observe(header, measure);

    return () => {
      stopObserving();
      document.documentElement.style.removeProperty(stickyHeaderHeight);
      document.documentElement.style.removeProperty('scroll-padding-top');
    };
  }, [header]);

  // Fit Menus To Window: columns for a menu too tall for the window
  useLayoutEffect(() => (fitMenus ? fitMenusToWindow(header) : undefined), [header, fitMenus]);

  // Set from Preact DevTools
  useLayoutEffect(() => {
    if (visibility !== visibilityRef.current) {
      applyVisibility(visibility);
    }
  }, [visibility, applyVisibility]);

  // Listening from the first render, so the header moves before the sticky elements that follow it
  useLayoutEffect(() => {
    // Stuck, it stays in view: one slid away (or out of view since the page loaded) comes back
    if (remainStuck) {
      if (visibilityRef.current === 'hidden' || visibilityRef.current === 'hidden-instantly') {
        show(atTopRef.current ? 'static' : 'shown');
      }

      // Remain Stuck turned off: where the page is now, so the first scroll has something to compare with (nothing kept
      // track while stuck, and the first scroll down would leave the header in view)
      return () => {
        previousScrollTopRef.current = window.scrollY;
      };
    }

    // Whether the user is scrolling: a wheel, touch or key within `USER_SCROLL_MS`, or a pointer held down (dragging
    // the scrollbar). The browser also scrolls on its own: putting a reloaded page back where it was, and keeping what's
    // in view in place as the page above it changes size. Those mustn't slide the header in (reloading part way down,
    // or nearing the bottom of a short page)
    let lastInput = -Infinity;
    let pointerDown = false;
    const onInput = (): void => {
      lastInput = performance.now();
    };
    const onPointerDown = (): void => {
      pointerDown = true;
      onInput();
    };
    const onPointerUp = (): void => {
      pointerDown = false;
      onInput();
    };
    const byUser = (): boolean => pointerDown || performance.now() - lastInput < USER_SCROLL_MS;
    // One of the site's menus in the header showing: the header stays put, as it does for the gamer menu, or the menu
    // would slide away from under the pointer
    const navMenuShown = (): boolean =>
      [...header.querySelectorAll(NAV_MENU_ITEMS)].some((item) => item.matches(':hover'));

    const onScroll = () => {
      const currentScrollTop = window.scrollY;
      const current = visibilityRef.current;
      let next = current;

      // The browser keeping what's in view still as the header (and its spacer) changed height: the page is where it
      // was to the user, so it's placed as for any scroll the user didn't make, even within `USER_SCROLL_MS` of theirs
      const heightChange = heightChangeRef.current;
      heightChangeRef.current = 0;
      const previous = previousScrollTopRef.current;
      const keptStill =
        heightChange !== 0 && previous !== undefined && Math.abs(currentScrollTop - previous - heightChange) < 1;

      if (keptStill || !byUser()) {
        // Placed where the page now is, without sliding: out of view past the top, and back in its place at the very top
        // (the page or the editor can scroll it there, which would otherwise leave its space empty)
        if (current === 'static' && currentScrollTop > header.offsetHeight) {
          show('hidden-instantly');
        } else if (currentScrollTop === 0 && (current === 'hidden' || current === 'hidden-instantly')) {
          show('static');
        }
        previousScrollTopRef.current = currentScrollTop;
        return;
      }

      // At the top, read from where the page is too: the spacer's watcher reports a moment after the scroll, so one
      // that jumps past the header in a single step would still find the page at its top
      if (atTopRef.current && currentScrollTop <= header.offsetHeight) {
        // Back in its place: it stops being out of view (one that slid into view stays so)
        next = current === 'shown' ? 'shown' : 'static';
        // While a menu is open the header stays where it is
      } else if (!siteMenuOpenRef.current && !settingsMenuOpen.peek() && !navMenuShown()) {
        const previousScrollTop = previousScrollTopRef.current ?? currentScrollTop;
        if (previousScrollTop > currentScrollTop) {
          next = 'shown';
        } else if (previousScrollTop < currentScrollTop) {
          next = 'hidden';
        }
      }

      if (next !== current) {
        show(next);
      }
      previousScrollTopRef.current = currentScrollTop;
    };

    const inputs = ['wheel', 'touchmove', 'keydown'] as const;
    inputs.forEach((type) => window.addEventListener(type, onInput, { capture: true, passive: true }));
    window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    window.addEventListener('pointerup', onPointerUp, { capture: true, passive: true });
    window.addEventListener('scroll', onScroll);
    // Focus going into the header (Shift+Tab up from the page) while it's slid away: it comes into view, as it would on
    // a scroll up, so the focused link can be seen. The browser doesn't scroll for it, as the header is fixed
    const onFocusIn = (): void => {
      const current = visibilityRef.current;
      if (current === 'hidden' || current === 'hidden-instantly') {
        show('shown');
      }
    };
    header.addEventListener('focusin', onFocusIn);
    const stopWatchingSiteMenu = watchSiteMenu((open) => {
      siteMenuOpenRef.current = open;
    });

    return () => {
      inputs.forEach((type) => window.removeEventListener(type, onInput, { capture: true }));
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
      window.removeEventListener('pointerup', onPointerUp, { capture: true });
      window.removeEventListener('scroll', onScroll);
      header.removeEventListener('focusin', onFocusIn);
      stopWatchingSiteMenu();
    };
  }, [header, remainStuck, show]);

  return <HeaderSpacer height={height} background={background} onAtTopChange={onAtTopChange} />;
};

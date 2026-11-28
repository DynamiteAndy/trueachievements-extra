import { settings } from '@ta-x-storage';

import { slideClasses, stickyAnimations } from './slide-classes';

// For stickUnderHeader: the element is fixed by its owner, so its top is the header's height (plus the gap) once
// stuck, and set on the element itself
export type StickyElementOptions = {
  // How far under the header it sits
  paddingFromTop?: number;
  // Whether the caller has stuck the element itself: placed under the header, as stuck, though its container's top is
  // still in view (TinyMCE's toolbar sticks once the editor's top goes under the header's bottom, where the header is
  // mid-slide too). Without it the element would be taken for in place while the header slid away, its top 0 and its
  // slide gone
  stuck?: boolean;
};

const { stickyHeader } = settings.allPages;
const { yShow, yHide, yHideNoTransition } = slideClasses;

// Takes the slide classes off an element (a sticky element giving it back)
export const clearStickyAnimations = (element: Element): void => element.classList.remove(...stickyAnimations);

// Places an element under `headerElement`, the site's <header> (null when the page has none), which the sticky header
// makes fixed: it's read by the caller, not by its class, as the sticky header may not have marked it yet. Whether the
// sticky header is on is read each time, not once at import, as it applies live
export const applyStickyElementStyle = (
  variableProperty: string,
  stickyElement: HTMLElement,
  containerElement: HTMLElement,
  headerElement: HTMLElement | null,
  opts: StickyElementOptions = {}
): void => {
  const stickyHeaderOn = stickyHeader.enabled.peek();

  let addAnimation: string | undefined;
  let topStylePx = opts.paddingFromTop || 0;
  // An element that hasn't slid yet (the first time it's placed) goes without its transition
  const noTransitionStyle = !stickyAnimations.some((animation) => stickyElement.classList.contains(animation));

  const containerTop = containerElement.getBoundingClientRect().top;
  const headerHeight = stickyHeaderOn ? (headerElement?.offsetHeight ?? 0) : 0;
  // Hidden only once it has slid away: before the user's first scroll it has neither class and is in view (with the
  // page already scrolled too, e.g. a reload keeping its place)
  const headerHidden =
    stickyHeaderOn &&
    // Read as it's placed: Remain Stuck applies live
    !stickyHeader.remainStuck.peek() &&
    !!(headerElement?.classList.contains(yHide) || headerElement?.classList.contains(yHideNoTransition));
  const headerShowing = stickyHeaderOn && !headerHidden;
  // While the header shows, the container counts as scrolled past once its top goes under the header, not only once it
  // leaves the window: otherwise anything stuck to it slides under the header in between (scrolling back up)
  const headerCoversContainer = headerShowing && containerTop > 0 && containerTop < headerHeight;

  if (!opts.stuck && containerTop > 0 && !headerCoversContainer) {
    topStylePx = 0;
  } else if (stickyHeaderOn) {
    topStylePx += headerHeight;

    if (headerHidden) {
      addAnimation = noTransitionStyle ? yHideNoTransition : yHide;
    } else {
      addAnimation = yShow;
    }
  }

  stickyElement.style.setProperty(variableProperty, `${topStylePx}px`);

  // Every other slide class goes, so the element carries only the one it slides with (or none, left in place)
  stickyElement.classList.remove(...stickyAnimations.filter((animation) => animation !== addAnimation));
  if (addAnimation) {
    stickyElement.classList.add(addAnimation);
  }
};

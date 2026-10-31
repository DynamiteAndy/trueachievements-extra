import { addClasses } from '../add-classes';
import { mutationObserver } from '../mutation-observer';
import { resizeObserver } from '../resize-observer';

import { atOnce, copyHeaderSlide, headerSlide, slid } from './slide';
import { applyStickyElementStyle, clearStickyAnimations } from './sticky';
import styles from './styles';

const { variables } = styles;

export interface StickUnderHeaderOptions {
  // What sticks
  element: HTMLElement;
  // It sticks once this one's top goes under the header's bottom, until this one has left the window
  container: HTMLElement;
  // It stays above this one's bottom, pinned there (by default, the container's)
  end?: HTMLElement | null;
  // How far under the header it sticks, in px
  gap?: number;
  // Whether it keeps the height it has in place while stuck: for one whose height is a share of its container's, which
  // fixed would be the window's (the page history's `height: 100%`). Not for one whose height follows its width (the
  // toolbar wraps onto more rows when narrower)
  keepHeight?: boolean;
  // After it has been placed on a scroll, each frame of the header's slide, and once a slide of its has ended (e.g. to
  // move what follows it)
  onMoved?: (reason: 'scroll' | 'slide' | 'slide-end') => void;
}

// Stuck (fixed under the header) or in place, decided from where the container is now: stuck from its top going under
// the header (where the header is now, mid-slide too, and `gap` below it) until all of it has left the window. Stuck
// from under the header, not from the window's top, so both switches are where the stuck and the in-place element
// meet; stuck, it slides with the header (copyHeaderSlide). Read afresh each time, as a narrower window or the header
// changing height moves where it should switch
const shouldStick = (container: HTMLElement, header: HTMLElement | null, gap: number): boolean => {
  const { top, bottom } = container.getBoundingClientRect();
  const headerBottom = Math.max(header?.getBoundingClientRect().bottom ?? 0, 0);

  return top <= headerBottom + gap && bottom > 0;
};

// Keeps an element stuck under the site's header while the page scrolls, as the editor's toolbar and the walkthrough
// page's page history are. Returns a function that gives the element back as it was
export const stickUnderHeader = ({
  element,
  container,
  end = container,
  gap = 0,
  keepHeight = false,
  onMoved
}: StickUnderHeaderOptions): (() => void) => {
  const header = document.querySelector('header');
  // Set by the stop: a slide still followed would stick it again
  let stopped = false;
  const parent = element.parentElement;
  // Stuck under the header now, and pinned at its end
  const stuck = (): boolean => element.classList.contains(styles.stuck);
  const pinned = (): boolean => element.classList.contains(styles.atEnd);

  // Its place in the page while stuck: fixed, it leaves the page's flow, and the container, shorter by its height,
  // would fail the rule it was stuck by, flipping between stuck and in place every frame. A spacer as tall as it, and
  // in a row (the page history's column, beside the walkthrough) as wide. Its size is read before the class changes:
  // read after, the page is laid out with the element fixed and its place not yet held, which Chrome's scroll anchoring
  // makes up for. Its parent is positioned too, for the element pinned at its end (fitToEnd)
  let spacer: HTMLElement | null = null;
  let parentPosition: { value: string; priority: string } | null = null;
  let stopFollowingSize = (): void => undefined;
  const inRow = (): boolean => {
    const style = parent ? getComputedStyle(parent) : null;
    return !!style && style.display.includes('flex') && !style.flexDirection.startsWith('column');
  };
  const fitWidth = (): void => {
    if (spacer) {
      element.style.setProperty(variables.width, `${spacer.getBoundingClientRect().width}px`);
    }
  };
  const holdPlace = (height: number, width: number): void => {
    if (spacer || !parent) {
      return;
    }

    spacer = document.createElement('div');
    spacer.className = styles.spacer;
    spacer.style.height = `${height}px`;
    // Its margins too: the page history's on its right is the gap to the walkthrough beside it
    spacer.style.margin = getComputedStyle(element).margin;
    if (inRow()) {
      spacer.style.width = `${width}px`;
      spacer.style.flex = getComputedStyle(element).flex;
    }
    parent.insertBefore(spacer, element);
    parentPosition = {
      value: parent.style.getPropertyValue('position'),
      priority: parent.style.getPropertyPriority('position')
    };
    parent.style.setProperty('position', 'relative');
    if (keepHeight) {
      element.style.setProperty(variables.height, `${height}px`);
    }

    // As wide as its place, and its place as tall as it, as either resizes (a narrower window wraps the toolbar onto
    // more rows)
    const stopSpacer = resizeObserver.observe(spacer, fitWidth);
    const stopElement = resizeObserver.observe(element, () => {
      if (spacer) {
        spacer.style.height = `${element.offsetHeight}px`;
      }
    });
    stopFollowingSize = () => {
      stopSpacer();
      stopElement();
    };
  };
  const givePlaceBack = (): void => {
    stopFollowingSize();
    spacer?.remove();
    spacer = null;
    // The parent can be the site's (the toolbar's), so its own inline position comes back
    if (parent && parentPosition) {
      if (parentPosition.value) {
        parent.style.setProperty('position', parentPosition.value, parentPosition.priority);
      } else {
        parent.style.removeProperty('position');
      }
      parentPosition = null;
    }
    element.style.removeProperty(variables.width);
    element.style.removeProperty(variables.height);
  };

  const fixInPlace = (): void => {
    const stick = shouldStick(container, header, gap);
    const { height, width } = element.getBoundingClientRect();

    const newlyHeld = stick && !spacer;
    if (stick) {
      holdPlace(height, width);
    }
    element.classList.toggle(styles.stuck, stick);
    // Its place measured only once it's stuck: laid out with its place held and it still in place, the page can be
    // shorter than either way (the page history's walkthrough page), and a page scrolled to its end is pulled up by it,
    // which the sticky header takes for the user scrolling up
    if (newlyHeld) {
      fitWidth();
    } else if (!stick) {
      givePlaceBack();
    }
  };

  // The stuck element stays above its end: once that's bottom reaches the element's, it goes up with it rather than
  // covering what follows. It's pinned inside its parent there (absolute, without its slide: sticky-under-header.scss),
  // so it scrolls with the page itself: kept fixed and moved there on each scroll, it would trail the page by a frame,
  // as Chrome scrolls, and runs the slide's transform, ahead of the page's scripts. It goes back to fixed once the
  // end's bottom is below where the fixed element would be, both switches where the two coincide: its top moved by the
  // header's slide, as far as that has got (the stuck element's slide is a copy of it; worked out again each frame of a
  // slide), read from the header, not from where the slide would end. Going back, it's moved there at once: its slide
  // would otherwise run from none
  const fitToEnd = (): void => {
    const wasPinned = pinned();

    if (!end || !parent || !stuck()) {
      element.classList.remove(styles.atEnd);
      return;
    }

    const top = parseFloat(element.style.getPropertyValue(variables.top)) || 0;
    const height = element.offsetHeight;
    // Short of it by its bottom margin, as in place
    const endBottom = end.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(element).marginBottom) || 0);
    const atEnd = top + slid(header) + height >= endBottom;

    if (atEnd) {
      element.style.setProperty(variables.atEndTop, `${endBottom - parent.getBoundingClientRect().top - height}px`);
    } else if (wasPinned) {
      atOnce(element);
    }
    element.classList.toggle(styles.atEnd, atEnd);
  };

  // Under the header (the sticky helper's top and slide classes). The first time it's placed it goes without its
  // transition (the helper's default until it has slid). Stuck by us, under the header's bottom, the container's top
  // can still be in view, which the helper would otherwise take for in place
  const stickUnder = (): void =>
    applyStickyElementStyle(variables.top, element, container, header, { paddingFromTop: gap, stuck: stuck() });

  // While the header slides, it's stuck or let go, and kept above its end, each frame, from where the slide has got
  // (shouldStick, fitToEnd), and, stuck and not pinned at its end, it slides by a copy of the header's slide
  // (copyHeaderSlide). Followed afresh each time the header starts another slide (turning round mid-way starts another)
  // or it sticks, lets go, is pinned or let go from there mid-slide (copied then part-way, as it starts with the
  // header's)
  let sliding = 0;
  let copy: Animation | undefined;
  let followed: { slide: Animation; stuck: boolean; pinned: boolean } | undefined;
  const stopFollowingSlide = (): void => {
    cancelAnimationFrame(sliding);
    sliding = 0;
  };
  const stopSliding = (): void => {
    copy?.cancel();
    copy = undefined;
    followed = undefined;
    stopFollowingSlide();
  };
  // Slides followed to their end, not followed again (one ended is still listed until the browser drops it)
  const ended = new WeakSet<Animation>();

  const followHeaderSlide = (): void => {
    if (stopped) {
      return;
    }

    const found = header ? headerSlide(header) : undefined;
    const slide = found && !ended.has(found) ? found : undefined;

    if (!header || !slide) {
      stopSliding();
      return;
    }
    // Already followed, each frame (a follow stopped for any reason, such as its own slide ending, is started again)
    if (followed?.slide === slide && followed.stuck === stuck() && followed.pinned === pinned() && sliding) {
      return;
    }

    stopSliding();
    followed = { slide, stuck: stuck(), pinned: pinned() };
    copy = stuck() && !pinned() ? copyHeaderSlide(element, header, slide) : undefined;
    sliding = requestAnimationFrame(followSlide);
    // Ended: stuck or in place decided again where the header has come to rest, not only kept above its end
    slide.finished.then(
      () => {
        ended.add(slide);
        if (!stopped && followed?.slide === slide) {
          stopSliding();
          place();
          onMoved?.('slide-end');
        }
      },
      () => undefined
    );
  };
  const followSlide = (): void => {
    if (stopped) {
      return;
    }

    // Stuck or let go as the header slides past the container's top: placed afresh, which follows the slide again
    if (shouldStick(container, header, gap) !== stuck()) {
      stopFollowingSlide();
      place();
      return;
    }

    const wasPinned = pinned();
    fitToEnd();

    if (pinned() !== wasPinned) {
      followHeaderSlide();
      return;
    }

    onMoved?.('slide');
    sliding = requestAnimationFrame(followSlide);
  };

  // Stuck or in place, then where under the header, then kept above its end, then sliding as the header is. Let go,
  // it's in place at once rather than sliding there from its stuck slide
  const place = (): void => {
    const wasStuck = stuck();
    fixInPlace();

    if (wasStuck && !stuck()) {
      atOnce(element);
    }

    stickUnder();
    fitToEnd();
    followHeaderSlide();
  };

  const onScroll = (): void => {
    place();
    onMoved?.('scroll');
  };
  // Its own slide ending (in place, the slide classes it's given back) leaves the header's alone, as above
  const onTransitionEnd = (event: TransitionEvent): void => {
    // A transition inside it bubbles up too
    if (event.target === element && event.propertyName === 'transform') {
      fitToEnd();
      onMoved?.('slide-end');
    }
  };

  const giveClassesBack = addClasses(element, styles.stickyUnderHeader, ...(keepHeight ? [styles.keepHeight] : []));
  // Placed again as the container resizes, which moves it and can change the element's height (a narrower window)
  const stopFollowingContainer = resizeObserver.observe(container, () => {
    place();
  });
  // Placed again when the header changes height, which no scroll reports: it's shorter in a narrow window and loses its
  // promo bar when that's closed. A frame later, once the sticky header's spacer has moved the page by the same amount
  let frame = 0;
  const stopFollowingHeaderSize = header
    ? resizeObserver.observe(header, () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          place();
        });
      })
    : () => undefined;
  // Placed again when the header shows or hides (its class): the sticky header decides on a scroll, and its class
  // follows a render later, after this scroll listener has run. Scrolling on, the next scroll catches up; on the last,
  // nothing would
  const stopFollowingHeaderClass = header
    ? mutationObserver.onAttributeChange(header, ['class'], () => {
        place();
      })
    : () => undefined;
  place();

  element.addEventListener('transitionend', onTransitionEnd);
  window.addEventListener('scroll', onScroll);

  return () => {
    stopped = true;
    element.removeEventListener('transitionend', onTransitionEnd);
    window.removeEventListener('scroll', onScroll);
    stopFollowingContainer();
    stopFollowingHeaderSize();
    stopFollowingHeaderClass();
    cancelAnimationFrame(frame);
    stopSliding();
    // The state classes it toggled, then the ones it added (addClasses: no empty class attribute left)
    element.classList.remove(styles.stuck, styles.atEnd);
    givePlaceBack();
    element.style.removeProperty(variables.top);
    element.style.removeProperty(variables.atEndTop);
    clearStickyAnimations(element);
    giveClassesBack();
  };
};

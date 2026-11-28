import { addClasses, resizeObserver } from '@ta-x-page';
import { useEffect } from 'preact/hooks';

import type { RefObject } from 'preact';

import styles from '../styles';

// Lets a tab bar wider than its container be dragged sideways with the mouse, carrying on with a little momentum when
// let go (the tabs CSS hides the bar's scrollbar)
export const useDragScroll = (ref: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const container = ref.current;

    if (!container) {
      return;
    }

    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let momentum = 0;

    const stopMomentum = () => cancelAnimationFrame(momentum);

    const glide = () => {
      container.scrollLeft += velocity;
      velocity *= 0.95;

      if (Math.abs(velocity) > 0.5) {
        momentum = requestAnimationFrame(glide);
      }
    };

    const move = (event: MouseEvent) => {
      event.preventDefault();

      const previous = container.scrollLeft;
      container.scrollLeft = scrollLeft - (event.pageX - startX) * 3;
      velocity = container.scrollLeft - previous;
    };

    let giveScrollClassBack = (): void => undefined;

    const release = (withMomentum: boolean) => () => {
      giveScrollClassBack();
      container.removeEventListener('mousemove', move);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('wheel', stopMomentum);

      if (withMomentum) {
        stopMomentum();
        momentum = requestAnimationFrame(glide);
      }
    };
    const onMouseUp = release(true);
    const onMouseLeave = release(false);

    const press = (event: MouseEvent) => {
      // The left button only: where a right press opens the context menu, the menu takes its release, which would
      // leave the bar scrolling as the pointer moves
      if (event.button !== 0) {
        return;
      }

      giveScrollClassBack();
      giveScrollClassBack = addClasses(container, styles.tabScroll);
      startX = event.pageX;
      scrollLeft = container.scrollLeft;
      stopMomentum();

      container.addEventListener('mousemove', move);
      container.addEventListener('mouseup', onMouseUp);
      container.addEventListener('mouseleave', onMouseLeave);
      container.addEventListener('wheel', stopMomentum);
    };

    container.addEventListener('mousedown', press);

    return () => {
      container.removeEventListener('mousedown', press);
      onMouseLeave();
      stopMomentum();
    };
  }, [ref]);
};

// Where the bar should scroll to so the link is fully in view, by the least distance: null if it already is, or if the
// bar has no width (hidden, e.g. inside the closed settings menu)
export const scrollTargetFor = (bar: HTMLElement, link: HTMLElement): number | null => {
  if (bar.clientWidth === 0) {
    return null;
  }

  const barBox = bar.getBoundingClientRect();
  const linkBox = link.getBoundingClientRect();
  const start = linkBox.left - barBox.left + bar.scrollLeft;
  const end = start + linkBox.width;

  if (start < bar.scrollLeft) {
    return start;
  }

  if (end > bar.scrollLeft + bar.clientWidth) {
    return end - bar.clientWidth;
  }

  return null;
};

const scrollToSelected = (bar: HTMLElement, behavior: ScrollBehavior): void => {
  const link = bar.querySelector<HTMLElement>('[aria-selected="true"]');
  const left = link && scrollTargetFor(bar, link);

  if (left !== null) {
    bar.scrollTo({ left, behavior });
  }
};

// Keeps a tab bar's selected tab in view: when the selection changes (smoothly), and when the bar gets a size or
// changes it (at once: e.g. the settings menu opening on a tab past the bar's edge, or the window resizing). Only the
// bar scrolls, never the page, and never while the user drags it (neither the selection nor its size changes then).
export const useScrollToSelected = (ref: RefObject<HTMLElement | null>, selected: string): void => {
  useEffect(() => {
    if (ref.current) {
      // At once rather than smoothly for someone who has asked their system for less motion
      scrollToSelected(ref.current, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
    }
  }, [ref, selected]);

  useEffect(() => {
    const bar = ref.current;

    if (!bar) {
      return;
    }

    // The shared observer; its stop function is the effect's cleanup
    return resizeObserver.observe(bar, () => scrollToSelected(bar, 'auto'));
  }, [ref]);
};

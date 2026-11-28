import { useLayoutEffect } from 'preact/hooks';

import type { RefObject } from 'preact';

// How long the max-height transition takes (accordion.scss), with a little slack for when transitionend doesn't come
const TRANSITION_MS = 600;

// The state last applied to each content, so only changes animate (its first state comes from its markup)
const appliedStates = new WeakMap<HTMLElement, boolean>();

// Animates the content closed: from no cap (or mid-opening) to a fixed height first, so there's something to animate
// down from
const collapse = (content: HTMLElement): void => {
  content.style.maxHeight = `${content.scrollHeight}px`;
  content.getBoundingClientRect();
  content.style.maxHeight = '0px';
};

// Animates the content open to its height, then removes the cap. Returns a cancel for when it closes again first
const expand = (content: HTMLElement): (() => void) => {
  content.style.maxHeight = `${content.scrollHeight}px`;

  const removeCap = () => {
    content.style.maxHeight = '';
  };
  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target === content && event.propertyName === 'max-height') {
      removeCap();
    }
  };
  const timer = setTimeout(removeCap, TRANSITION_MS);
  content.addEventListener('transitionend', onTransitionEnd);

  return () => {
    clearTimeout(timer);
    content.removeEventListener('transitionend', onTransitionEnd);
  };
};

const contentOf = (contentOrRef: HTMLElement | RefObject<HTMLElement | null>): HTMLElement | null =>
  contentOrRef instanceof HTMLElement ? contentOrRef : contentOrRef.current;

// Opens and closes the content by animating its max-height between 0 and its height. Once open, the cap is removed, so
// content that grows afterwards (a setting shown by a render condition, a label wrapping when the settings tab gains
// its scrollbar) is never cut off and nothing has to follow its height. Takes a ref (content it renders) or an element
// (content it doesn't), both stable between renders. Closed content is inert, so Tab and screen readers skip what can't
// be seen
export const useCollapse = (contentOrRef: HTMLElement | RefObject<HTMLElement | null>, expanded: boolean): void => {
  useLayoutEffect(() => {
    const content = contentOf(contentOrRef);

    // Given back on unmount: content we don't render is the site's
    return () => content?.removeAttribute('inert');
  }, [contentOrRef]);

  useLayoutEffect(() => {
    const content = contentOf(contentOrRef);

    if (!content) {
      return;
    }

    content.toggleAttribute('inert', !expanded);

    const previous = appliedStates.get(content);
    appliedStates.set(content, expanded);

    if (previous === undefined || previous === expanded) {
      return;
    }

    if (expanded) {
      return expand(content);
    }

    collapse(content);
  }, [contentOrRef, expanded]);
};

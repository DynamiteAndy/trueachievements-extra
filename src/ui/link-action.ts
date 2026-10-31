import type { MouseEventHandler } from 'preact';

// The click of an href="#" link that acts on the page: it doesn't jump to the top, nor reach the handlers around it
export const linkAction =
  (action: () => void): MouseEventHandler<HTMLElement> =>
  (event) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

// The click of an href="#" link that acts on the page but leaves the click to the handlers around it (the site's own,
// in its markup): it only doesn't jump to the top
export const noJump =
  (action: () => void): MouseEventHandler<HTMLElement> =>
  (event) => {
    event.preventDefault();
    action();
  };

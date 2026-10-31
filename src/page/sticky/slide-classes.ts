// The classes the sticky header, and the elements stuck under it, slide in and out of view with
export const slideClasses = {
  yShow: 'ta-x-y-show',
  yHide: 'ta-x-y-hide',
  yHideNoTransition: 'ta-x-y-hide-no-transition'
} as const;

export const stickyAnimations = Object.values(slideClasses);

// Set by the sticky header; read by the slide-out transform of the elements stuck under it (_sticky-under-header.scss)
export const stickyHeaderHeight = '--ta-x-sticky-header-height';

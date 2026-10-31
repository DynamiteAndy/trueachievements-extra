const styles = {
  // On an element stickUnderHeader looks after; stuck: fixed under the header; at its end: pinned in its parent
  stickyUnderHeader: 'ta-x-sticky-under-header',
  stuck: 'ta-x-sticky-under-header-stuck',
  atEnd: 'ta-x-sticky-under-header-at-end',
  // Keeps the height it has in place while stuck (keepHeight)
  keepHeight: 'ta-x-sticky-under-header-keep-height',
  // Holds a stuck element's place in the page
  spacer: 'ta-x-sticky-under-header-spacer',
  // Its CSS custom properties, set on the element itself
  variables: {
    top: '--ta-x-sticky-under-header-top',
    width: '--ta-x-sticky-under-header-width',
    height: '--ta-x-sticky-under-header-height',
    atEndTop: '--ta-x-sticky-under-header-at-end-top'
  }
} as const;

export default styles;

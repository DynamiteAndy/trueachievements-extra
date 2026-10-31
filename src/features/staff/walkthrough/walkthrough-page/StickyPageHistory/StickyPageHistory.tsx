import { addClasses, stickUnderHeader } from '@ta-x-page';
import { useLayoutEffect } from 'preact/hooks';

import styles from '../styles';

interface StickyPageHistoryProps {
  // The feature's container, which the page history sticks within
  container: HTMLElement;
  // The site's page history (#chWalkthroughPageVersions)
  pageVersions: HTMLElement;
}

// A controller for the site's page history: stuck just under the site's header while the page scrolls, and kept within
// its column (stickUnderHeader). It renders nothing of its own, and gives the page history back as it was on unmount
export const StickyPageHistory = ({ container, pageVersions }: StickyPageHistoryProps) => {
  useLayoutEffect(() => {
    const giveClassesBack = addClasses(pageVersions, styles.walkthroughPageStickyPageHistory);
    const stopSticking = stickUnderHeader({
      element: pageVersions,
      container,
      gap: 5,
      // Its height is its column's (`height: 100%`), which fixed would be the window's
      keepHeight: true
    });

    return () => {
      stopSticking();
      giveClassesBack();
    };
  }, [container, pageVersions]);

  return null;
};

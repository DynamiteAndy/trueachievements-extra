import { Cache } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import styles from './styles/index';
import settingsMenu from './scripts/settings-menu';
import stickyHeader from './scripts/sticky-header';
import staffWalkthroughImprovements from './scripts/staff-walkthrough-improvements/index';

(async () => {
  await allConcurrently(4, [
    styles,
    settingsMenu,
    stickyHeader,
    staffWalkthroughImprovements
  ]);

  Cache.clearExpired();
})();
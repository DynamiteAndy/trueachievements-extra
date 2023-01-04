import { Cache } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { accordion } from '@ta-x-components';
import { SettingsMenu, StickyHeader, StaffWalkthroughImprovements } from '@ta-x-features';
import styles from './features/staff-walkthrough-improvements/styles';

(async () => {
  accordion();
  
  await allConcurrently(4, [
    styles,
    SettingsMenu,
    StickyHeader,
    StaffWalkthroughImprovements
  ]);

  Cache.clearExpired();
})();
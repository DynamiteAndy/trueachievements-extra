import { click } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { settingsMenuOpen } from './settings-menu-open';

// The menu builds each tab, and the changelog and documentation views, the first time it shows them open. For the
// specs that read every panel: opens the menu, shows each tab and both views (the footer's version and documentation
// links) in turn, then goes back to the first tab
export const showEveryTab = (menu: Element): void => {
  void act(() => {
    settingsMenuOpen.value = true;
  });
  const tabs = [...menu.querySelectorAll('.ta-x-tabs-link-container .ta-x-tabs-link')];
  const views = [...menu.querySelectorAll('.ta-x-settings-menu-bottom a[href="#"]')];
  [...tabs, ...views, tabs[0]].forEach((link) => link && click(link));
};

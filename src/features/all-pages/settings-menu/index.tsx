import { mount, waitForElement } from '@ta-x-page';
import { signedInGamerId } from '@ta-x-site';

import type { Setting } from '@ta-x-storage';

import { watchForChanges } from './reload-notice';
import { SettingsMenu, type SettingsTab } from './SettingsMenu';
import { SettingsMenuButton } from './SettingsMenuButton';
import { waitForSiteGamerPanel } from './site-gamer-panel';

// Whether the menu is open, for features that keep still while it is (the sticky header)
export { settingsMenuOpen } from './settings-menu-open';
// The wait for the site's gamer panel, leaving our menu out, for features that watch it (the sticky header)
export { waitForSiteGamerPanel } from './site-gamer-panel';

// The type of a tab it's given (features/settings-tabs.tsx)
export type { SettingsTab } from './SettingsMenu';

// The wrench goes in the site's header, the menu after its gamer panel. They share whether the menu is open through a
// signal (settings-menu-open.ts); the menu keeps its own tabs. Closing it after a change shows a "reload to apply"
// toast (reload-notice.ts)
export default async (settingsTabs: SettingsTab[], settingsAppliedOnArrival: readonly Setting[]): Promise<void> => {
  watchForChanges(settingsAppliedOnArrival);

  const navigationBar = await waitForElement('header nav');
  if (!navigationBar) {
    return;
  }

  // Signed in, the gamer's toggle; signed out, the login box in its place. The server sends every page with the
  // login box and the site's script swaps the toggle in for a signed-in gamer later, so which one to wait for comes
  // from the signed-in gamer's cookie (waiting for either finds the login box, which puts the wrench before the toggle
  // and the menu at the end of the page)
  const signedOut = !signedInGamerId();
  const gamerToggle = await waitForElement(signedOut ? '.login-full' : '[data-tgl="nav-gamer"]', {
    root: navigationBar
  });
  if (!gamerToggle) {
    return;
  }

  // Where the site would add its gamer panel: at the end of the page
  const page = navigationBar.closest('.page');
  // Without a gamer toggle's panel or a page to put the menu in, the wrench would open nothing
  if (signedOut && !page) {
    return;
  }

  mount(<SettingsMenuButton />, navigationBar, signedOut ? gamerToggle : gamerToggle.nextSibling);

  const menu = <SettingsMenu version={GM_info.script.version || ''} settingsTabs={settingsTabs} />;

  // Signed in, the site adds its gamer panel late and the menu goes after it. Signed out there's no gamer panel (nor if
  // it never shows, given up on as soon as its request fails), so the menu goes at the end of the page.
  const navGamer = signedOut ? null : await waitForSiteGamerPanel();
  if (navGamer?.parentNode) {
    mount(menu, navGamer.parentNode, navGamer.nextSibling);
  } else if (page) {
    mount(menu, page);
  }
};

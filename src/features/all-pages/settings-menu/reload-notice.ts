import { effect } from '@preact/signals';
import { isAppliedLive, settingsList } from '@ta-x-storage';
import { showToast } from '@ta-x-ui';

import type { Setting } from '@ta-x-storage';

import { settingsMenuOpen } from './settings-menu-open';

export const reloadNotice = 'Reload the page to apply your changes.';
// The default filters apply only when a page is opened afresh: a reload keeps the filter the page is on
export const arrivalNotice = 'Default filters apply the next time you open the page.';

// Every setting's value but those a feature on this page applies live (storage's applyLive), to tell which changed
// while the menu was open
const snapshot = (): Map<Setting, string> =>
  new Map(
    settingsList()
      .filter(({ setting }) => !isAppliedLive(setting))
      .map(({ setting }) => [setting, JSON.stringify(setting.peek())])
  );

// What to say about the settings that changed: reload, open the page again (the default filters), or both
const noticeFor = (changed: Setting[], appliedOnArrival: readonly Setting[]): string | null => {
  if (changed.length === 0) {
    return null;
  }

  const onArrival = changed.some((setting) => appliedOnArrival.includes(setting));
  const onReload = changed.some((setting) => !appliedOnArrival.includes(setting));

  if (onArrival && onReload) {
    return `${reloadNotice} ${arrivalNotice}`;
  }

  return onArrival ? arrivalNotice : reloadNotice;
};

let stop: (() => void) | undefined;

// Features read their settings when the page loads, so a change only applies after a reload. When the menu closes
// after a setting changed, a toast says so, once on closing, as plain text. The default filters apply only when a page
// is opened afresh (`appliedOnArrival`, the features' list), so for them it says that instead, or as well
export const watchForChanges = (appliedOnArrival: readonly Setting[]): void => {
  // Only one watcher, however many times the feature starts
  stop?.();

  let openedWith: Map<Setting, string> | undefined;

  stop = effect(() => {
    if (settingsMenuOpen.value) {
      openedWith = snapshot();
      return;
    }

    const text =
      openedWith &&
      noticeFor(
        [...openedWith].filter(([setting, was]) => JSON.stringify(setting.peek()) !== was).map(([setting]) => setting),
        appliedOnArrival
      );
    if (text) {
      showToast({ text, type: 'info', timeoutMs: 5000 });
    }

    openedWith = undefined;
  });
};

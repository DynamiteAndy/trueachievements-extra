import { mount, waitForElement } from '@ta-x-page';
import { whileSetting, type Setting } from '@ta-x-storage';

import type { VNode } from 'preact';

// Adds `button` last in the site's search and filter bar while `setting` is on: applied live, so turning it off in the
// menu removes the button at once. What a click already did stays: it's the user's, not the
// setting's. Its page's entry (index.ts) checks the page first. Returns the stop
export const addSearchAndFilterButton = (setting: Setting<boolean>, button: VNode): (() => void) =>
  whileSetting(
    [setting],
    () => setting.value,
    async (aborted) => {
      const searchAndFilter = await waitForElement('.search-and-filter', { signal: aborted });
      if (!searchAndFilter || aborted.aborted) {
        return undefined;
      }

      return mount(button, searchAndFilter).unmount;
    }
  );

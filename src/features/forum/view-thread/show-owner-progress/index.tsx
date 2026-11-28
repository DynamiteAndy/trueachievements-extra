import { mount, waitForElement, waitForSideColumnSlot } from '@ta-x-page';
import { settings, whileSetting } from '@ta-x-storage';

import { OwnerProgressSection } from './OwnerProgressSection';

const { showOwnerProgress: setting } = settings.forum.viewThread;

// On a forum thread (the entry checks), adds the section while the setting is on if the thread is in the walkthrough
// forum: applied live, so turning it off in the menu takes the section out at once. On again looks the walkthrough up
// afresh (its page is memoized, so it isn't fetched twice). Returns the stop
export default (): (() => void) =>
  whileSetting(
    [setting],
    () => setting.value,
    async (aborted) => {
      const pageTitle = await waitForElement('#oMessageThread .pagetitle', { signal: aborted });
      if (!pageTitle || pageTitle.innerText.toLowerCase() !== 'walkthroughs') {
        return undefined;
      }

      const slot = await waitForSideColumnSlot(aborted);
      if (!slot) {
        return undefined;
      }

      return mount(<OwnerProgressSection />, slot.parent, slot.before).unmount;
    }
  );

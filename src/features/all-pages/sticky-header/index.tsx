import { mount, waitForElement } from '@ta-x-page';
import { settings, whileSetting } from '@ta-x-storage';

import { StickyHeader } from './StickyHeader';

const { enabled } = settings.allPages.stickyHeader;

// Fixes the site's header while the setting is on, applied live: turned off, the controller unmounts and gives the
// header back as it was. The elements stuck under it (the page history, the editor's toolbar) follow on their own, as
// they read the setting each time they're placed and are placed again when the header's class changes. Returns the stop
export default (): (() => void) =>
  whileSetting(
    [enabled],
    () => enabled.value,
    async (signal) => {
      const header = await waitForElement('header', { signal });

      if (signal.aborted || !header?.parentNode) {
        return undefined;
      }

      // Its spacer goes in the header's place, before it
      return mount(<StickyHeader header={header} />, header.parentNode, header).unmount;
    }
  );

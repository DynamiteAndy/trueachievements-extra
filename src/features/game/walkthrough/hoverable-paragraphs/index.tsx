import { mountDetached, waitForElement } from '@ta-x-page';
import { settings, whileSetting } from '@ta-x-storage';

import { HoverableParagraphs } from './HoverableParagraphs';

const { hoverableParagraphs } = settings.game.walkthrough;

// On a walkthrough's page (the entry checks), hands its text to a HoverableParagraphs controller while the setting is
// on: applied live, so turning it off in the menu unmounts it, which takes the mark off at once. Returns the stop
export default (): (() => void) =>
  whileSetting(
    [hoverableParagraphs],
    () => hoverableParagraphs.value,
    async (aborted) => {
      const walkthroughPageBody = await waitForElement('#divWalkthroughPagePreview .walkthroughpage', {
        signal: aborted
      });
      if (!walkthroughPageBody || aborted.aborted) {
        return undefined;
      }

      return mountDetached(<HoverableParagraphs page={walkthroughPageBody} />).unmount;
    }
  );

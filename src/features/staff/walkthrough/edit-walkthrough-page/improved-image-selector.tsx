import { mount, waitForElement } from '@ta-x-page';
import { settings, whileSetting } from '@ta-x-storage';

import { ImprovedImageSelector } from './ImprovedImageSelector';

const { improvedImageSelector: setting } = settings.staff.walkthrough.editWalkthroughPage;

// On the edit page (the entry checks), improves the site's image selector while the setting is on: applied live, so
// turning it off in the menu gives the selector back as it was at once. Returns the stop
export const improveImageSelector = (): (() => void) =>
  whileSetting(
    [setting],
    () => setting.value,
    async (aborted) => {
      const imageContainer = await waitForElement('#oWalkthroughImageViewer, [id=" oWalkthroughImageViewer"]', {
        signal: aborted
      });

      if (!imageContainer) {
        return undefined;
      }

      const imageViewer = await waitForElement('.imageviewer', { root: imageContainer, signal: aborted });
      const imageLink = await waitForElement('.addimages a', { root: imageContainer, signal: aborted });

      if (!imageViewer || !imageLink || aborted.aborted) {
        return undefined;
      }

      return mount(
        <ImprovedImageSelector imageContainer={imageContainer} imageViewer={imageViewer} imageLink={imageLink} />,
        imageContainer,
        imageViewer
      ).unmount;
    }
  );

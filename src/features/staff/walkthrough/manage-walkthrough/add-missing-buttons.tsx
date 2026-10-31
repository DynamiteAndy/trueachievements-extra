import { mount, waitForElement } from '@ta-x-page';
import { settings, whileSetting } from '@ta-x-storage';

import { walkthroughMarkup } from '../shared';

import { MissingButtons } from './MissingButtons';
import { ReadyForReviewButton } from './ReadyForReviewButton';

const { manageWalkthrough } = settings.staff.walkthrough;

// On the manage page (the entry checks), with one of a walkthrough's pages selected, adds the buttons the site leaves
// out, while the setting is on: applied live, so turning it off in the menu takes them away at once. Returns the stop
export const addMissingButtons = (): (() => void) =>
  whileSetting(
    [manageWalkthrough.addMissingButtons],
    () => manageWalkthrough.addMissingButtons.value,
    async (aborted) => {
      if (
        (await waitForElement(walkthroughMarkup.selectedWalkthroughRow, { timeoutMs: 1000, signal: aborted })) === null
      ) {
        return undefined;
      }
      if ((await waitForElement('#txtPageName', { timeoutMs: 1000, signal: aborted })) === null || aborted.aborted) {
        return undefined;
      }

      const buttonContainer = document.querySelector('#chEditWalkthrough .buttons');
      if (!buttonContainer?.parentNode) {
        return undefined;
      }

      const readyForReview = mount(<ReadyForReviewButton />, buttonContainer, buttonContainer.firstChild);
      const missingButtons = mount(<MissingButtons />, buttonContainer.parentNode, buttonContainer);

      return () => {
        readyForReview.unmount();
        missingButtons.unmount();
      };
    }
  );

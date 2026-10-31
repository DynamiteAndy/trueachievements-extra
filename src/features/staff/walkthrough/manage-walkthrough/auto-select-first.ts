import { waitForElement } from '@ta-x-page';
import { StaffRegex } from '@ta-x-site';
import { settings } from '@ta-x-storage';

import { walkthroughMarkup } from '../shared';

const { manageWalkthrough } = settings.staff.walkthrough;

export const autoSelectFirst = async (): Promise<void> => {
  if (!manageWalkthrough.autoSelectFirst.peek()) {
    return;
  }
  if (StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId()) {
    return;
  }

  // The list's scrolling container, a div holding its table
  const walkthroughList = await waitForElement('#scrolllstWalkthroughID');
  if (!walkthroughList) {
    return;
  }

  if ((await waitForElement(walkthroughMarkup.selectedWalkthroughRow, { timeoutMs: 1000 })) === null) {
    walkthroughList.querySelector<HTMLAnchorElement>('table tr a')?.click();
  }
};

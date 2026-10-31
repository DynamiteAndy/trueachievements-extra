import { triggerEvent, waitForElement } from '@ta-x-page';
import { StaffRegex } from '@ta-x-site';
import { settings } from '@ta-x-storage';

const { manageWalkthrough } = settings.staff.walkthrough;

// Whether it set the status, which posts the page back (site-quirks.md), so the page is on its way out
export const changeToDefaultStatus = async (): Promise<boolean> => {
  if (!manageWalkthrough.defaultStatus.peek()) {
    return false;
  }
  if (StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId()) {
    return false;
  }

  const status = await waitForElement<HTMLSelectElement>('#ddlStatusFilter');
  if (!status) {
    return false;
  }

  if (status.querySelector('[selected]') === null && status.value !== manageWalkthrough.defaultStatusValue.peek()) {
    status.value = manageWalkthrough.defaultStatusValue.peek();
    triggerEvent(status, 'change');
    return true;
  }

  return false;
};

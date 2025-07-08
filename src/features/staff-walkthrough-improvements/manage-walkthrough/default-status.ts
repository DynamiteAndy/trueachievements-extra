import { manageWalkthrough, StaffRegex } from '@ta-x-globals';
import { dispatchEvent } from '@ta-x-helpers';
import { waitForElement } from '@ta-x-utilities';

export const changeToDefaultStatus = async (): Promise<void> => {
  if (!manageWalkthrough.manageWalkthroughDefaultStatus) {
    return;
  }
  if (StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId()) {
    return;
  }

  const status = (await waitForElement('#ddlStatusFilter')) as HTMLSelectElement;

  if (
    status.querySelector('[selected]') === null &&
    status.value !== manageWalkthrough.manageWalkthroughDefaultStatusValue
  ) {
    status.value = manageWalkthrough.manageWalkthroughDefaultStatusValue;
    dispatchEvent(status, 'change');
  }
};

export default { changeToDefaultStatus };

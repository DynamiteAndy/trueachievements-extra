import { manageWalkthrough } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import { StaffRegex } from 'globals/regex';

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
    status.onchange(null);
  }
};

export default { changeToDefaultStatus };

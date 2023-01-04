import { manageWalkthrough } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import { StaffRegex } from 'globals/regex';

export const autoSelectFirst = async(): Promise<void> => {
  if (!manageWalkthrough.manageWalkthroughDefaultStatus) return;
  if (StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId()) return;

  const walkthroughList = await waitForElement('#scrolllstWalkthroughID') as HTMLSelectElement;

  if (walkthroughList.querySelector('#lstWalkthroughIDselectedrow') === null &&
    walkthroughList.querySelector('table tr') !== null) {
    (walkthroughList.querySelector('table tr a') as HTMLElement).click();
  }
};

export default { autoSelectFirst };
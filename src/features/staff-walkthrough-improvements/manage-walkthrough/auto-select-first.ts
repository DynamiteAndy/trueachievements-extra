import { manageWalkthrough } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import { StaffRegex } from 'globals/regex';

export const autoSelectFirst = async(): Promise<void> => {
  if (!manageWalkthrough.autoSelectFirst) return;
  if (StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId()) return;

  const walkthroughList = await waitForElement('#scrolllstWalkthroughID') as HTMLSelectElement;

  if (await waitForElement('#lstWalkthroughIDselectedrow', undefined, 1000) === null &&
    walkthroughList.querySelector('table tr') !== null) {
    (walkthroughList.querySelector('table tr a') as HTMLElement).click();
  }
};

export default { autoSelectFirst };
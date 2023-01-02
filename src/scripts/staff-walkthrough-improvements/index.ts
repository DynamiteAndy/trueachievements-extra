import { waitForElement, allConcurrently } from '@ta-x-utilities';
import { Constants } from '@ta-x-globals';
import config from '../../config';
import regex from '../../regex';
import manageWalkthrough from './manage-walkthrough';
import walkthroughPage from './walkthrough-page';
import editWalkthrough from './edit-walkthrough';
import walkthroughPreview from './walkthrough-preview';

export default async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.enabled) return;
  if (!regex.test.staff.walkthrough.all(window.location.href)) return;
  if (!await waitForElement('body')) return;

  document.body.classList.add(Constants.Styles.StaffWalkthroughImprovements.featureJs, Constants.Styles.StaffWalkthroughImprovements.featureStyle);
  
  await allConcurrently(4, [ manageWalkthrough, walkthroughPage, editWalkthrough, walkthroughPreview ]);
};
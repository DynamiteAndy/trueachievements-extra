import { waitForElement, allConcurrently } from '@ta-x-utilities';
import { Constants, staffWalkthroughImprovements, StaffRegex } from '@ta-x-globals';
import manageWalkthrough from './manage-walkthrough';
import walkthroughPage from './walkthrough-page';
import editWalkthrough from './edit-walkthrough';
import walkthroughPreview from './walkthrough-preview';

export default async(): Promise<void> => {
  if (!staffWalkthroughImprovements.enabled) return;
  if (!StaffRegex.Walkthroughs.Test.all()) return;
  if (!await waitForElement('body')) return;

  document.body.classList.add(Constants.Styles.StaffWalkthroughImprovements.featureJs, Constants.Styles.StaffWalkthroughImprovements.featureStyle);
  
  await allConcurrently(4, [ manageWalkthrough, walkthroughPreview, walkthroughPage, editWalkthrough ]);
};
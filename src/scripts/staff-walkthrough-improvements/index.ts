import { log } from 'missionlog';
import { allConcurrently } from '../components/promise';
import { Constants } from '../../constants';
import { waitForElement } from '../helpers/wait';
import config from '../../config';
import regex from '../../regex';
import manageWalkthrough from './manage-walkthrough';
import walkthroughPage from './walkthrough-page';
import editWalkthrough from './edit-walkthrough';
import walkthroughPreview from './walkthrough-preview';

export default async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.enabled) return;
  if (!regex.test.staff.walkthrough.all(window.location.href)) return;

  log.debug('Staff-Walkthrough-Improvements', 'Starting');

  if (await waitForElement('body')) {
    document.body.classList.add(Constants.Styles.StaffWalkthroughImprovements.featureJs, Constants.Styles.StaffWalkthroughImprovements.featureStyle);
  
    await allConcurrently(4, [ manageWalkthrough, walkthroughPage, editWalkthrough, walkthroughPreview ]);
    
    log.debug('Staff-Walkthrough-Improvements', 'Finished');
  } else {
    log.error('Staff-Walkthrough-Improvements', 'Failed to add, The body element was not found.');
  }
};
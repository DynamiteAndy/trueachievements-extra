import { waitForElement, allConcurrently } from '@ta-x-utilities';
import { StaffRegex } from '@ta-x-globals';
import manageWalkthrough from './manage-walkthrough';
import walkthroughPage from './walkthrough-page';
import editWalkthrough from './edit-walkthrough';
import walkthroughPreview from './walkthrough-preview';
import styles from './styles';

export default async (): Promise<void> => {
  if (!StaffRegex.Walkthroughs.Test.all()) {
    return;
  }

  if (!(await waitForElement('body'))) {
    return;
  }

  document.body.classList.add(styles.jsStaffWalkthroughImprovements, styles.staffWalkthroughImprovements);

  await allConcurrently(
    'Staff Walkthrough Improvements',
    [
      { name: 'staff-walkthrough-improvements:manage-walkthrough', task: manageWalkthrough },
      { name: 'staff-walkthrough-improvements:walkthrough-preview', task: walkthroughPreview },
      { name: 'staff-walkthrough-improvements:walkthrough-page', task: walkthroughPage },
      { name: 'staff-walkthrough-improvements:edit-walkthrough', task: editWalkthrough }
    ],
    4
  );
};

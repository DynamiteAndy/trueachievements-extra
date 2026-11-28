import { StaffRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import editWalkthrough from './edit-walkthrough-page';
import manageWalkthrough from './manage-walkthrough';
import styles from './styles';
import walkthroughPage from './walkthrough-page';
import walkthroughPreview from './walkthrough-preview';

import staffWalkthrough from '.';

describeEntry('staff/walkthrough', {
  run: staffWalkthrough,
  page: () => vi.spyOn(StaffRegex.Walkthroughs.Test, 'all'),
  batch: 'Staff Walkthrough',
  tasks: [
    { name: 'staff:walkthrough:manage-walkthrough', task: manageWalkthrough },
    { name: 'staff:walkthrough:walkthrough-preview', task: walkthroughPreview },
    { name: 'staff:walkthrough:walkthrough-page', task: walkthroughPage },
    { name: 'staff:walkthrough:edit-walkthrough-page', task: editWalkthrough }
  ],
  bodyClasses: [styles.staff]
});

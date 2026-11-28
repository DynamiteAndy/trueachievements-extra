import { allConcurrently } from '@ta-x-lib';
import { bodyReady } from '@ta-x-page';
import { StaffRegex } from '@ta-x-site';

import editWalkthrough from './edit-walkthrough-page';
import manageWalkthrough from './manage-walkthrough';
import styles from './styles';
import walkthroughPage from './walkthrough-page';
import walkthroughPreview from './walkthrough-preview';

export { carryOverPreviewPageWalkthroughs, previewPageWalkthroughs } from './walkthrough-preview';

// Its tab in the settings menu (features/settings-tabs.tsx)
export { StaffWalkthroughSettings } from './StaffWalkthroughSettings';

export default async (): Promise<void> => {
  if (!StaffRegex.Walkthroughs.Test.all()) {
    return;
  }

  // Our styles for these pages hang off it; nothing here needs to wait for it
  const marked = bodyReady().then((body) => body.classList.add(styles.staff));

  await Promise.all([
    marked,
    // The pages' entries hand back their unmounts, which nothing here needs
    allConcurrently<unknown>('Staff Walkthrough', [
      { name: 'staff:walkthrough:manage-walkthrough', task: manageWalkthrough },
      { name: 'staff:walkthrough:walkthrough-preview', task: walkthroughPreview },
      { name: 'staff:walkthrough:walkthrough-page', task: walkthroughPage },
      { name: 'staff:walkthrough:edit-walkthrough-page', task: editWalkthrough }
    ])
  ]);
};

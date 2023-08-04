import { StaffRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { autoSaveNotification } from './auto-save-notification';
import { improveImageSelector } from './improved-image-selector';
import { tinymce } from './tinymce';

export default async (): Promise<void> => {
  if (!StaffRegex.Walkthroughs.Test.editWalkthroughUrl()) return;

  allConcurrently(
    'Edit Walkthrough',
    [
      { name: 'edit-walkthrough-improve-image-selector', task: improveImageSelector },
      { name: 'edit-walkthrough-auto-save-notification', task: autoSaveNotification },
      { name: 'edit-walkthrough-tinymce', task: tinymce }
    ],
    3
  );
};

import { allConcurrently } from '@ta-x-lib';
import { StaffRegex } from '@ta-x-site';

import { autoSaveNotification } from './auto-save-notification';
import { improveImageSelector } from './improved-image-selector';
import { themeEditorEarly, tinymce } from './tinymce';

export default async (): Promise<void> => {
  if (!StaffRegex.Walkthroughs.Test.editWalkthroughUrl()) {
    return;
  }

  // The image selector and the autosave notification hand back their stops, which nothing here needs
  await allConcurrently<unknown>('Edit Walkthrough', [
    { name: 'staff:walkthrough:edit-walkthrough-page:theme-editor-early', task: themeEditorEarly },
    { name: 'staff:walkthrough:edit-walkthrough-page:improve-image-selector', task: improveImageSelector },
    { name: 'staff:walkthrough:edit-walkthrough-page:auto-save-notification', task: autoSaveNotification },
    { name: 'staff:walkthrough:edit-walkthrough-page:tinymce', task: tinymce }
  ]);
};

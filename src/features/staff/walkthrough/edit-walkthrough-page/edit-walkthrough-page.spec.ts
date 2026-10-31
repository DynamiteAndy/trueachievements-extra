import { StaffRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import { autoSaveNotification } from './auto-save-notification';
import { improveImageSelector } from './improved-image-selector';
import { themeEditorEarly, tinymce } from './tinymce';

import editWalkthrough from '.';

describeEntry('staff/walkthrough/edit-walkthrough-page', {
  run: editWalkthrough,
  page: () => vi.spyOn(StaffRegex.Walkthroughs.Test, 'editWalkthroughUrl'),
  batch: 'Edit Walkthrough',
  tasks: [
    { name: 'staff:walkthrough:edit-walkthrough-page:theme-editor-early', task: themeEditorEarly },
    { name: 'staff:walkthrough:edit-walkthrough-page:improve-image-selector', task: improveImageSelector },
    { name: 'staff:walkthrough:edit-walkthrough-page:auto-save-notification', task: autoSaveNotification },
    { name: 'staff:walkthrough:edit-walkthrough-page:tinymce', task: tinymce }
  ]
});

import { StaffRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { autoSaveNotification } from './auto-save-notification';
import { improveImageSelector } from './improved-image-selector';
import { addTinymceThemeToggle } from './toggle-tinymce-theme';
import { fixTinymceFullWidthToolbar } from './tinymce-fullwidth-toolbar';
import { fixTinymceFloatingMenus } from './tinymce-floating-menu';

export default async(): Promise<void> => {
  if (!StaffRegex.Walkthroughs.Test.editWalkthroughUrl()) return;

  allConcurrently('Edit Walkthrough', [
    { name: 'edit-walkthrough-improve-image-selector', task: improveImageSelector },
    { name: 'edit-walkthrough-add-tinymce-theme-toggle', task: addTinymceThemeToggle },
    { name: 'edit-walkthrough-auto-save-notification', task: autoSaveNotification },
    { name: 'edit-walkthrough-fix-tinymce-fullwidth-toolbar', task: fixTinymceFullWidthToolbar },
    { name: 'edit-walkthrough-fix-tinymce-fullwidth-toolbar', task: fixTinymceFloatingMenus }
  ], 3);
};
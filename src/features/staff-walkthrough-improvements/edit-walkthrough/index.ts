import { StaffRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { improveImageSelector } from './improved-image-selector';
import { addTinymceThemeToggle } from './toggle-tinymce-theme';

export default async(): Promise<void> => {
  if (!StaffRegex.Walkthroughs.Test.editWalkthroughUrl()) return;

  await allConcurrently(2, [
    improveImageSelector,
    addTinymceThemeToggle
  ]);
};
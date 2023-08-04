import { allConcurrently } from '@ta-x-utilities';
import { StaffRegex } from '@ta-x-globals';
import { removeAside } from './remove-aside';
import { populateAsideContent } from './populate-aside-content';

export default async (): Promise<void> => {
  if (!StaffRegex.Walkthroughs.Test.preview()) return;

  allConcurrently('Walkthrough Preview', [
    { name: 'walkthrough-preview-remove-aside', task: removeAside },
    { name: 'walkthrough-preview-populate-aside-content', task: populateAsideContent }
  ]);
};

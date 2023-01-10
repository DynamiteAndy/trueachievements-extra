import { waitForElement, allConcurrently } from '@ta-x-utilities';
import { Constants, ForumRegex, forumImprovements } from '@ta-x-globals';
import walkthroughs from './walkthroughs';

export default async(): Promise<void> => {
  if (!forumImprovements.enabled) return;
  if (!ForumRegex.Test.all()) return;
  if (!await waitForElement('body')) return;

  document.body.classList.add(Constants.Styles.ForumImprovements.featureJs, Constants.Styles.ForumImprovements.featureStyle);
  
  allConcurrently('Forum Improvements', [ 
    { name: 'forum-improvements-walkthroughs', task: walkthroughs }
  ]);
};
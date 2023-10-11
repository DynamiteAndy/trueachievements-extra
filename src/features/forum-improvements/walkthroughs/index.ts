import { ForumRegex } from '@ta-x-globals';
import { allConcurrently, waitForElement } from '@ta-x-utilities';
import showOwnerProgress from './show-owner-progress';

export default async (): Promise<void> => {
  if (!ForumRegex.Test.viewBoardUrlWithBoardId() && !ForumRegex.Test.viewThreadUrlWithThreadId()) {
    return;
  }

  if (ForumRegex.Test.viewBoardUrlWithBoardId()) {
    const messageBoardId = '1431';
    const params = new URLSearchParams(window.location.search);

    if (params.get('messageboardid') !== messageBoardId) {
      return;
    }
  }

  if (ForumRegex.Test.viewThreadUrlWithThreadId()) {
    const pageTitle = (await waitForElement('#oMessageThread .pagetitle')) as HTMLElement;

    if (!pageTitle || pageTitle.innerText.toLowerCase() !== 'walkthroughs') {
      return;
    }
  }

  allConcurrently('Walkthrough Page', [{ name: 'walkthroughs-show-owner-progress', task: showOwnerProgress }]);
};

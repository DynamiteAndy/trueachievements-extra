import { Constants } from '@ta-x-globals';
import { allConcurrently, waitForElement } from '@ta-x-utilities';
import { StaffRegex } from '../../../globals/regex';
import { addWalkthroughTeamButton } from './add-walkthrough-team-button';
import { moveButtonsToLeft } from './move-buttons-to-left';
import { setPageHistorySticky } from './sticky-page-history';
import { highlightPageLocked } from './highlight-page-locked';
import html from './walkthrough-page.html';

let walkthroughContainer: HTMLElement;
let walkthoughPageVersions: HTMLElement;

const applyBody = async(): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  
  walkthoughPageVersions = await waitForElement('#chWalkthroughPageVersions');
  walkthoughPageVersions.parentElement.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`),
    walkthoughPageVersions);

  walkthroughContainer = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`);
  walkthroughContainer.appendChild(walkthoughPageVersions);

  moveWalkthroughPagePreview();
};

const moveWalkthroughPagePreview = async(): Promise<void> => {
  const walkthoughPagePreview = await waitForElement('#chWalkthroughPagePreview');
  
  if (walkthoughPagePreview) {
    walkthroughContainer.appendChild(walkthoughPagePreview);
  }
};

export default async(): Promise<void> => {
  if (!StaffRegex.Walkthroughs.Test.walkthroughPageUrl()) return;

  await applyBody();
  allConcurrently('Walkthrough Page', [ 
    { name: 'walkthrough-page-set-page-history-sticky', task: async() => setPageHistorySticky(walkthroughContainer, walkthoughPageVersions) },
    { name: 'walkthrough-page-add-walkthrough-team-button', task: async() => addWalkthroughTeamButton(walkthroughContainer, walkthoughPageVersions) },
    { name: 'walkthrough-page-move-buttons-to-left', task: async() => moveButtonsToLeft(walkthroughContainer, walkthoughPageVersions) },
    { name: 'walkthrough-page-highlight-page-locked', task: async() => highlightPageLocked(walkthroughContainer) }
   ]);
};

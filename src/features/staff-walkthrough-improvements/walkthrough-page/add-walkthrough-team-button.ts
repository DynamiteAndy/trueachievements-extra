import { Constants, walkthroughPage } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import html from './walkthrough-page.html';

export const addWalkthroughTeamButton = async(walkthroughContainer: HTMLElement, walkthoughPageVersions: HTMLElement): Promise<void> => {
  if (!walkthroughPage.walkthroughTeamButton) return;
  if (!walkthroughContainer || !walkthoughPageVersions) return;

  const walkthroughPageButtons =  await waitForElement('.content .buttons', walkthoughPageVersions);

  if (walkthroughPageButtons) {
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');

    walkthroughPageButtons.appendChild(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonJs}`));
  }
};

export default { addWalkthroughTeamButton };
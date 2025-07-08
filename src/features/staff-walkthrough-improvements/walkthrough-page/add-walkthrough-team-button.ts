import { walkthroughPage } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import html from './walkthrough-page.html';
import styles from './styles';

export const addWalkthroughTeamButton = async (
  walkthroughContainer: HTMLElement,
  walkthoughPageVersions: HTMLElement
): Promise<void> => {
  if (!walkthroughPage.walkthroughTeamButton) {
    return;
  }
  if (!walkthroughContainer || !walkthoughPageVersions) {
    return;
  }

  const walkthroughPageButtons = await waitForElement('.content .buttons', walkthoughPageVersions);

  if (walkthroughPageButtons) {
    if (document.querySelector('#btnBackToWalkthrough')) {
      return;
    }

    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');

    walkthroughPageButtons.appendChild(parsedDocument.querySelector(`.${styles.jsWalkthroughPageWalkthroughTeamButton}`));
  }
};

export default { addWalkthroughTeamButton };

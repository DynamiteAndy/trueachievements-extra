import { manageWalkthrough } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import html from './manage-walkthrough.html';
import styles from './styles';

export const addMissingButtons = async (): Promise<void> => {
  if (!manageWalkthrough.addMissingButtons) {
    return;
  }
  if ((await waitForElement('#lstWalkthroughIDselectedrow', undefined, 1000)) === null) {
    return;
  }
  if ((await waitForElement('#txtPageName', undefined, 1000)) === null) {
    return;
  }

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');

  let buttonContainer = document.querySelector('#chEditWalkthrough .buttons');
  buttonContainer.insertBefore(
    parsedDocument.querySelector(`.${styles.jsManageWalkthroughReadyForReviewButton}`),
    buttonContainer.children[0]
  );
  buttonContainer.parentNode.insertBefore(
    parsedDocument.querySelector(`.${styles.jsManageWalkthroughMissingButtonsContainer}`),
    buttonContainer
  );
  buttonContainer = document.querySelector(`.${styles.jsManageWalkthroughMissingButtonsContainer}`);

  (buttonContainer.querySelector(`.${styles.jsManageWalkthroughAddPageButton}`) as HTMLAnchorElement).href =
    'javascript:Postback("btnAddPage")';
  (buttonContainer.querySelector(`.${styles.jsManageWalkthroughPreviewButton}`) as HTMLAnchorElement).href =
    'javascript:Postback("btnPreview")';
  (buttonContainer.querySelector(`.${styles.jsManageWalkthroughViewContentButton}`) as HTMLAnchorElement).href =
    'javascript:Postback("btnViewContent")';
};

export default { addMissingButtons };

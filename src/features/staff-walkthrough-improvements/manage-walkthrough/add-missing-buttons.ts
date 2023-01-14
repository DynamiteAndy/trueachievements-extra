import { Constants, manageWalkthrough } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import html from './manage-walkthrough.html';

export const addMissingButtons = async(): Promise<void> => {
  if (!manageWalkthrough.addMissingButtons) return;
  if (await waitForElement('#lstWalkthroughIDselectedrow', undefined, 1000) === null) return;
  if (await waitForElement('#txtPageName', undefined, 1000) === null) return;

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');

  let buttonContainer = document.querySelector('#chEditWalkthrough .buttons');
  buttonContainer.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.readyForReviewButtonJs}`), buttonContainer.children[0]);
  buttonContainer.parentNode.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.missingButtonsContainerJs}`), buttonContainer);
  buttonContainer = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.missingButtonsContainerJs}`);

  (buttonContainer.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.addPageButtonJs}`) as HTMLAnchorElement).href = 'javascript:Postback("btnAddPage")';
  (buttonContainer.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.previewButtonJs}`) as HTMLAnchorElement).href = 'javascript:Postback("btnPreview")';
  (buttonContainer.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.viewContentButtonJs}`) as HTMLAnchorElement).href = 'javascript:Postback("btnViewContent")';
};

export default { addMissingButtons };
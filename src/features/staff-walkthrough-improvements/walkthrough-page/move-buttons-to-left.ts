import { walkthroughPage } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import styles from './styles';

export const moveButtonsToLeft = async (
  walkthroughContainer: HTMLElement,
  walkthoughPageVersions: HTMLElement
): Promise<void> => {
  if (!walkthroughPage.moveButtonsToLeft) {
    return;
  }
  if (!walkthroughContainer || !walkthoughPageVersions) {
    return;
  }

  const walkthroughContainerButtons = await waitForElement(
    '#btnEditPage, #btnEditPage2, #btnUnlockWalkthroughPage, #btnUnlockWalkthroughPage2',
    walkthroughContainer
  );
  const walkthroughPageVersionButtons = await waitForElement('.content .buttons', walkthoughPageVersions);

  if (walkthroughContainerButtons && walkthroughPageVersionButtons) {
    walkthroughPageVersionButtons.append(...walkthroughContainerButtons.parentElement.childNodes);

    walkthroughContainer.classList.add(styles.walkthroughPageMoveButtonsToLeft);
  }
};

export default { moveButtonsToLeft };

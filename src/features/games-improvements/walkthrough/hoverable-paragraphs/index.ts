import { gamesImprovements } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import styles from './styles';

export default async (): Promise<void> => {
  if (!gamesImprovements.walkthrough.gameWalkthroughHoverableParagraphs) {
    return;
  }

  const walkthroughPageBody = await waitForElement('#divWalkthroughPagePreview .walkthroughpage');
  if (!walkthroughPageBody) {
    return;
  }

  walkthroughPageBody.classList.add(styles.hoverableParagraphs);
};

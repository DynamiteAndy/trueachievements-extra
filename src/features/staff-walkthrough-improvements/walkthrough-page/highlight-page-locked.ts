import { walkthroughPage } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';

export const highlightPageLocked = async (walkthroughContainer: HTMLElement): Promise<void> => {
  if (!walkthroughPage.highlightPageLocked) return;
  if (!walkthroughContainer) return;

  const walkthroughLocked = await waitForElement('.walkthroughlocked', walkthroughContainer);

  if (walkthroughLocked) {
    walkthroughLocked.classList.add('informationpanel');
  }
};

export default { highlightPageLocked };

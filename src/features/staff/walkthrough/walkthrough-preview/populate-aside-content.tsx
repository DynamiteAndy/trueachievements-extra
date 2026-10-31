import { mount, waitForElement } from '@ta-x-page';

import { asideSelector } from './hide-aside';
import { PreviewAside } from './PreviewAside';

// Fills the side column (the feature's index runs it only while "Fill In Side Column" is on). Resolves with what takes it
// out again
export const populateAsideContent = async (): Promise<() => void> => {
  const aside = await waitForElement(asideSelector);
  if (!aside) {
    return () => undefined;
  }

  const root = mount(<PreviewAside />, aside);

  return root.unmount;
};

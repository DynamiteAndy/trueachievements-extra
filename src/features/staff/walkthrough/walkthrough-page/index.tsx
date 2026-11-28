import { mount, waitForElement } from '@ta-x-page';
import { StaffRegex } from '@ta-x-site';

import { WalkthroughPage } from './WalkthroughPage';

// The function returned unmounts the controller, giving the site's page back as it was
export default async (): Promise<(() => void) | undefined> => {
  if (!StaffRegex.Walkthroughs.Test.walkthroughPageUrl()) {
    return undefined;
  }

  const pageVersions = await waitForElement('#chWalkthroughPageVersions');

  if (!pageVersions?.parentElement) {
    return undefined;
  }

  // Its container goes where the page history is
  return mount(<WalkthroughPage pageVersions={pageVersions} />, pageVersions.parentElement, pageVersions).unmount;
};

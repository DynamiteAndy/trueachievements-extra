import { createPageScript, type PageArgument, type PageFunction, waitForElement } from '@ta-x-page';

import { findOrAddButtonGroup } from './button-group';

// A page function (page/page-script.ts) and the arguments it's run with
type PageCall = [PageFunction, ...PageArgument[]];

interface TinyMCEScriptOptions {
  id: string;
  // A button the site usually adds itself, by selector: the script is skipped if it's there. Such a button goes in the
  // site's own toolbar groups, so the script doesn't wait for our TA-X group either
  siteButton?: string;
  build: () => PageCall | Promise<PageCall>;
  after?: () => Promise<void>;
}

// Injects a script into the page to add a button to TinyMCE (the editor's API is the page's, out of the userscript's
// reach). By default it's added once our TA-X group is in the toolbar
export const injectTinyMCEScript = async ({ id, siteButton, build, after }: TinyMCEScriptOptions): Promise<void> => {
  if (siteButton) {
    // A short wait: the site's toolbar is drawn by the time the editor is
    if (await waitForElement(siteButton, { timeoutMs: 250 })) {
      return;
    }
  } else if (!(await findOrAddButtonGroup())) {
    // Not even added again (no editor): there's nothing to add the button to
    return;
  }

  const [fn, ...args] = await build();
  document.body.appendChild(createPageScript(id, fn, args));
  await after?.();
};

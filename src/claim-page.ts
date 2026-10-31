// Which copy of the script runs on a page. The dev script and the two release scripts (readable and minified) are
// userscripts of their own, so more than one can be enabled at once, and each would run every feature: two settings
// menus, doubled buttons, the giveaway posted twice. Tampermonkey tells a script nothing about the others, but they
// share the page: the first to start marks it, and any later one stands down. Scripts start one after another at
// document-start, in Tampermonkey's order, so a later one always sees the mark.

import { logger } from '@ta-x-lib';
import { showToast, stylesheet, toast } from '@ta-x-ui';

// On the page's root element, naming the copy that runs
export const runningAttribute = 'data-ta-x-running';

export const isDevScript = (): boolean => GM_info.script.name.endsWith(' - Development');

// Each copy by the file it's installed from, as the two release scripts share a name. The dev script has no download
// address, so its file is named here (build/rspack.dev.conf.ts)
const thisCopy = (): string =>
  isDevScript()
    ? 'trueachievements-extras.dev.user.js'
    : (GM_info.script.downloadURL?.split('/').pop() ?? GM_info.script.name);

// Whether this copy runs: only the first on the page does. The root element is there at document-start
export const claimPage = (): boolean => {
  const root = document.documentElement;
  const running = root.getAttribute(runningAttribute);

  if (running === null) {
    root.setAttribute(runningAttribute, thisCopy());
    return true;
  }

  logger.warn('claim-page', `${running} is already running on this page, so ${thisCopy()} isn't`);
  return false;
};

// A dev build that stood down would leave the developer checking the other copy's code without knowing, so it says so
// in a toast of its own (styled by its own sheet, as the other copy's may be an older build)
export const warnDevStoodDown = async (): Promise<void> => {
  await Promise.all([stylesheet(), toast()]);
  showToast({
    text: `This dev build isn't running: ${document.documentElement.getAttribute(runningAttribute)} started first. Disable it, or move the dev script above it in Tampermonkey.`,
    type: 'danger',
    timeoutMs: 15_000
  });
};

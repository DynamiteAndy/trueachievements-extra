import { isFreshArrival, whenParsed } from '@ta-x-page';
import { pageParam, StaffRegex } from '@ta-x-site';
import { settings } from '@ta-x-storage';

import { selectedWalkthroughId } from '../shared';

import { forgetWalkthroughCopies } from './aside-content';
import { hideAside } from './hide-aside';
import { populateAsideContent } from './populate-aside-content';
import { changesWalkthrough, recordPostbackCommands, takePostbackCommand } from './postback-command';

// For the maintenance task (src/maintenance.ts), which carries the list over and sweeps it
export { carryOverPreviewPageWalkthroughs, previewPageWalkthroughs } from './preview-page-walkthroughs';

const { walkthroughPreview } = settings.staff.walkthrough;

// The walkthroughs whose manage page and preview should be read afresh: the one in the address, and on the manage page
// the one its list has selected, as picking a walkthrough there posts back to the address the page was on
const visitedWalkthroughs = async (): Promise<string[]> => {
  const ids = [pageParam('walkthroughid')?.trim() ?? ''];

  if (StaffRegex.Walkthroughs.Test.manageWalkthroughUrl()) {
    await whenParsed();
    ids.push(selectedWalkthroughId() ?? '');
  }

  return [...new Set(ids.filter((id) => /^\d+$/.test(id)))];
};

// A walkthrough preview's side column: filled with the walkthrough's pages, thanks and achievements when "Fill In Side
// Column" is on (which hides it itself when there's nothing to show), hidden when it's off. Filled, it hands
// back the filled column's unmount, as the other staff entries hand back theirs. On a walkthrough's manage page or
// walkthrough page it only drops the cached copies of that walkthrough's manage page, preview and public page, after a
// post back there that may have changed it, handing back what stops it listening for the next
export default async (): Promise<(() => void) | undefined> => {
  // A walkthrough's manage page and walkthrough page are where its pages, games and achievements change, each change a
  // post back: only after one that may have changed it (a save, a delete, an unknown command, or a reload) are the
  // cached copies of its manage page, preview and public page dropped, so what reads them next shows the change. A
  // plain visit, or a post back that only looks (a sort, a filter, picking a walkthrough), keeps them
  if (StaffRegex.Walkthroughs.Test.manageWalkthroughUrl() || StaffRegex.Walkthroughs.Test.walkthroughPageUrl()) {
    const postback = takePostbackCommand();
    const stopRecording = recordPostbackCommands();

    if (!isFreshArrival() && changesWalkthrough(postback)) {
      for (const walkthroughId of await visitedWalkthroughs()) {
        await forgetWalkthroughCopies(walkthroughId);
      }
    }

    return stopRecording;
  }

  if (!StaffRegex.Walkthroughs.Test.preview()) {
    return undefined;
  }

  if (walkthroughPreview.populateAsideContent.peek()) {
    return populateAsideContent();
  }

  await hideAside();
  return undefined;
};

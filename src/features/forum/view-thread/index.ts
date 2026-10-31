import { allConcurrently } from '@ta-x-lib';
import { ForumRegex, GamesRegex } from '@ta-x-site';

import showOwnerProgress from './show-owner-progress';
import rememberWalkthroughThread from './show-owner-progress/remember-walkthrough-thread';

// For the maintenance task (src/maintenance.ts), which carries the list over and sweeps it
export { carryOverOwnerProgressUrls, ownerProgressUrls } from './show-owner-progress/owner-progress-urls';

// On a forum thread, show owner progress checks it's in the walkthrough forum; on a game's walkthrough, it remembers
// the walkthrough for its thread
export default async (): Promise<void> => {
  // Each hands back its stop, which nothing here needs
  if (ForumRegex.Test.viewThreadUrlWithThreadId()) {
    await allConcurrently<unknown>('Forum Walkthroughs', [
      { name: 'forum:view-thread:show-owner-progress', task: showOwnerProgress }
    ]);
  } else if (GamesRegex.Test.walkthroughUrl()) {
    await allConcurrently<unknown>('Game Walkthroughs', [
      { name: 'forum:view-thread:remember-walkthrough-thread', task: rememberWalkthroughThread }
    ]);
  }
};

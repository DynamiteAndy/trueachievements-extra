import { allConcurrently } from '@ta-x-lib';
import { ForumRegex, GamesRegex } from '@ta-x-site';

import myThreads from './my-threads';
import viewBoard from './view-board';
import viewThread from './view-thread';

// For the games forum, which filters its threads the same way and shows the same filter's settings
export { filterThreadsWhileOn, ThreadFilterSettings } from './shared';
export { carryOverOwnerProgressUrls, ownerProgressUrls } from './view-thread';

// Its tab in the settings menu (features/settings-tabs.tsx)
export { ForumSettings } from './ForumSettings';

export default async (): Promise<void> => {
  // A walkthrough's own page too: Show Walkthrough Information remembers its thread there
  if (!ForumRegex.Test.all() && !GamesRegex.Test.walkthroughUrl()) {
    return;
  }

  await allConcurrently('Forum', [
    { name: 'forum:my-threads', task: myThreads },
    { name: 'forum:view-board', task: viewBoard },
    { name: 'forum:view-thread', task: viewThread }
  ]);
};

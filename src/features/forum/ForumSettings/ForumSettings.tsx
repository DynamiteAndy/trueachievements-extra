import { settings } from '@ta-x-storage';

import { MyThreadsSettings } from '../my-threads/MyThreadsSettings';
import { ThreadFilterSettings } from '../shared';
import { WalkthroughThreadsSettings } from '../view-thread/WalkthroughThreadsSettings';

// The settings menu's Forums tab
export const ForumSettings = () => {
  const forum = settings.forum;

  return (
    <>
      <ThreadFilterSettings threadFilter={forum.threadFilter} keywords={forum.threadFilterKeywords} />

      <MyThreadsSettings />
      <WalkthroughThreadsSettings />
    </>
  );
};

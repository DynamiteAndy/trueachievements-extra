import { settings } from '@ta-x-storage';
import { Accordion } from '@ta-x-ui';

import { ThreadFilterSettings } from '../../shared';

// My Threads' settings in the settings menu's Forums tab. Without the override, My Threads uses the
// forum's own thread filter
export const MyThreadsSettings = () => {
  const myThreads = settings.forum.myThreads;

  return (
    <Accordion title="My Threads" contentClasses="t-settings">
      <ThreadFilterSettings
        override={myThreads.overrideForumThreadFilter}
        threadFilter={myThreads.threadFilter}
        keywords={myThreads.threadFilterKeywords}
      />
    </Accordion>
  );
};

import { allConcurrently } from '@ta-x-lib';

import achievement from './achievement';
import achievements from './achievements';
import challenges from './challenges';
import clips from './clips';
import dlc from './dlc';
import forum from './forum';
import { linkForumsToDefaultThread } from './forum/default-thread-links';
import walkthrough from './walkthrough';

// For the entry (guide sites' pages), the maintenance task (the hand-over it takes) and the settings menu (this area's
// settings, which its tab shows after the games list's, and the settings that apply only on arriving at a page)
export { forgetUnlinkedGuidePages, isGuideSite, readGuidePage, takeAllHandedOverGuides } from './extra-guides';
export { settingsAppliedOnArrival } from './shared';
export { GameSettings } from './GameSettings';

export default async (): Promise<void> => {
  await allConcurrently<unknown>('Game', [
    { name: 'game:achievement', task: achievement },
    { name: 'game:achievements', task: achievements },
    { name: 'game:challenges', task: challenges },
    { name: 'game:clips', task: clips },
    { name: 'game:dlc', task: dlc },
    { name: 'game:forum', task: forum },
    { name: 'game:forum-links', task: linkForumsToDefaultThread },
    { name: 'game:walkthrough', task: walkthrough }
  ]);
};

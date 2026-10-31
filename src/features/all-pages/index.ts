import { allConcurrently } from '@ta-x-lib';

import emojis from './emojis';
import giveawayAutoOptIn from './giveaway-auto-opt-in';
import stickyHeader from './sticky-header';

// For maintenance.ts, when the signed-in gamer changes
export { forgetGiveawayTries } from './giveaway-auto-opt-in';

// Its tab in the settings menu (features/settings-tabs.tsx)
export { AllPagesSettings } from './AllPagesSettings';

export default async (): Promise<void> => {
  // Each hands back its stop, which nothing here needs
  await allConcurrently<unknown>('All Pages', [
    { name: 'all-pages:sticky-header', task: stickyHeader },
    { name: 'all-pages:emojis', task: emojis },
    { name: 'all-pages:giveaway-auto-opt-in', task: giveawayAutoOptIn }
  ]);
};

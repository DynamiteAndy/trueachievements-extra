import { allConcurrently } from '@ta-x-lib';
import { whenParsed } from '@ta-x-page';
import { GamesRegex } from '@ta-x-site';

import { importGuides } from '../extra-guides';
import { addAchievementLeaderboardLink } from '../shared';

import { collapsibleGroups } from './collapsible-groups';
import { changeToDefaultStatus } from './default-status';
import { individualProgress } from './individual-progress';
import { overrideAppliedLive } from './override-applied-live';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.dlc()) {
    return;
  }

  // Picking the default status posts the page back, so the list tasks are left to the page that comes back. They read
  // the whole list, so they wait for it to be parsed
  if (await changeToDefaultStatus()) {
    return;
  }

  await whenParsed();

  // One DLC's own page has no groups to count or collapse, so only the leaderboard link and the guides (and the
  // override, which switches the two, isn't registered there either)
  if (GamesRegex.Test.individualDlcUrl()) {
    await allConcurrently<unknown>('Game DLC', [
      { name: 'game:dlc:achievement-leaderboard-link', task: addAchievementLeaderboardLink },
      { name: 'game:dlc:extra-guides', task: importGuides }
    ]);
    return;
  }

  // Individual progress and collapsible groups apply live, and with them the override (unless it would switch a default
  // status), each handing back its stop, which nothing here needs
  await allConcurrently<unknown>('Game DLC', [
    { name: 'game:dlc:individual-progress', task: individualProgress },
    { name: 'game:dlc:achievement-leaderboard-link', task: addAchievementLeaderboardLink },
    { name: 'game:dlc:extra-guides', task: importGuides },
    { name: 'game:dlc:collapsible-groups', task: collapsibleGroups },
    { name: 'game:dlc:override-applied-live', task: overrideAppliedLive }
  ]);
};

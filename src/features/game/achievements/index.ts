import { allConcurrently } from '@ta-x-lib';
import { whenParsed } from '@ta-x-page';
import { GamesRegex } from '@ta-x-site';

import { importGuides } from '../extra-guides';
import { addAchievementLeaderboardLink } from '../shared';

import { collapsibleGroups } from './collapsible-groups';
import { changeToDefaultStatus } from './default-status';
import { individualProgress } from './individual-progress';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.achievementsUrl()) {
    return;
  }

  // Picking the default status posts the page back, so the list tasks are left to the page that comes back. They read
  // the whole list, so they wait for it to be parsed
  if (await changeToDefaultStatus()) {
    return;
  }

  await whenParsed();

  // Individual progress and collapsible groups apply live, each handing back its stop, which nothing here needs
  await allConcurrently<unknown>('Game Achievements', [
    { name: 'game:achievements:individual-progress', task: individualProgress },
    { name: 'game:achievements:extra-guides', task: importGuides },
    { name: 'game:achievements:achievement-leaderboard-link', task: addAchievementLeaderboardLink },
    { name: 'game:achievements:collapsible-groups', task: collapsibleGroups }
  ]);
};

import { allConcurrently } from '@ta-x-lib';
import { whenParsed } from '@ta-x-page';
import { GamesRegex } from '@ta-x-site';

import { addAchievementLeaderboardLink } from '../shared';

import { changeToDefaultStatus } from './default-status';
import { individualProgress } from './individual-progress';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.challengesUrl()) {
    return;
  }

  // Picking the default status posts the page back, so the list tasks are left to the page that comes back. They read
  // the whole list, so they wait for it to be parsed
  if (await changeToDefaultStatus()) {
    return;
  }

  await whenParsed();

  // Individual progress applies live, handing back its stop, which nothing here needs
  await allConcurrently<unknown>('Game Challenges', [
    { name: 'game:challenges:individual-progress', task: individualProgress },
    { name: 'game:challenges:achievement-leaderboard-link', task: addAchievementLeaderboardLink }
  ]);
};

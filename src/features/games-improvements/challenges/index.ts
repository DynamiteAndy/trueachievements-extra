import { GamesRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { addAchievementLeaderboardLink } from '../shared';
import { changeToDefaultStatus } from './default-status';
import { individualProgress } from './individual-progress';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.challengesUrl()) {
    return;
  }

  changeToDefaultStatus();

  allConcurrently('Games Challenges', [
    { name: 'games-challenges-individual-progress', task: individualProgress },
    { name: 'games-challenges-achievement-leaderboard-link', task: addAchievementLeaderboardLink }
  ]);
};

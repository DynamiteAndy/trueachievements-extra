import { GamesRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import { addAchievementLeaderboardLink } from '../shared';

import { changeToDefaultStatus } from './default-status';
import { individualProgress } from './individual-progress';

import challenges from '.';

// The default status has its own spec; here it only says whether it posted the page back
vi.mock('./default-status', () => ({ changeToDefaultStatus: vi.fn(async () => false) }));

describeEntry('game/challenges', {
  run: challenges,
  page: () => vi.spyOn(GamesRegex.Test, 'challengesUrl'),
  batch: 'Game Challenges',
  tasks: [
    { name: 'game:challenges:individual-progress', task: individualProgress },
    { name: 'game:challenges:achievement-leaderboard-link', task: addAchievementLeaderboardLink }
  ],
  postsBack: vi.mocked(changeToDefaultStatus),
  parsed: true
});

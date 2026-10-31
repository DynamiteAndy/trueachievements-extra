import { GamesRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import { importGuides } from '../extra-guides';
import { addAchievementLeaderboardLink } from '../shared';

import { collapsibleGroups } from './collapsible-groups';
import { changeToDefaultStatus } from './default-status';
import { individualProgress } from './individual-progress';

import achievements from '.';

// The default status has its own spec; here it only says whether it posted the page back
vi.mock('./default-status', () => ({ changeToDefaultStatus: vi.fn(async () => false) }));

describeEntry('game/achievements', {
  run: achievements,
  page: () => vi.spyOn(GamesRegex.Test, 'achievementsUrl'),
  batch: 'Game Achievements',
  tasks: [
    { name: 'game:achievements:individual-progress', task: individualProgress },
    { name: 'game:achievements:extra-guides', task: importGuides },
    { name: 'game:achievements:achievement-leaderboard-link', task: addAchievementLeaderboardLink },
    { name: 'game:achievements:collapsible-groups', task: collapsibleGroups }
  ],
  postsBack: vi.mocked(changeToDefaultStatus),
  parsed: true
});

import * as taxLib from '@ta-x-lib';
import { GamesRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import { importGuides } from '../extra-guides';
import { addAchievementLeaderboardLink } from '../shared';

import { collapsibleGroups } from './collapsible-groups';
import { changeToDefaultStatus } from './default-status';
import { individualProgress } from './individual-progress';
import { overrideAppliedLive } from './override-applied-live';

import dlc from '.';

// The default status has its own spec; here it only says whether it posted the page back
vi.mock('./default-status', () => ({ changeToDefaultStatus: vi.fn(async () => false) }));

describeEntry('game/dlc', {
  run: dlc,
  page: () => vi.spyOn(GamesRegex.Test, 'dlc'),
  batch: 'Game DLC',
  tasks: [
    { name: 'game:dlc:individual-progress', task: individualProgress },
    { name: 'game:dlc:achievement-leaderboard-link', task: addAchievementLeaderboardLink },
    { name: 'game:dlc:extra-guides', task: importGuides },
    { name: 'game:dlc:collapsible-groups', task: collapsibleGroups },
    { name: 'game:dlc:override-applied-live', task: overrideAppliedLive }
  ],
  postsBack: vi.mocked(changeToDefaultStatus),
  parsed: true
});

describe("game/dlc on one DLC's own page", () => {
  // It has no groups to count or collapse, so neither those nor the override that switches them
  test('starts only the leaderboard link and the guides', async () => {
    vi.spyOn(GamesRegex.Test, 'dlc').mockReturnValue(true);
    vi.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValue(true);
    const spy = vi.spyOn(taxLib, 'allConcurrently').mockResolvedValue([]);

    await dlc();

    expect(spy).toHaveBeenCalledExactlyOnceWith('Game DLC', [
      { name: 'game:dlc:achievement-leaderboard-link', task: addAchievementLeaderboardLink },
      { name: 'game:dlc:extra-guides', task: importGuides }
    ]);
  });
});

import * as taxFetch from '@ta-x-fetch';
import { settings } from '@ta-x-storage';
import { readFixture, setHtml } from '@ta-x-test';

import {
  describeOverrideLive,
  progressHeaders,
  progressOf,
  setOwnProgress,
  start
} from '../shared/individual-progress.spec-helpers';

import { individualProgress } from './individual-progress';

const { achievements, dlc } = settings.game;

describe('game/dlc/individual-progress', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/empty.html');
  });

  // Set to Won, the page lists every achievement won under its group's header, which is all the progress needs: the
  // figures are the full list's (won.html's)
  test('should read a page set to Won as it is, fetching nothing', async () => {
    setHtml('@ta-x-test-views/game-dlc/won-won-status.html', {
      url: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc'
    });
    setOwnProgress('dlc', true);
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');

    await start(individualProgress);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(progressOf(progressHeaders().dlc)).toEqual({
      trueAchievement: '537/775',
      gamerscore: '175/250',
      achievements: '9/10'
    });
  });

  // One row, for this page's own markup: the status filters and none-won lists are the achievements page's table (the
  // same shared code, so the other rows add no coverage)
  test.each([
    {
      view: '@ta-x-test-views/game-dlc/won.html',
      baseGame: { trueAchievement: '1,514', gamerscore: '500', achievements: '20' },
      dlc: { trueAchievement: '537/775', gamerscore: '175/250', achievements: '9/10' }
    }
  ])(
    "should show each header's TrueAchievement score, gamerscore and achievements if enabled",
    async ({ view, baseGame, dlc }) => {
      setHtml(view);

      setOwnProgress('dlc', true);
      const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');
      fetchSpy.mockResolvedValueOnce(new Response(readFixture(view)));

      await start(individualProgress);

      const headers = progressHeaders();
      expect(progressOf(headers.baseGame)).toEqual(baseGame);
      expect(progressOf(headers.dlc)).toEqual(dlc);
    }
  );

  describeOverrideLive('dlc', {
    individualProgress,
    // Every status shown, so it reads the page itself
    open: () =>
      setHtml('@ta-x-test-views/game-dlc/won.html', {
        url: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc'
      }),
    read: () => progressOf(progressHeaders().dlc),
    served: { trueAchievement: '775', gamerscore: '250', achievements: '10' },
    shown: { trueAchievement: '537/775', gamerscore: '175/250', achievements: '9/10' },
    own: dlc.individualProgress,
    override: dlc.overrideAchievementsPageSettings,
    registered: [dlc.individualProgress, achievements.individualProgress]
  });
});

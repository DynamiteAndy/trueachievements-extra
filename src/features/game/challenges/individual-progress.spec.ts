import * as taxFetch from '@ta-x-fetch';
import { GamesRegex } from '@ta-x-site';
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

const { achievements, challenges } = settings.game;

describe('game/challenges/individual-progress', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/empty.html');
  });

  // The page has no All achievements status (only its own All challenges), so it reads the full list from the game's
  // achievements page even with every challenge shown
  test.each([
    {
      view: '@ta-x-test-views/game-challenges/won-with-dlc.html',
      memoizedView: '@ta-x-test-views/game-achievements/elder-scrolls-online-won-with-dlc.html'
    }
  ])("should always read the game's achievements page ($view)", async ({ view, memoizedView }) => {
    setHtml(view, { url: 'https://www.trueachievements.com/game/Sea-of-Thieves/challenges' });

    setOwnProgress('challenges', true);
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');
    fetchSpy.mockResolvedValueOnce(new Response(readFixture(memoizedView || view)));

    await start(individualProgress);

    // The challenges are read from the game's achievements page
    expect(fetchSpy.mock.calls).toEqual([['https://www.trueachievements.com/game/Sea-of-Thieves/achievements']]);
  });

  // A game without DLC: its headers are the game's own (data-gid) and the gamer's, neither one progress is shown in
  test('should not fetch the achievements page when the page has no group headers to show progress in', async () => {
    setHtml('@ta-x-test-views/game-challenges/zoo-tycoon-no-dlc.html', {
      url: 'https://www.trueachievements.com/game/Zoo-Tycoon/challenges'
    });
    setOwnProgress('challenges', true);
    const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');

    await start(individualProgress);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  // One row, for this page's own markup: the status filters and none-won lists are the achievements page's table (the
  // same shared code, so the other rows add no coverage)
  test.each([
    {
      view: '@ta-x-test-views/game-challenges/won-with-dlc.html',
      memoizedView: '@ta-x-test-views/game-achievements/elder-scrolls-online-won-with-dlc.html',
      baseGame: { trueAchievement: '42/6,635', gamerscore: '30/1,000', achievements: '6/45' },
      dlc: null
    }
  ])(
    "should show each header's TrueAchievement score, gamerscore and achievements if enabled",
    async ({ view, memoizedView, baseGame, dlc }) => {
      setHtml(view);

      setOwnProgress('challenges', true);
      vi.spyOn(GamesRegex.Test, 'challengesUrl').mockReturnValueOnce(true);
      const fetchSpy = vi.spyOn(taxFetch, 'fetchOk');
      fetchSpy.mockResolvedValueOnce(new Response(readFixture(memoizedView || view)));

      await start(individualProgress);

      const headers = progressHeaders();
      expect(progressOf(headers.baseGame)).toEqual(baseGame);
      expect(progressOf(headers.dlc)).toEqual(dlc);
    }
  );

  describeOverrideLive('challenges', {
    individualProgress,
    // Not every status shown: the game's achievements page is fetched each time it's turned on
    open: () => {
      setHtml('@ta-x-test-views/game-challenges/none-won-with-dlc.html', {
        url: 'https://www.trueachievements.com/game/Sea-of-Thieves/challenges'
      });
      vi.spyOn(taxFetch, 'fetchOk').mockImplementation(
        async () => new Response(readFixture('@ta-x-test-views/game-challenges/none-won-with-dlc.html'))
      );
    },
    read: () => progressOf(progressHeaders().baseGame),
    served: { trueAchievement: '4,374', gamerscore: '1,000', achievements: '78' },
    shown: { trueAchievement: '0/4,374', gamerscore: '0/1,000', achievements: '0/78' },
    own: challenges.individualProgress,
    override: challenges.overrideAchievementsIndividualProgress,
    registered: [
      challenges.overrideAchievementsIndividualProgress,
      challenges.individualProgress,
      achievements.individualProgress
    ]
  });
});

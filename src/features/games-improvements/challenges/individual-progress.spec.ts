import each from 'jest-each';
import { readFileSync } from 'fs-extra';
import { getPath } from '@ta-x-build-helpers';
import { setHtml, createInnerTextSpies } from '@ta-x-jest';
import { gameChallenges as config, GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import * as taxHelpers from '@ta-x-helpers';
import { individualProgress } from './individual-progress';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

jest.mock('@ta-x-helpers', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-helpers')
  };
});

describe('games-improvements/challenges/individual-progress', () => {
  const getHeaders = () => ({
    baseGame: document.querySelector('.pnl-hd.no-pills.no-pr.game:not(.gamer):not(.dlc)') as HTMLElement,
    dlc: document.querySelector('.pnl-hd.dlc.game:not(.gamer):not([data-gid]), .pnl-hd.dlc') as HTMLElement
  });

  beforeEach(async () => {
    await setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'gameChallengesIndividualProgress', 'get').mockReturnValueOnce(false);
    const allConcurrentlySpy = jest.spyOn(taxUtilities, 'allConcurrently');

    await individualProgress();

    expect(allConcurrentlySpy).not.toHaveBeenCalled();
    allConcurrentlySpy.mockRestore();
  });

  each([
    { view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/no-challenges-won-with-dlc.html' },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html'
    },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html'
    }
  ]).test('should memoize fetch if all challenges status is not selected', async ({ view, memoizedView }) => {
    await setHtml(view);
    createInnerTextSpies();

    jest.spyOn(config, 'gameChallengesIndividualProgress', 'get').mockReturnValueOnce(true);
    jest.spyOn(GamesRegex.Test, 'challengesUrl').mockReturnValueOnce(true);
    const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPath(memoizedView || view)).toString());

    await individualProgress();

    expect(memoizeFetchSpy).toHaveBeenCalled();

    memoizeFetchSpy.mockRestore();
  });

  each([
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/no-challenges-won-with-dlc.html',
      baseExpected: '0/4,374',
      dlcExpected: undefined
    },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '42/6,635',
      dlcExpected: undefined
    },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '42/6,635',
      dlcExpected: undefined
    },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '42/6,635',
      dlcExpected: undefined
    }
  ]).test(
    'should render trueachievement score correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      await setHtml(view);
      createInnerTextSpies();

      jest.spyOn(config, 'gameChallengesIndividualProgress', 'get').mockReturnValueOnce(true);
      jest.spyOn(GamesRegex.Test, 'challengesUrl').mockReturnValueOnce(true);
      const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPath(memoizedView || view)).toString());

      await individualProgress();

      const { baseGame, dlc } = getHeaders();
      const baseGameTrueAchievementScore = (baseGame?.querySelector('[title="Maximum TrueAchievement"]') as HTMLElement)
        ?.innerText;
      const dlcTrueAchievementScore = (dlc?.querySelector('[title="Maximum TrueAchievement"]') as HTMLElement)
        ?.innerText;

      expect(baseGameTrueAchievementScore).toBe(baseExpected);
      expect(dlcTrueAchievementScore).toBe(dlcExpected);

      memoizeFetchSpy.mockRestore();
    }
  );

  each([
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/no-challenges-won-with-dlc.html',
      baseExpected: '0/1,000',
      dlcExpected: undefined
    },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '30/1,000',
      dlcExpected: undefined
    },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '30/1,000',
      dlcExpected: undefined
    },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '30/1,000',
      dlcExpected: undefined
    }
  ]).test(
    'should render gamerscore correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      await setHtml(view);
      createInnerTextSpies();

      jest.spyOn(config, 'gameChallengesIndividualProgress', 'get').mockReturnValueOnce(true);
      jest.spyOn(GamesRegex.Test, 'challengesUrl').mockReturnValueOnce(true);
      const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPath(memoizedView || view)).toString());

      await individualProgress();

      const { baseGame, dlc } = getHeaders();
      const baseGameTrueAchievementScore = (baseGame?.querySelector('[title="Maximum Gamerscore"]') as HTMLElement)
        ?.innerText;
      const dlcTrueAchievementScore = (dlc?.querySelector('[title="Maximum Gamerscore"]') as HTMLElement)?.innerText;

      expect(baseGameTrueAchievementScore).toBe(baseExpected);
      expect(dlcTrueAchievementScore).toBe(dlcExpected);

      memoizeFetchSpy.mockRestore();
    }
  );

  each([
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/no-challenges-won-with-dlc.html',
      baseExpected: '0/78',
      dlcExpected: undefined
    },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '6/45',
      dlcExpected: undefined
    },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '6/45',
      dlcExpected: undefined
    },
    {
      view: '@ta-x-jest-views/games-improvements/challenges/individual-progress/challenges-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/challenges/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '6/45',
      dlcExpected: undefined
    }
  ]).test(
    'should render achievements correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      await setHtml(view);
      createInnerTextSpies();

      jest.spyOn(config, 'gameChallengesIndividualProgress', 'get').mockReturnValueOnce(true);
      jest.spyOn(GamesRegex.Test, 'challengesUrl').mockReturnValueOnce(true);
      const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPath(memoizedView || view)).toString());

      await individualProgress();

      const { baseGame, dlc } = getHeaders();
      const baseGameTrueAchievementScore = (
        baseGame?.querySelector('[title="Maximum achievements"], [title="Maximum Achievements"]') as HTMLElement
      )?.innerText;
      const dlcTrueAchievementScore = (
        dlc?.querySelector('[title="Maximum achievements"], [title="Maximum Achievements"]') as HTMLElement
      )?.innerText;

      expect(baseGameTrueAchievementScore).toBe(baseExpected);
      expect(dlcTrueAchievementScore).toBe(dlcExpected);

      memoizeFetchSpy.mockRestore();
    }
  );
});

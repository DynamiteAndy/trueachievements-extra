import each from 'jest-each';
import { readFileSync } from 'fs-extra';
import { getPath } from '@ta-x-build-helpers';
import { setHtml, createInnerTextSpies } from '@ta-x-jest';
import { gameAchievements as config } from '@ta-x-globals';
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

describe('games-improvements/achievements/individual-progress', () => {
  const getHeaders = () => ({
    baseGame: document.querySelector('.pnl-hd.no-pills.no-pr.game:not(.gamer):not(.dlc)') as HTMLElement,
    dlc: document.querySelector('.pnl-hd.dlc.game:not(.gamer):not([data-gid]), .pnl-hd.dlc') as HTMLElement
  });

  beforeEach(async () => {
    await setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(false);
    const allConcurrentlySpy = jest.spyOn(taxUtilities, 'allConcurrently');

    await individualProgress();

    expect(allConcurrentlySpy).not.toHaveBeenCalled();
    allConcurrentlySpy.mockRestore();
  });

  each([
    { view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/no-achievements-won-no-dlc.html' },
    { view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-no-dlc.html' }
  ]).test.concurrent('should not run if game has no dlc', async ({ view }) => {
    await setHtml(view);

    jest.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(true);
    const allConcurrentlySpy = jest.spyOn(taxUtilities, 'allConcurrently');

    await individualProgress();

    expect(allConcurrentlySpy).not.toHaveBeenCalled();
    allConcurrentlySpy.mockRestore();
  });

  each([
    { view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/no-achievements-won-with-dlc.html' },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView:
        '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView:
        '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html'
    }
  ]).test('should memoize fetch if all achievements status is not selected', async ({ view, memoizedView }) => {
    await setHtml(view);
    createInnerTextSpies();

    jest.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(true);
    const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPath(memoizedView || view)).toString());

    await individualProgress();

    expect(memoizeFetchSpy).toHaveBeenCalled();

    memoizeFetchSpy.mockRestore();
  });

  each([
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: '0/2,611',
      dlcExpected: '0/1,150'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,283/1,590',
      dlcExpected: '376/376'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView:
        '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,283/1,590',
      dlcExpected: '376/376'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView:
        '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,283/1,590',
      dlcExpected: undefined
    }
  ]).test(
    'should render trueachievement score correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      await setHtml(view);
      createInnerTextSpies();

      jest.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(true);
      const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPath(memoizedView || view)).toString());

      await individualProgress();

      const { baseGame, dlc } = getHeaders();
      const baseGameTrueAchievementScore = (baseGame.querySelector('[title="Maximum TrueAchievement"]') as HTMLElement)
        .innerText;
      const dlcTrueAchievementScore = (dlc?.querySelector('[title="Maximum TrueAchievement"]') as HTMLElement)
        ?.innerText;

      expect(baseGameTrueAchievementScore).toBe(baseExpected);
      expect(dlcTrueAchievementScore).toBe(dlcExpected);

      memoizeFetchSpy.mockRestore();
    }
  );

  each([
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: '0/1,000',
      dlcExpected: '0/180'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '930/1,000',
      dlcExpected: '195/195'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView:
        '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '930/1,000',
      dlcExpected: '195/195'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView:
        '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '930/1,000',
      dlcExpected: undefined
    }
  ]).test(
    'should render gamerscore correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      await setHtml(view);
      createInnerTextSpies();

      jest.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(true);
      const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPath(memoizedView || view)).toString());

      await individualProgress();

      const { baseGame, dlc } = getHeaders();
      const baseGameTrueAchievementScore = (baseGame.querySelector('[title="Maximum Gamerscore"]') as HTMLElement)
        .innerText;
      const dlcTrueAchievementScore = (dlc?.querySelector('[title="Maximum Gamerscore"]') as HTMLElement)?.innerText;

      expect(baseGameTrueAchievementScore).toBe(baseExpected);
      expect(dlcTrueAchievementScore).toBe(dlcExpected);

      memoizeFetchSpy.mockRestore();
    }
  );

  each([
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: '0/24',
      dlcExpected: '0/9'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '38/39',
      dlcExpected: '7/7'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView:
        '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '38/39',
      dlcExpected: '7/7'
    },
    {
      view: '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView:
        '@ta-x-jest-views/games-improvements/achievements/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '38/39',
      dlcExpected: undefined
    }
  ]).test(
    'should render achievements correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      await setHtml(view);
      createInnerTextSpies();

      jest.spyOn(config, 'gameAchievementsIndividualProgress', 'get').mockReturnValueOnce(true);
      const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPath(memoizedView || view)).toString());

      await individualProgress();

      const { baseGame, dlc } = getHeaders();
      const baseGameTrueAchievementScore = (
        baseGame.querySelector('[title="Maximum achievements"], [title="Maximum Achievements"]') as HTMLElement
      ).innerText;
      const dlcTrueAchievementScore = (
        dlc?.querySelector('[title="Maximum achievements"], [title="Maximum Achievements"]') as HTMLElement
      )?.innerText;

      expect(baseGameTrueAchievementScore).toBe(baseExpected);
      expect(dlcTrueAchievementScore).toBe(dlcExpected);

      memoizeFetchSpy.mockRestore();
    }
  );
});

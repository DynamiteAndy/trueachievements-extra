import each from 'jest-each';
import { readFileSync } from 'fs-extra';
import { getPathByAlias, setHtml, createInnerTextSpies } from '@ta-x-jest';
import { gameDLC as config, GamesRegex } from '@ta-x-globals';
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

describe('games-improvements/dlc/individual-progress', () => {
  const getHeaders = () => ({
    baseGame: document.querySelector('.pnl-hd.no-pills.no-pr.game:not(.gamer):not(.dlc)') as HTMLElement,
    dlc: document.querySelector('.pnl-hd.dlc.game:not(.gamer):not([data-gid]), .pnl-hd.dlc') as HTMLElement
  });

  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(false);
    const allConcurrentlySpy = jest.spyOn(taxUtilities, 'allConcurrently');

    await individualProgress();

    expect(allConcurrentlySpy).not.toHaveBeenCalled();
    allConcurrentlySpy.mockRestore();
  });

  it('should not run if enabled and not on dlc page', async () => {
    jest.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(true);
    jest.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValueOnce(true);
    const allConcurrentlySpy = jest.spyOn(taxUtilities, 'allConcurrently');

    await individualProgress();

    expect(allConcurrentlySpy).not.toHaveBeenCalled();
    allConcurrentlySpy.mockRestore();
  });

  each([
    { view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/no-achievements-won-with-dlc.html' },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html'
    },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html'
    }
  ]).test('should memoize fetch if all achievements status is not selected', async ({ view, memoizedView }) => {
    setHtml(view);
    createInnerTextSpies();

    jest.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(true);
    jest.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValueOnce(false);
    const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
    memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPathByAlias(memoizedView || view)).toString());

    await individualProgress();

    expect(memoizeFetchSpy).toHaveBeenCalled();

    memoizeFetchSpy.mockRestore();
  });

  each([
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: undefined,
      dlcExpected: '0/424'
    },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,514',
      dlcExpected: '537/775'
    },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,514',
      dlcExpected: '537/775'
    },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '1,514',
      dlcExpected: '537/775'
    }
  ]).test(
    'should render trueachievement score correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      setHtml(view);
      createInnerTextSpies();

      jest.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(true);
      jest.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValueOnce(false);
      const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPathByAlias(memoizedView || view)).toString());

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
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: undefined,
      dlcExpected: '0/240'
    },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '500',
      dlcExpected: '175/250'
    },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '500',
      dlcExpected: '175/250'
    },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '500',
      dlcExpected: '175/250'
    }
  ]).test(
    'should render gamerscore correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      setHtml(view);
      createInnerTextSpies();

      jest.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(true);
      jest.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValueOnce(false);
      const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPathByAlias(memoizedView || view)).toString());

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
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/no-achievements-won-with-dlc.html',
      baseExpected: undefined,
      dlcExpected: '0/10'
    },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '20',
      dlcExpected: '9/10'
    },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '20',
      dlcExpected: '9/10'
    },
    {
      view: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc-not-won-status.html',
      memoizedView: '@ta-x-jest-views/games-improvements/dlc/individual-progress/achievements-won-with-dlc.html',
      baseExpected: '20',
      dlcExpected: '9/10'
    }
  ]).test(
    'should render achievements correctly if enabled',
    async ({ view, memoizedView, baseExpected, dlcExpected }) => {
      setHtml(view);
      createInnerTextSpies();

      jest.spyOn(config, 'gameDLCIndividualProgress', 'get').mockReturnValueOnce(true);
      jest.spyOn(GamesRegex.Test, 'individualDlcUrl').mockReturnValueOnce(false);
      const memoizeFetchSpy = jest.spyOn(taxHelpers, 'memoizeFetch');
      memoizeFetchSpy.mockResolvedValueOnce(readFileSync(getPathByAlias(memoizedView || view)).toString());

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

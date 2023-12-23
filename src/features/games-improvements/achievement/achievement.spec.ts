import { setHtml } from '@ta-x-jest';
import { AchievementsRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import achievement from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('games-improvements/achievement', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on achievement page', async () => {
    jest.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await achievement();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on achievement page', async () => {
    jest.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await achievement();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

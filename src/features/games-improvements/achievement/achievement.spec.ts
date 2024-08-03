import { setHtml } from '@ta-x-test';
import { AchievementsRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import achievement from '.';

vi.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...vi.importActual('@ta-x-utilities'),
    allConcurrently: vi.fn().mockImplementation(() => Promise.resolve())
  };
});

describe('games-improvements/achievement', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on achievement page', async () => {
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await achievement();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on achievement page', async () => {
    vi.spyOn(AchievementsRegex.Test, 'achievementUrl').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await achievement();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

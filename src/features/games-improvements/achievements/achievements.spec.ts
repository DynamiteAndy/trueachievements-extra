import { setHtml } from '@ta-x-test';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import achievements from '.';

vi.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...vi.importActual('@ta-x-utilities'),
    allConcurrently: vi.fn().mockImplementation(() => Promise.resolve())
  };
});

describe('games-improvements/achievements', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on achievements page', async () => {
    vi.spyOn(GamesRegex.Test, 'achievementsUrl').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await achievements();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on achievements page', async () => {
    vi.spyOn(GamesRegex.Test, 'achievementsUrl').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await achievements();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

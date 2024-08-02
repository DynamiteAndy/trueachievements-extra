import { setHtml } from '@ta-x-test';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import challenges from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('games-improvements/challenges', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on challenges page', async () => {
    vi.spyOn(GamesRegex.Test, 'challengesUrl').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await challenges();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on challenges page', async () => {
    vi.spyOn(GamesRegex.Test, 'challengesUrl').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await challenges();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

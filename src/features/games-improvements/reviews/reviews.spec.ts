import { setHtml } from '@ta-x-test';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import reviews from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('games-improvements/reviews', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on reviews page', async () => {
    vi.spyOn(GamesRegex.Test, 'reviewsUrl').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await reviews();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on reviews page', async () => {
    vi.spyOn(GamesRegex.Test, 'reviewsUrl').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await reviews();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

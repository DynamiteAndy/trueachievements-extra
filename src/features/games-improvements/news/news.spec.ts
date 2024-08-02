import { setHtml } from '@ta-x-test';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import news from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('games-improvements/news', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on news page', async () => {
    vi.spyOn(GamesRegex.Test, 'gameUrl').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await news();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on news page', async () => {
    vi.spyOn(GamesRegex.Test, 'gameUrl').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await news();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

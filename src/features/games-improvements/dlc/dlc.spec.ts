import { setHtml } from '@ta-x-test';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import dlc from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('games-improvements/dlc', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on dlc page', async () => {
    vi.spyOn(GamesRegex.Test, 'dlc').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await dlc();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on dlc page', async () => {
    vi.spyOn(GamesRegex.Test, 'dlc').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await dlc();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

import { setHtml } from '@ta-x-test';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import clips from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('games-improvements/clips', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on clips page', async () => {
    vi.spyOn(GamesRegex.Test, 'clipsUrl').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await clips();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on clips page', async () => {
    vi.spyOn(GamesRegex.Test, 'clipsUrl').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await clips();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

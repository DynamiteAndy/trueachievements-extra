import { setHtml } from '@ta-x-test';
import { GamerRegex, gamerImprovements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import gamerImprovements from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('gamer-improvements', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not enabled', async () => {
    vi.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await gamerImprovements();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should not run if enabled and not on a gamer page', async () => {
    vi.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    vi.spyOn(GamerRegex.Test, 'all').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await gamerImprovements();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if enabled and on a gamer page', async () => {
    vi.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    vi.spyOn(GamerRegex.Test, 'all').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await gamerImprovements();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

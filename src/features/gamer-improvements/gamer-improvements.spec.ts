import { setHtml } from '@ta-x-jest';
import { GamerRegex, gamerImprovements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import gamerImprovements from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('gamer-improvements', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await gamerImprovements();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if enabled and not on a gamer page', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(GamerRegex.Test, 'all').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await gamerImprovements();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if enabled and on a gamer page', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(GamerRegex.Test, 'all').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await gamerImprovements();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

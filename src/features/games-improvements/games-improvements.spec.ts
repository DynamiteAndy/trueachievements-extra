import { setHtml } from '@ta-x-jest';
import { gamesImprovements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import gamesImprovements from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('games-improvements', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await gamesImprovements();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if enabled', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await gamesImprovements();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

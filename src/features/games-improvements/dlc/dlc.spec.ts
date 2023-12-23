import { setHtml } from '@ta-x-jest';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import dlc from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('dlc', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on dlc page', async () => {
    jest.spyOn(GamesRegex.Test, 'dlc').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await dlc();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on dlc page', async () => {
    jest.spyOn(GamesRegex.Test, 'dlc').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await dlc();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

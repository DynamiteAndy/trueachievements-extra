import { setHtml } from '@ta-x-jest';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import achievements from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('achievements', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on achievements page', async () => {
    jest.spyOn(GamesRegex.Test, 'achievementsUrl').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await achievements();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on achievements page', async () => {
    jest.spyOn(GamesRegex.Test, 'achievementsUrl').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await achievements();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

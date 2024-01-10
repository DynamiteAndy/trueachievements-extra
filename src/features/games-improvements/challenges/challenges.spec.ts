import { setHtml } from '@ta-x-jest';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import challenges from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('games-improvements/challenges', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on challenges page', async () => {
    jest.spyOn(GamesRegex.Test, 'challengesUrl').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await challenges();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on challenges page', async () => {
    jest.spyOn(GamesRegex.Test, 'challengesUrl').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await challenges();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

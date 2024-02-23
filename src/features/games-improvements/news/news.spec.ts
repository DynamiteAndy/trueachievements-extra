import { setHtml } from '@ta-x-jest';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import news from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('games-improvements/news', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on news page', async () => {
    jest.spyOn(GamesRegex.Test, 'gameUrl').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await news();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on news page', async () => {
    jest.spyOn(GamesRegex.Test, 'gameUrl').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await news();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

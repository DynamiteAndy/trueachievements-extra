import { setHtml } from '@ta-x-jest';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import reviews from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('reviews', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on reviews page', async () => {
    jest.spyOn(GamesRegex.Test, 'reviewsUrl').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await reviews();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on reviews page', async () => {
    jest.spyOn(GamesRegex.Test, 'reviewsUrl').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await reviews();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

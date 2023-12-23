import { setHtml } from '@ta-x-jest';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import clips from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('clips', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on clips page', async () => {
    jest.spyOn(GamesRegex.Test, 'clipsUrl').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await clips();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on clips page', async () => {
    jest.spyOn(GamesRegex.Test, 'clipsUrl').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await clips();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

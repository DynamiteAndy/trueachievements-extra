import { setHtml } from '@ta-x-jest';
import { emojis as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import emojis from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('emojis', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await emojis();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if enabled and no emoji container is found', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await emojis();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

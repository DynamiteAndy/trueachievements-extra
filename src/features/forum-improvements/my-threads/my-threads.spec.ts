import { setHtml } from '@ta-x-jest';
import { ForumRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import myThreads from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('forum-improvements/my-threads', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on my threads page', async () => {
    jest.spyOn(ForumRegex.Test, 'myTheadsUrl').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await myThreads();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on my threads page', async () => {
    jest.spyOn(ForumRegex.Test, 'myTheadsUrl').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await myThreads();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

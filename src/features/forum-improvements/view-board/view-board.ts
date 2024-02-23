import { setHtml } from '@ta-x-jest';
import { ForumRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import viewBoard from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('forum-improvements/view-board', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on view board page', async () => {
    jest.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await viewBoard();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on my view board page', async () => {
    jest.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await viewBoard();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

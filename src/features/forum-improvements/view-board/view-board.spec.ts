import { setHtml } from '@ta-x-test';
import { ForumRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import viewBoard from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('forum-improvements/view-board', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on view board page', async () => {
    vi.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await viewBoard();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on my view board page', async () => {
    vi.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await viewBoard();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

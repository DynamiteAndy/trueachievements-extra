import { setHtml } from '@ta-x-test';
import { ForumRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import myThreads from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('forum-improvements/my-threads', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on my threads page', async () => {
    vi.spyOn(ForumRegex.Test, 'myTheadsUrl').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await myThreads();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on my threads page', async () => {
    vi.spyOn(ForumRegex.Test, 'myTheadsUrl').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await myThreads();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

import { setHtml } from '@ta-x-test';
import { ForumRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import forumImprovements from '.';
import styles from './styles';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('forum-improvements', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on news page', async () => {
    vi.spyOn(ForumRegex.Test, 'all').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await forumImprovements();

    expect(document.body.classList.contains(styles.jsForumImprovements)).toBe(false);
    expect(document.body.classList.contains(styles.forumImprovements)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should not run if on news page and body has not loaded', async () => {
    vi.spyOn(ForumRegex.Test, 'all').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await forumImprovements();

    expect(document.body.classList.contains(styles.jsForumImprovements)).toBe(false);
    expect(document.body.classList.contains(styles.forumImprovements)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on news page and body has loaded', async () => {
    vi.spyOn(ForumRegex.Test, 'all').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await forumImprovements();

    expect(document.body.classList.contains(styles.jsForumImprovements)).toBe(true);
    expect(document.body.classList.contains(styles.forumImprovements)).toBe(true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

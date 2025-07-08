import { setHtml } from '@ta-x-test';
import { GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import forums from '.';
import styles from './styles';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('games-improvements/forums', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on forum', async () => {
    vi.spyOn(GamesRegex.Test, 'forum').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await forums();

    expect(document.body.classList.contains(styles.jsForumImprovements)).toBe(false);
    expect(document.body.classList.contains(styles.forumImprovements)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should not run if on forum and body has not loaded', async () => {
    vi.spyOn(GamesRegex.Test, 'forum').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await forums();

    expect(document.body.classList.contains(styles.jsForumImprovements)).toBe(false);
    expect(document.body.classList.contains(styles.forumImprovements)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on forum and body has loaded', async () => {
    vi.spyOn(GamesRegex.Test, 'forum').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await forums();

    expect(document.body.classList.contains(styles.jsForumImprovements)).toBe(true);
    expect(document.body.classList.contains(styles.forumImprovements)).toBe(true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

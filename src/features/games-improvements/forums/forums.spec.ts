import { setHtml } from '@ta-x-jest';
import { Constants, GamesRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import forums from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('games-improvements/forums', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on forum', async () => {
    jest.spyOn(GamesRegex.Test, 'forum').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await forums();

    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if on forum and body has not loaded', async () => {
    jest.spyOn(GamesRegex.Test, 'forum').mockReturnValueOnce(true);
    jest.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await forums();

    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on forum and body has loaded', async () => {
    jest.spyOn(GamesRegex.Test, 'forum').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await forums();

    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureJs)).toBe(true);
    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureStyle)).toBe(true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

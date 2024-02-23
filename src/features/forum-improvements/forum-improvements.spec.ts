import { setHtml } from '@ta-x-jest';
import { Constants, ForumRegex, forumImprovements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import forumImprovements from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('forum-improvements', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await forumImprovements();

    expect(document.body.classList.contains(Constants.Styles.NewsImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.NewsImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if enabled and not on news page', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(ForumRegex.Test, 'all').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await forumImprovements();

    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if enabled, on news page and body has not loaded', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(ForumRegex.Test, 'all').mockReturnValueOnce(true);
    jest.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await forumImprovements();

    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if enabled, on news page and body has loaded', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(ForumRegex.Test, 'all').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await forumImprovements();

    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureJs)).toBe(true);
    expect(document.body.classList.contains(Constants.Styles.ForumImprovements.featureStyle)).toBe(true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

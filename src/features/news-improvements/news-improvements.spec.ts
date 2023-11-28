import { setHtml } from '@ta-x-jest';
import { Constants, NewsRegex, newsImprovements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import newsImprovements from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('news-improvements', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await newsImprovements();

    expect(document.body.classList.contains(Constants.Styles.NewsImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.NewsImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if enabled and not on news page', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(NewsRegex.Test, 'newsUrl').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await newsImprovements();

    expect(document.body.classList.contains(Constants.Styles.NewsImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.NewsImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if enabled, on news page and body has not loaded', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(NewsRegex.Test, 'newsUrl').mockReturnValueOnce(true);
    jest.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await newsImprovements();

    expect(document.body.classList.contains(Constants.Styles.NewsImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.NewsImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if enabled, on news page and body has loaded', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(NewsRegex.Test, 'newsUrl').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await newsImprovements();

    expect(document.body.classList.contains(Constants.Styles.NewsImprovements.featureJs)).toBe(true);
    expect(document.body.classList.contains(Constants.Styles.NewsImprovements.featureStyle)).toBe(true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

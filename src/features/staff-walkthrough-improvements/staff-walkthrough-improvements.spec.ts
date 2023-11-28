import { setHtml } from '@ta-x-jest';
import { Constants, StaffRegex, staffWalkthroughImprovements as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import staffWalkthroughImprovements from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('staff-walkthrough-improvements', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await staffWalkthroughImprovements();

    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if enabled and not on a staff walkthrough page', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(StaffRegex.Walkthroughs.Test, 'all').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await staffWalkthroughImprovements();

    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if enabled, on a staff walkthrough page and body has not loaded', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(StaffRegex.Walkthroughs.Test, 'all').mockReturnValueOnce(true);
    jest.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await staffWalkthroughImprovements();

    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureStyle)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if enabled, on a staff walkthrough page and body has loaded', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(StaffRegex.Walkthroughs.Test, 'all').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await staffWalkthroughImprovements();

    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureJs)).toBe(true);
    expect(document.body.classList.contains(Constants.Styles.StaffWalkthroughImprovements.featureStyle)).toBe(true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

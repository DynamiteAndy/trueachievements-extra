import { setHtml } from '@ta-x-jest';
import { Constants, stickyHeader as config } from '@ta-x-globals';
import stickyHeader from '.';

describe('sticky-header', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);

    await stickyHeader();

    expect(document.body.classList.contains(Constants.Styles.StickyHeader.featureJs)).toBe(false);
    expect(document.body.classList.contains(Constants.Styles.StickyHeader.featureStyle)).toBe(false);
  });
});

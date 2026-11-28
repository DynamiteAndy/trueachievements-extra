import * as taxPage from '@ta-x-page';
import { StaffRegex } from '@ta-x-site';
import { find, ids, neverFinds, required, setHtml } from '@ta-x-test';

import styles from './styles';

import walkthroughPage from '.';

describe('staff/walkthrough/walkthrough-page', () => {
  const container = (): HTMLElement | null => document.querySelector(`.${styles.walkthroughPageContainer}`);

  const onPage = (on = true): void => {
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'walkthroughPageUrl').mockReturnValue(on);
  };

  test('should not run if not on the walkthrough page', async () => {
    setHtml('@ta-x-test-views/staff-walkthrough-page/page-selected.html');
    onPage(false);

    expect(await walkthroughPage()).toBeUndefined();
    expect(container()).toBeNull();
  });

  test('should wrap the page history and preview in the container', async () => {
    setHtml('@ta-x-test-views/staff-walkthrough-page/page-selected.html');
    onPage();

    onTestFinished(required(await walkthroughPage()));

    await vi.waitFor(() =>
      expect(ids(required(container()))).toEqual(['chWalkthroughPageVersions', 'chWalkthroughPagePreview'])
    );
    expect(required(container()).tagName).toBe('DIV');
    expect(required(container())).toHaveExactClasses([styles.walkthroughPageContainer]);
    expect(ids(find('.admin-page'))).toEqual(['oh1', 'oWarnings', `${styles.walkthroughPageContainer}`]);
    expect(document.querySelectorAll(`.${styles.walkthroughPageContainer}`)).toHaveLength(1);
  });

  test('should wrap only the page history when no page is selected', async () => {
    setHtml('@ta-x-test-views/staff-walkthrough-page/no-page-selected.html');
    onPage();
    neverFinds('#chWalkthroughPagePreview');

    onTestFinished(required(await walkthroughPage()));

    await vi.waitFor(() => expect(container()).not.toBeNull());
    expect(ids(required(container()))).toEqual(['chWalkthroughPageVersions']);
    expect(required(required(container()).previousElementSibling).id).toBe('oWarnings');
  });

  test('should not run without the page history', async () => {
    setHtml('@ta-x-test-views/staff-walkthrough-page/page-selected.html');
    onPage();
    vi.spyOn(taxPage, 'waitForElement').mockResolvedValueOnce(null);

    expect(await walkthroughPage()).toBeUndefined();
    expect(container()).toBeNull();
  });
});

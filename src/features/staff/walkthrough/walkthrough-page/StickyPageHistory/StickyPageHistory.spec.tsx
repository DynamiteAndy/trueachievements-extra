import * as taxPage from '@ta-x-page';
import { StaffRegex } from '@ta-x-site';
import { find, mountForTest, required, setHtml, setSettings } from '@ta-x-test';

import type { MockInstance } from 'vitest';

import walkthroughPage from '..';
import styles from '../styles';

import { StickyPageHistory } from './StickyPageHistory';

// How the page history sticks (and comes unstuck) is stickUnderHeader's own spec: this checks what it's given
describe('staff/walkthrough/walkthrough-page/StickyPageHistory', () => {
  // Rendered into a root of its own, as the walkthrough page controller's child; returns its unmount, which also runs
  // when the test ends
  const setPageHistorySticky = (stickWithin: HTMLElement, history: HTMLElement): (() => void) =>
    mountForTest(<StickyPageHistory container={stickWithin} pageVersions={history} />, document.createElement('div'))
      .unmount;

  const pageVersions = (): HTMLElement => find('#chWalkthroughPageVersions');
  // The feature's container wraps the page history; here the history's own parent stands in for it
  const container = (): HTMLElement | null => pageVersions().parentElement;
  const marked = (): boolean => pageVersions().classList.contains(styles.walkthroughPageStickyPageHistory);

  let stickUnderHeader: MockInstance<typeof taxPage.stickUnderHeader>;

  beforeEach(() => {
    stickUnderHeader = vi.spyOn(taxPage, 'stickUnderHeader');
    setHtml('@ta-x-test-views/staff-walkthrough-page/page-selected.html');
    setSettings({ 'staff.walkthrough.walkthroughPage.stickyPageHistory': true });
  });

  test('should be added by the walkthrough page when enabled, once the history is in its container', async () => {
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'walkthroughPageUrl').mockReturnValue(true);

    onTestFinished(required(await walkthroughPage()));

    await vi.waitFor(() => expect(marked()).toBe(true));
    expect(required(pageVersions().parentElement)).toHaveExactClasses([styles.walkthroughPageContainer]);
    expect(stickUnderHeader).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ container: container() }));
  });

  test('should mark the page history and stick it under the header within its container, 5px down', async () => {
    // The sticky helper the edit page's toolbar uses too, which follows the header as it slides and stops at the
    // container's end
    setPageHistorySticky(required(container()), pageVersions());

    expect(marked()).toBe(true);
    expect(stickUnderHeader).toHaveBeenCalledExactlyOnceWith({
      element: pageVersions(),
      container: container(),
      gap: 5,
      keepHeight: true
    });
  });
});

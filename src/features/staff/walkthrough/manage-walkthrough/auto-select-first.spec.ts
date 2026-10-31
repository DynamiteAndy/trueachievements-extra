import * as taxPage from '@ta-x-page';
import { StaffRegex } from '@ta-x-site';
import { find, neverFinds, setHtml, setSettings } from '@ta-x-test';

import { autoSelectFirst } from './auto-select-first';

describe('staff/walkthrough/manage-walkthrough/auto-select-first', () => {
  const rowLinks = (): HTMLAnchorElement[] => [
    ...document.querySelectorAll<HTMLAnchorElement>('#scrolllstWalkthroughID a')
  ];

  // The selected row is waited for a while: none in these fixtures but the selected one, so no wait
  const noSelectedRowWait = (): void => neverFinds('#lstWalkthroughIDselectedrow');
  // How often each row's link was clicked
  const clickCounts = (clicks: ReturnType<typeof vi.spyOn>[]): number[] =>
    clicks.map((click) => click.mock.calls.length);

  beforeEach(() => {
    setSettings({ 'staff.walkthrough.manageWalkthrough.autoSelectFirst': true });
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'manageWalkthroughUrlWithWalkthroughId').mockReturnValue(false);
  });

  test('should open the first walkthrough when none is selected', async () => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/no-walkthrough-selected.html');
    noSelectedRowWait();
    const clicks = rowLinks().map((link) => vi.spyOn(link, 'click').mockImplementation(() => {}));

    await autoSelectFirst();

    expect(clickCounts(clicks)).toEqual([1, 0]);
  });

  test('should leave a selected walkthrough', async () => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html');
    const clicks = rowLinks().map((link) => vi.spyOn(link, 'click').mockImplementation(() => {}));

    await autoSelectFirst();

    expect(clickCounts(clicks)).toEqual([0, 0, 0]);
  });

  test.each([
    { name: 'while it is off', on: false, onWalkthrough: false },
    { name: 'on a walkthrough', on: true, onWalkthrough: true }
  ])('should open nothing $name', async ({ on, onWalkthrough }) => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/no-walkthrough-selected.html');
    noSelectedRowWait();
    setSettings({ 'staff.walkthrough.manageWalkthrough.autoSelectFirst': on });
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'manageWalkthroughUrlWithWalkthroughId').mockReturnValue(onWalkthrough);
    const clicks = rowLinks().map((link) => vi.spyOn(link, 'click').mockImplementation(() => {}));

    await autoSelectFirst();

    expect(clickCounts(clicks)).toEqual([0, 0]);
  });

  test('should do nothing, without throwing, when the list never shows', async () => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/no-walkthrough-selected.html');
    find('#lstWalkthroughID').remove();
    vi.spyOn(taxPage, 'waitForElement').mockResolvedValue(null);

    await expect(autoSelectFirst()).resolves.toBeUndefined();
  });

  test('should do nothing, without throwing, when the list has rows but no link', async () => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/no-walkthrough-selected.html');
    rowLinks().forEach((link) => link.remove());
    noSelectedRowWait();

    await expect(autoSelectFirst()).resolves.toBeUndefined();
  });
});

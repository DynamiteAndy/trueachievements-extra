import { StaffRegex } from '@ta-x-site';
import { isAppliedLive, settings } from '@ta-x-storage';
import { changeSettingLive, expectAppliesLive, find, ids, required, setHtml, setSettings } from '@ta-x-test';

import styles from './styles';

import walkthroughPage from '.';

// The page's parts that move or mark the site's own markup, run through the feature as the page runs them
describe('staff/walkthrough/walkthrough-page parts', () => {
  const container = (): HTMLElement => find(`.${styles.walkthroughPageContainer}`);
  const historyButtons = (): HTMLElement => find('#chWalkthroughPageVersions .content .buttons');
  const lockNotice = (): HTMLElement => find('.walkthroughlocked');
  const movedIds = ['btnBackToWalkthrough', 'btnEditPage2', 'btnUnlockWalkthroughPage2', 'clearboth'];

  // Runs the feature with just these options on, unmounting it when the test ends. Resolves with its unmount
  const run = async (enabled: Record<string, boolean>): Promise<() => void> => {
    setSettings(
      Object.fromEntries(
        ['moveButtonsToLeft', 'highlightPageLocked', 'walkthroughTeamButton', 'stickyPageHistory'].map((name) => [
          `staff.walkthrough.walkthroughPage.${name}`,
          enabled[name] ?? false
        ])
      )
    );
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'walkthroughPageUrl').mockReturnValue(true);
    const unmount = await walkthroughPage();
    onTestFinished(required(unmount));

    return required(unmount);
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-walkthrough-page/page-locked.html');
  });

  describe('move buttons to left', () => {
    test("should move the preview's edit and unlock buttons into the page history's buttons", async () => {
      await run({ moveButtonsToLeft: true });

      await vi.waitFor(() => expect(ids(historyButtons())).toEqual(movedIds));
      expect(container()).toHaveExactClasses([
        styles.walkthroughPageContainer,
        styles.walkthroughPageMoveButtonsToLeft
      ]);
      // The preview's lower buttons stay where they are
      expect(document.querySelector('#chWalkthroughPagePreview #btnEditPage')).not.toBeNull();
    });

    test('should apply live: on, off and on again from the menu, off giving the page back exactly', async () => {
      await run({});
      await vi.waitFor(() => container());

      // Not expectAppliesLive: turned on, the buttons are looked for then, and found a moment after the change settles
      const { moveButtonsToLeft } = settings.staff.walkthrough.walkthroughPage;
      // Left alone while off
      expect(ids(historyButtons())).toEqual(['btnBackToWalkthrough']);
      expect(container()).toHaveExactClasses([styles.walkthroughPageContainer]);
      const off = document.body.innerHTML;

      await changeSettingLive(moveButtonsToLeft, true);
      await vi.waitFor(() => expect(ids(historyButtons())).toEqual(movedIds));
      const on = document.body.innerHTML;

      await changeSettingLive(moveButtonsToLeft, false);
      expect(document.body.innerHTML).toBe(off);

      await changeSettingLive(moveButtonsToLeft, true);
      expect(document.body.innerHTML).toBe(on);
    });
  });

  describe('sticky page history', () => {
    test('should apply live: on, off and on again from the menu, off giving the page back exactly', async () => {
      await run({});
      await vi.waitFor(() => container());

      // The page itself: sticking sets a variable on <html>, which stays
      await expectAppliesLive(
        settings.staff.walkthrough.walkthroughPage.stickyPageHistory,
        () => find('.admin-page').innerHTML
      );
    });
  });

  describe('highlight page locked', () => {
    test("should make the site's lock notice an information panel", async () => {
      await run({ highlightPageLocked: true });

      await vi.waitFor(() => expect(lockNotice().classList).toContain('informationpanel'));
    });

    test('should apply live: on, off and on again from the menu, off giving the page back exactly', async () => {
      await run({});
      await vi.waitFor(() => container());

      // Not expectAppliesLive: turned on, the notice is looked for then, and found a moment after the change settles
      const { highlightPageLocked } = settings.staff.walkthrough.walkthroughPage;
      // Left alone while off
      expect(lockNotice().classList).not.toContain('informationpanel');
      const off = document.body.innerHTML;

      await changeSettingLive(highlightPageLocked, true);
      await vi.waitFor(() => expect(lockNotice().classList).toContain('informationpanel'));
      const on = document.body.innerHTML;

      await changeSettingLive(highlightPageLocked, false);
      expect(document.body.innerHTML).toBe(off);

      await changeSettingLive(highlightPageLocked, true);
      expect(document.body.innerHTML).toBe(on);
    });

    test('should leave the class on, turned off live or unmounted, when the notice already had it', async () => {
      lockNotice().classList.add('informationpanel');
      const unmount = await run({ highlightPageLocked: true });
      await vi.waitFor(() => container());

      await changeSettingLive(settings.staff.walkthrough.walkthroughPage.highlightPageLocked, false);
      expect(lockNotice().classList).toContain('informationpanel');

      await changeSettingLive(settings.staff.walkthrough.walkthroughPage.highlightPageLocked, true);
      unmount();
      expect(lockNotice().classList).toContain('informationpanel');
    });
  });

  test('should leave every option out of the reload notice while mounted', async () => {
    const { walkthroughTeamButton, highlightPageLocked, moveButtonsToLeft, stickyPageHistory } =
      settings.staff.walkthrough.walkthroughPage;
    const options = [walkthroughTeamButton, highlightPageLocked, moveButtonsToLeft, stickyPageHistory];
    const unmount = await run({});
    await vi.waitFor(() => container());

    expect(options.map(isAppliedLive)).toEqual([true, true, true, true]);

    unmount();

    expect(options.map(isAppliedLive)).toEqual([false, false, false, false]);
  });

  test('should give the page back as it was once unmounted, with every option on', async () => {
    const before = find('.admin-page').innerHTML;
    const unmount = await run({
      moveButtonsToLeft: true,
      highlightPageLocked: true,
      walkthroughTeamButton: true,
      stickyPageHistory: true
    });
    await vi.waitFor(() => expect(document.querySelector('.walkthroughlocked.informationpanel')).not.toBeNull());
    await vi.waitFor(() =>
      expect(container()).toHaveExactClasses([styles.walkthroughPageContainer, styles.walkthroughPageMoveButtonsToLeft])
    );
    unmount();

    // Exactly: no empty class attribute left on a site element that had none (the sticky page history leaves the
    // variable it sets on <html>, outside this)
    expect(find('.admin-page').innerHTML).toBe(before);
  });
});

import { StaffRegex } from '@ta-x-site';
import { settings } from '@ta-x-storage';
import {
  changeSettingLive,
  expectAppliesLive,
  find,
  neverFinds,
  required,
  setHtml,
  setSettings,
  tick
} from '@ta-x-test';

import styles from './styles';

import walkthroughPage from '.';

describe('staff/walkthrough/walkthrough-page team button', () => {
  const historyButtons = (): HTMLElement => find('#chWalkthroughPageVersions .content .buttons');
  const container = (): HTMLElement | null => document.querySelector(`.${styles.walkthroughPageContainer}`);
  const teamButton = (): HTMLAnchorElement | null =>
    document.querySelector('a[href="javascript:Postback(\'btnBackToWalkthrough_click\')"]');

  // The button renders with the container, from the history's buttons as they are then (or once they turn up), so
  // a tick after the container shows, it's there or it isn't
  const run = async (enabled: boolean): Promise<void> => {
    setSettings({ 'staff.walkthrough.walkthroughPage.walkthroughTeamButton': enabled });
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'walkthroughPageUrl').mockReturnValue(true);
    onTestFinished(required(await walkthroughPage()));
    await vi.waitFor(() => expect(container()).not.toBeNull());
  };

  describe('no page selected (an editor, who has no Back to management button)', () => {
    beforeEach(() => {
      setHtml('@ta-x-test-views/staff-walkthrough-page/no-page-selected.html');
    });

    test('should add the button to the page history buttons once', async () => {
      await run(true);

      await vi.waitFor(() => expect(historyButtons().lastElementChild).toBe(teamButton()));
      expect(document.querySelectorAll('#btnBackToWalkthrough')).toHaveLength(1);
    });

    test('should apply live: on, off and on again from the menu, off giving the page back exactly', async () => {
      await run(false);
      await tick();

      await expectAppliesLive(settings.staff.walkthrough.walkthroughPage.walkthroughTeamButton);
      expect(document.querySelectorAll('#btnBackToWalkthrough')).toHaveLength(1);
    });

    test('should not add the button if the page history has no buttons', async () => {
      historyButtons().remove();
      // They never turn up (rather than waiting out the timeout)
      neverFinds('.content .buttons');

      await run(true);
      await tick();

      expect(teamButton()).toBeNull();
    });
  });

  describe("page selected (the author, who has the site's own button)", () => {
    beforeEach(() => {
      setHtml('@ta-x-test-views/staff-walkthrough-page/page-selected.html');
    });

    test('should not add the button if the site already shows one', async () => {
      await run(true);
      await tick();

      expect(teamButton()).toBeNull();
      expect(document.querySelectorAll('#btnBackToWalkthrough')).toHaveLength(1);
      expect(historyButtons().children).toHaveLength(0);
    });

    test("should still leave it out turned on live, the site's own being there", async () => {
      await run(false);
      await tick();
      const before = document.body.innerHTML;

      await changeSettingLive(settings.staff.walkthrough.walkthroughPage.walkthroughTeamButton, true);

      expect(teamButton()).toBeNull();
      expect(document.body.innerHTML).toBe(before);
    });
  });
});

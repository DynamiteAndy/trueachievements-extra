import * as taxPage from '@ta-x-page';
import { StaffRegex } from '@ta-x-site';
import { find, required, setHtml, setSettings } from '@ta-x-test';

import type { MockInstance } from 'vitest';

import { changeToDefaultStatus } from './default-status';

describe('staff/walkthrough/manage-walkthrough/default-status', () => {
  const status = (): HTMLSelectElement => find('#ddlStatusFilter');

  // `on: false`: a status still chosen, with the setting off
  const enable = (value: string, on = true): void =>
    setSettings({
      'staff.walkthrough.manageWalkthrough.defaultStatus': on,
      'staff.walkthrough.manageWalkthrough.defaultStatusValue': value
    });

  let trigger: MockInstance<typeof taxPage.triggerEvent>;

  beforeEach(() => {
    trigger = vi.spyOn(taxPage, 'triggerEvent').mockImplementation(() => true);
    setHtml('@ta-x-test-views/staff-manage-walkthrough/no-walkthrough-selected.html');
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'manageWalkthroughUrlWithWalkthroughId').mockReturnValue(false);
  });

  test('should pick the default status, and post the filter back, when the site has none selected', async () => {
    enable('In progress');

    // It says so, as the page is then on its way out
    await expect(changeToDefaultStatus()).resolves.toBe(true);

    expect(status().value).toBe('In progress');
    expect(trigger).toHaveBeenCalledExactlyOnceWith(status(), 'change');
  });

  test('should leave a status the site has selected', async () => {
    enable('In progress');
    find('[value="Published"]', status()).setAttribute('selected', '');

    await expect(changeToDefaultStatus()).resolves.toBe(false);

    expect(status().value).toBe('Published');
    expect(trigger).not.toHaveBeenCalled();
  });

  test.each([
    { name: 'while it is off', on: false, onWalkthrough: false },
    { name: 'on a walkthrough', on: true, onWalkthrough: true }
  ])('should do nothing $name', async ({ on, onWalkthrough }) => {
    enable('In progress', on);
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'manageWalkthroughUrlWithWalkthroughId').mockReturnValue(onWalkthrough);

    await expect(changeToDefaultStatus()).resolves.toBe(false);

    expect(status().value).toBe('-1');
    expect(trigger).not.toHaveBeenCalled();
  });

  test('should do nothing, without throwing, when the status filter never shows', async () => {
    enable('In progress');
    required(status().parentElement).remove();
    vi.spyOn(taxPage, 'waitForElement').mockResolvedValue(null);

    await expect(changeToDefaultStatus()).resolves.toBe(false);
    expect(trigger).not.toHaveBeenCalled();
  });
});

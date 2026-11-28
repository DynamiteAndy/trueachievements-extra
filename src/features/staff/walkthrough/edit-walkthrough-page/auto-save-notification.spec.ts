import { httpIntercept } from '@ta-x-fetch';
import { isAppliedLive, settings } from '@ta-x-storage';
import { changeSettingLive, setSettings, stubPageFetch } from '@ta-x-test';
import { toastMessage } from '@ta-x-ui';

import { autoSaveNotification } from './auto-save-notification';

describe('staff/walkthrough/edit-walkthrough-page/auto-save-notification', () => {
  const autoSaveUrl = 'https://www.trueachievements.com/ajaxfunctions.aspx/AutoSave';

  // Replaced before the feature registers its listener (which starts the interceptor), so the interceptor wraps the
  // stub rather than the stub replacing it
  const respondWith = (status: number): void => {
    stubPageFetch(async () => new Response('{}', { status }));
  };

  // Runs it, stopping it when the test ends
  const run = (): void => {
    onTestFinished(autoSaveNotification());
  };

  beforeEach(() => {
    setSettings({ 'staff.walkthrough.editWalkthroughPage.autoSaveNotification': true });
  });

  test.each([
    { outcome: 'succeeds', status: 200, message: { text: 'Autosave successful.', type: 'success' } },
    { outcome: 'fails', status: 500, message: { text: 'Autosave failed.', type: 'danger' } }
  ])('should show a toast saying so when an autosave $outcome', async ({ status, message }) => {
    respondWith(status);

    run();
    await fetch(autoSaveUrl, { method: 'POST' });

    expect(toastMessage.value).toEqual(message);
  });

  test('should ignore other requests', async () => {
    respondWith(200);

    run();
    await fetch('https://www.trueachievements.com/ajaxfunctions.aspx/GetGamerHeader', { method: 'POST' });

    expect(toastMessage.value).toBeNull();
  });

  test('should apply live: on, off and on again from the menu, off giving the site its own fetch back', async () => {
    const { autoSaveNotification: setting } = settings.staff.walkthrough.editWalkthroughPage;
    setSettings({ 'staff.walkthrough.editWalkthroughPage.autoSaveNotification': false });
    respondWith(200);
    const sitesFetch = globalThis.fetch;
    run();

    await changeSettingLive(setting, true);
    expect(httpIntercept.intercepting).toBe(true);
    await fetch(autoSaveUrl, { method: 'POST' });
    expect(toastMessage.value).toEqual({ text: 'Autosave successful.', type: 'success' });

    toastMessage.value = null;
    await changeSettingLive(setting, false);
    expect(httpIntercept.intercepting).toBe(false);
    expect(globalThis.fetch).toBe(sitesFetch);
    await fetch(autoSaveUrl, { method: 'POST' });
    expect(toastMessage.value).toBeNull();

    await changeSettingLive(setting, true);
    await fetch(autoSaveUrl, { method: 'POST' });
    expect(toastMessage.value).toEqual({ text: 'Autosave successful.', type: 'success' });
  });

  // Registered, the settings menu's reload notice leaves the setting out (reload-notice.ts)
  test('should stop listening once stopped, registered as applied live until then', async () => {
    const { autoSaveNotification: setting } = settings.staff.walkthrough.editWalkthroughPage;
    respondWith(200);
    const stop = autoSaveNotification();
    expect(httpIntercept.intercepting).toBe(true);
    expect(isAppliedLive(setting)).toBe(true);

    stop();

    expect(httpIntercept.intercepting).toBe(false);
    expect(isAppliedLive(setting)).toBe(false);
  });
});

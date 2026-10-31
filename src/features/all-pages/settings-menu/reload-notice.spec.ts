import { applyLive, settings } from '@ta-x-storage';
import { toastMessage } from '@ta-x-ui';

import { settingsAppliedOnArrival } from '../../game';

import { arrivalNotice, reloadNotice, watchForChanges } from './reload-notice';
import { closeSettingsMenu, settingsMenuOpen } from './settings-menu-open';

describe('all-pages/settings-menu/reload-notice', () => {
  const emojis = settings.allPages.emojis;

  beforeEach(() => {
    watchForChanges(settingsAppliedOnArrival);
  });

  test('says to reload when the menu closes after a setting changed', () => {
    settingsMenuOpen.value = true;
    emojis.value = !emojis.peek();

    expect(toastMessage.value).toBeNull();
    closeSettingsMenu();

    expect(toastMessage.value).toEqual({ text: reloadNotice, type: 'info', timeoutMs: 5000 });
  });

  test('says nothing when nothing changed', () => {
    settingsMenuOpen.value = true;
    closeSettingsMenu();

    expect(toastMessage.value).toBeNull();
  });

  test('says nothing when a change was put back before closing', () => {
    const was = emojis.peek();
    settingsMenuOpen.value = true;
    emojis.value = !was;
    emojis.value = was;
    closeSettingsMenu();

    expect(toastMessage.value).toBeNull();
  });

  test('says nothing for a setting a feature on the page applies live', () => {
    const stopApplyingLive = applyLive(emojis);
    onTestFinished(stopApplyingLive);

    settingsMenuOpen.value = true;
    emojis.value = !emojis.peek();
    closeSettingsMenu();

    expect(toastMessage.value).toBeNull();
  });

  test('says to reload again once the feature no longer applies it live', () => {
    applyLive(emojis)();

    settingsMenuOpen.value = true;
    emojis.value = !emojis.peek();
    closeSettingsMenu();

    expect(toastMessage.value).toEqual({ text: reloadNotice, type: 'info', timeoutMs: 5000 });
  });

  // The default filters apply only when a page is opened afresh: a reload keeps the filter the page is on
  describe('the default filters', () => {
    const { achievements, dlc, forum } = settings.game;
    const change = (...changed: { value: boolean }[]): void => {
      settingsMenuOpen.value = true;
      changed.forEach((setting) => {
        setting.value = !setting.value;
      });
      closeSettingsMenu();
    };

    test.each([
      ['a default status', achievements.defaultStatus],
      ['the default forum tab', forum.defaultThread]
    ])('says %s applies next time the page is opened, not on a reload', (_, setting) => {
      change(setting);

      expect(toastMessage.value).toEqual({ text: arrivalNotice, type: 'info', timeoutMs: 5000 });
    });

    test('says both when another setting changed too', () => {
      change(achievements.defaultStatus, emojis);

      expect(toastMessage.value).toEqual({ text: `${reloadNotice} ${arrivalNotice}`, type: 'info', timeoutMs: 5000 });
    });

    // Its other settings (Individual Progress, Collapsible Groups) apply live, so only its default status is left
    test("says only the default filters' line for DLC's override, which switches the DLC default status", () => {
      change(dlc.overrideAchievementsPageSettings);

      expect(toastMessage.value).toEqual({ text: arrivalNotice, type: 'info', timeoutMs: 5000 });
    });
  });

  test('says it once, however many times the feature started', () => {
    watchForChanges(settingsAppliedOnArrival);
    const show = vi.spyOn(toastMessage, 'value', 'set');

    settingsMenuOpen.value = true;
    emojis.value = !emojis.peek();
    closeSettingsMenu();

    expect(show).toHaveBeenCalledExactlyOnceWith({ text: reloadNotice, type: 'info', timeoutMs: 5000 });
  });
});

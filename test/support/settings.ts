import { isAppliedLive, settingsList } from '@ta-x-storage';
import { act } from 'preact/test-utils';

import type { Setting } from '@ta-x-storage';
import type { VNode } from 'preact';

import { find, required } from './elements';
import { mountInPage, renderFragment } from './render';
import { tick } from './timers';

// Every setting's value, by path, to see which one a change touched
const values = (): Record<string, string> =>
  Object.fromEntries(settingsList().map(({ path, setting }) => [path, JSON.stringify(setting.peek())]));

const changedSetting = (before: Record<string, string>): string => {
  const after = values();
  const changed = Object.keys(after).filter((path) => after[path] !== before[path]);
  expect(changed).toHaveLength(1);

  return changed[0];
};

const settingAt = (path: string) => {
  const entry = settingsList().find((candidate) => candidate.path === path);
  if (!entry) {
    throw new Error(`No setting at ${path}`);
  }

  return entry.setting;
};

const restore = (path: string, before: Record<string, string>): void => {
  const setting = settingAt(path);
  // Not awaited: act() renders a synchronous callback's result before it returns (its promise is already resolved),
  // so the settings helpers stay synchronous for getSettings, which reads the result at once
  void act(() => {
    setting.value = JSON.parse(before[path]);
  });
};

// Changes a checkbox or select the way a user does, letting Preact render the result
export const changeSetting = (element: HTMLInputElement | HTMLSelectElement, value: boolean | string): void => {
  void act(() => {
    if (element instanceof HTMLInputElement && element.type === 'checkbox') {
      element.checked = value as boolean;
    } else {
      element.value = value as string;
    }

    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
};

// The settings a panel shows, in order, as [id, the setting it saves to]: the checkboxes and selects by their id, a
// list by its <ul>. Found by changing each control as a user would and seeing which setting changed (then putting it
// back), so it checks each row really saves where it should. Rows hidden by the current settings aren't there
export const getSettings = (vnode: VNode): [string, string][] => {
  const { container } = mountInPage(vnode);
  // By id, found again for each: changing a setting another row depends on re-mounts that row
  const ids = [...container.querySelectorAll<HTMLElement>('input[type="checkbox"], select, ul.item-list')].map(
    (control) => control.id
  );

  const bindings = ids.map((id): [string, string] => {
    const control = find(`#${id}`, container);
    const before = values();

    if (control instanceof HTMLInputElement) {
      changeSetting(control, !control.checked);
    } else if (control instanceof HTMLSelectElement) {
      const other = [...control.options].find((option) => option.value !== control.value);
      if (!other) {
        throw new Error(`#${id} has no other option to change to`);
      }
      changeSetting(control, other.value);
    } else {
      const field = find<HTMLInputElement>(`#${control.id}-input`, container);
      void act(() => {
        field.value = 'a keyword';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      void act(() => {
        find<HTMLInputElement>('input[type="submit"]', field.parentElement ?? container).click();
      });
    }

    const path = changedSetting(before);
    restore(path, before);

    return [control.id, path];
  });

  // Off the page at once, so later queries don't find it; unmounted when the test ends
  container.remove();

  return bindings;
};

// A settings panel's accordions by title, each checked to be followed by its content
export const getAccordions = (vnode: VNode): string[] =>
  [...renderFragment(vnode).querySelectorAll('.ta-x-accordion')].map((header) => {
    expect(required(header.nextElementSibling).classList).toContain('ta-x-accordion-content');

    return header.textContent;
  });

// Sets settings by path before a test (storage is reset between tests), e.g. an override on so its rows show
export const setSettings = (values: Record<string, unknown>): void => {
  Object.entries(values).forEach(([path, value]) => {
    const setting = settingAt(path);
    void act(() => {
      setting.value = value;
    });
  });
};

// The ids of the settings a panel shows, in order
export const shownSettings = (vnode: VNode): string[] => getSettings(vnode).map(([id]) => id);

// A setting changed with the page open, the way the menu changes it: inside act, so components re-render and their
// effects (and whileSetting's) run before the test goes on
export const changeSettingLive = async <T>(setting: Setting<T>, value: T): Promise<void> => {
  await act(async () => {
    setting.value = value;
    // A feature applying it may wait for an element first (its wait settles in a later task)
    await tick();
  });
};

// For a feature applied live (writing-specs.md, "Settings that apply live"): with it started and its setting off,
// turns the setting on, off and on again. Off puts the page back exactly as it was; on again matches the first time.
// `page` is what to compare (the whole body by default). The setting is registered as applied live too, so the reload
// notice leaves it out
export const expectAppliesLive = async (
  setting: Setting<boolean>,
  page: () => string = () => document.body.innerHTML
): Promise<void> => {
  expect(isAppliedLive(setting)).toBe(true);
  const off = page();

  await changeSettingLive(setting, true);
  const on = page();
  expect(on).not.toBe(off);

  await changeSettingLive(setting, false);
  expect(page()).toBe(off);

  await changeSettingLive(setting, true);
  expect(page()).toBe(on);
};

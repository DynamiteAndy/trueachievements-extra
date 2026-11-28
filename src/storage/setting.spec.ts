import { effect } from '@preact/signals';
import { logger } from '@ta-x-lib';

import { reloadSettings, setting } from './setting';

describe('storage/setting', () => {
  // Each test's settings get their own keys, so they don't meet the app's settings
  let id = 0;
  const key = (): string => `test-setting-${(id += 1)}`;

  test("starts from its stored value, or its default when there's none", () => {
    const stored = key();
    GM_setValue(stored, true);

    expect(setting(stored, false, 'boolean').value).toBe(true);
    expect(setting(key(), false, 'boolean').value).toBe(false);
    expect(setting(key(), 'asc', 'string').value).toBe('asc');
    expect(setting(key(), null, 'nullable').value).toBeNull();
  });

  test('keeps a list as a JSON string', () => {
    const list = key();
    GM_setValue(list, '["game","product"]');

    expect(setting(list, ['product'], 'list').value).toEqual(['game', 'product']);
    expect(setting(key(), ['product', 'game'], 'list').value).toEqual(['product', 'game']);

    const saved = setting(key(), [], 'list');
    saved.value = ['a', 'b'];
    expect(GM_getValue(saved.key)).toBe('["a","b"]');
  });

  test.each([
    ['not JSON', '["game",', 1],
    ['not a list', '{"game":true}', 0],
    ['not a list of strings', '[1,2]', 0]
  ])("starts from its default when a stored list is %s, and says so if it can't be read", (_, stored, warns) => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const list = key();
    GM_setValue(list, stored);

    expect(setting(list, ['product'], 'list').value).toEqual(['product']);
    expect(warn).toHaveBeenCalledTimes(warns);
  });

  test('follows a bad list from another tab as its default', () => {
    vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const list = setting(key(), ['product'], 'list');
    list.value = ['game'];

    GM_setValue(list.key, 'not json');

    expect(list.value).toEqual(['product']);
  });

  test('saves a new value under its key', () => {
    const saved = setting(key(), false, 'boolean');

    saved.value = true;

    expect(GM_getValue(saved.key)).toBe(true);
  });

  test("doesn't write when it's created or read", () => {
    const write = vi.spyOn(globalThis, 'GM_setValue');

    const read = setting(key(), 'Gamer', 'string');
    expect(read.value).toBe('Gamer');
    expect(read.peek()).toBe('Gamer');

    expect(write).not.toHaveBeenCalled();
  });

  test('follows a change made elsewhere (another tab), without writing it back', () => {
    const followed = setting(key(), false, 'boolean');
    const list = setting(key(), [], 'list');

    GM_setValue(followed.key, true);
    GM_setValue(list.key, '["keyword"]');

    expect(followed.value).toBe(true);
    expect(list.value).toEqual(['keyword']);

    const write = vi.spyOn(globalThis, 'GM_setValue');
    GM_setValue(followed.key, true);
    // Only the call above: the unchanged value isn't saved again
    expect(write).toHaveBeenCalledExactlyOnceWith(followed.key, true);
  });

  test('still saves its later changes after an effect threw on a change made elsewhere', () => {
    const followed = setting(key(), false, 'boolean');
    onTestFinished(
      effect(() => {
        if (followed.value) {
          throw new Error('effect failed');
        }
      })
    );
    expect(() => GM_setValue(followed.key, true)).toThrow('effect failed');

    followed.value = false;

    expect(GM_getValue(followed.key)).toBe(false);
  });

  test('goes back to its default when its stored value is cleared elsewhere', () => {
    const removed = setting(key(), 'all', 'string');
    removed.value = 'mine';

    GM_setValue(removed.key, null);

    expect(removed.value).toBe('all');
  });

  test('reads its stored value again, and listens again, when reloaded (tests clear storage between tests)', () => {
    const reloaded = setting(key(), false, 'boolean');
    localStorage.setItem(reloaded.key, 'true');
    expect(reloaded.value).toBe(false);

    reloadSettings();
    expect(reloaded.value).toBe(true);

    GM_setValue(reloaded.key, false);
    expect(reloaded.value).toBe(false);
  });
});

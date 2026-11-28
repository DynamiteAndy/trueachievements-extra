import { logger } from '@ta-x-lib';

import { stored } from './stored';

describe('storage/stored', () => {
  const value = stored<[string, string[]][]>('ta-x-test-stored', []);

  test('should read the default while the key is not stored', () => {
    expect(value.key).toBe('ta-x-test-stored');
    expect(value.get()).toEqual([]);
  });

  test('should save the value as JSON under its key, and read it back', () => {
    value.set([['GForce', ['https://www.xboxachievements.com/game/gforce/guide/']]]);

    expect(GM_getValue('ta-x-test-stored')).toBe(
      '[["GForce",["https://www.xboxachievements.com/game/gforce/guide/"]]]'
    );
    expect(value.get()).toEqual([['GForce', ['https://www.xboxachievements.com/game/gforce/guide/']]]);
  });

  test("should read a stored value that isn't JSON as the default, and say so", () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    GM_setValue('ta-x-test-stored', '[["GForce",');

    expect(value.get()).toEqual([]);
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      'storage',
      `"ta-x-test-stored" isn't valid JSON, so its default is used`,
      expect.any(SyntaxError)
    );
  });

  test('should delete its key, and only its key', () => {
    GM_setValue('ta-x-test-other', 'kept');
    value.set([['GForce', []]]);

    value.delete();

    expect(GM_listValues()).toEqual(['ta-x-test-other']);
    expect(value.get()).toEqual([]);
  });
});

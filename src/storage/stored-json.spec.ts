import { logger } from '@ta-x-lib';

import { readEntries } from './stored-json';

describe('readEntries', () => {
  test('should read a list of entries', () => {
    expect(readEntries('key', '[["game",["link"]]]')).toEqual([['game', ['link']]]);
  });

  test('should read a key not stored as no entries, without a warning', () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});

    expect(readEntries('key', '')).toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });

  test.each([{ value: '{}' }, { value: '[1,2]' }])(
    'should warn about JSON that is not a list of entries ($value), and read it as none',
    ({ value }) => {
      const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});

      expect(readEntries('key', value)).toBeNull();
      expect(warn).toHaveBeenCalledExactlyOnceWith('storage', `"key" isn't a list of entries, so it's read as empty`);
    }
  );
});

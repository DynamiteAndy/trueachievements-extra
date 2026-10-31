import { logger } from '@ta-x-lib';
import { useFakeTimers } from '@ta-x-test';

import { carryOverToIndexedDb } from './carry-over';
import { IndexedDbService } from './indexed-db';

const legacyKey = 'carry-over-check';
const day = 24 * 60 * 60 * 1000;

// Entries whose value is a string carried over as they are; any other value left behind
const toEntries = ([key, value]: [string, unknown]): [string, string][] =>
  typeof value === 'string' ? [[key, value]] : [];

const legacy = (entries: [string, unknown][]): void => GM_setValue(legacyKey, JSON.stringify(entries));

describe('carryOverToIndexedDb', () => {
  let store: IndexedDbService<string>;
  let carried: ReturnType<typeof carryOverToIndexedDb<string>>;

  beforeEach(() => {
    // A database of its own for each test
    store = new IndexedDbService<string>(`test-db-${crypto.randomUUID()}`, 'entries');
    carried = carryOverToIndexedDb(legacyKey, store, toEntries, { value: 90, period: 'days' });
  });

  test('should copy every entry into the store, then delete the old key', async () => {
    legacy([
      ['a', 'first'],
      ['b', 'second']
    ]);

    await carried.carryOver();

    expect([await store.get('a'), await store.get('b')]).toEqual(['first', 'second']);
    expect(GM_listValues()).toEqual([]);
  });

  test('should keep each carried-over entry for its time from the carry-over', async () => {
    useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-21T12:00:00Z') });
    legacy([['a', 'first']]);
    await carried.carryOver();

    vi.setSystemTime(Date.now() + 89 * day);
    expect(await store.get('a')).toBe('first');
    vi.setSystemTime(Date.now() + 2 * day);
    expect(await store.get('a')).toBeNull();
  });

  test('should do nothing when there is no old key', async () => {
    const set = vi.spyOn(store, 'set');

    await carried.carryOver();

    expect(set).not.toHaveBeenCalled();
  });

  test('should never replace an entry already in the store, which is newer', async () => {
    await store.set('a', 'newer');
    legacy([['a', 'older']]);

    await carried.carryOver();

    expect(await store.get('a')).toBe('newer');
  });

  test('should leave out an entry toEntries gives nothing for, carrying over the rest', async () => {
    legacy([
      ['a', 'first'],
      ['b', 42]
    ]);

    await carried.carryOver();

    expect([await store.get('a'), await store.get('b')]).toEqual(['first', null]);
  });

  test('should keep the old key when the store fails part way, so the next run tries again', async () => {
    legacy([['a', 'first']]);
    vi.spyOn(store, 'set').mockRejectedValueOnce(new Error('blocked'));

    await expect(carried.carryOver()).rejects.toThrow('blocked');

    expect(GM_getValue(legacyKey)).toBe(JSON.stringify([['a', 'first']]));
    await carried.carryOver();
    expect(await store.get('a')).toBe('first');
  });

  test("should log an old value that isn't JSON and delete it, as it can never be read", async () => {
    GM_setValue(legacyKey, '[["a","fir');
    const warn = vi.spyOn(logger, 'warn');

    await expect(carried.carryOver()).resolves.toBeUndefined();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
      'storage',
      `"${legacyKey}" isn't valid JSON, so its default is used`,
      expect.any(SyntaxError)
    );
    expect(GM_listValues()).toEqual([]);
  });

  test('should run once at a time, however many ask', async () => {
    legacy([['a', 'first']]);
    const set = vi.spyOn(store, 'set');

    await Promise.all([carried.carryOver(), carried.carryOver(), carried.get('a')]);

    expect(set).toHaveBeenCalledExactlyOnceWith('a', 'first', expect.any(Date));
  });

  test('should run again once a run has ended', async () => {
    legacy([['a', 'first']]);
    await carried.carryOver();
    legacy([['b', 'second']]);

    await carried.carryOver();

    expect(await store.get('b')).toBe('second');
  });

  describe('reads and writes', () => {
    test('should wait for the carry-over, so an early read still finds an old entry', async () => {
      legacy([['a', 'first']]);

      expect(await carried.get('a')).toBe('first');
    });

    test('should keep what is remembered for its time, and remembering it again keeps it that long again', async () => {
      useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-21T12:00:00Z') });
      await carried.remember([
        ['a', 'first'],
        ['b', 'second']
      ]);

      vi.setSystemTime(Date.now() + 60 * day);
      await carried.remember([['b', 'second']]);
      vi.setSystemTime(Date.now() + 31 * day);

      expect([await carried.get('a'), await carried.get('b')]).toEqual([null, 'second']);
    });

    // The carry-over reads the store before copying an entry: a link remembered in between would be written over by the
    // old one
    test('should wait for a carry-over under way, so what is remembered meanwhile is kept over the old entry', async () => {
      legacy([['a', 'old']]);

      const carrying = carried.carryOver();
      await carried.remember([['a', 'new']]);
      await carrying;

      expect(await store.get('a')).toBe('new');
    });

    test('should still remember an entry after a carry-over that failed', async () => {
      legacy([['a', 'first']]);
      vi.spyOn(store, 'get').mockRejectedValueOnce(new Error('blocked'));

      await carried.remember([['b', 'second']]);

      expect(await store.get('b')).toBe('second');
    });

    test("should read as none when the store can't be read, and not throw when it can't be written", async () => {
      legacy([['a', 'first']]);
      vi.spyOn(store, 'get').mockRejectedValue(new Error('blocked'));
      vi.spyOn(store, 'set').mockRejectedValue(new Error('blocked'));

      expect(await carried.get('a')).toBeNull();
      await expect(carried.remember([['a', 'second']])).resolves.toBeUndefined();
      expect(GM_getValue(legacyKey)).toBe(JSON.stringify([['a', 'first']]));
    });
  });
});

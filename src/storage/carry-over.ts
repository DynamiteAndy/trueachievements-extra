import { type Duration, fromNow } from '@ta-x-lib';

import { readEntries } from './stored-json';

import type { IndexedDbService } from './indexed-db';

// A store carried over from a map once kept in Tampermonkey storage: the carry-over, and reads and writes that wait
// for it
interface CarriedOverStore<T> {
  carryOver: () => Promise<void>;
  get: (key: string) => Promise<T | null>;
  remember: (entries: [string, T][]) => Promise<void>;
}

// Moving a map kept in Tampermonkey storage (JSON entries) into an IndexedDB store, which can't be a migration, as
// those are synchronous. `toEntries` turns each old entry into the store's (none for one it can't read), each kept for
// `keepFor` from when it was last saved.
// - The carry-over copies each entry unless the store already has one (which is newer), then deletes the old key. A
//   failure part way keeps the key, so the next page tries again. Started by the maintenance task; one run at a time.
// - An old value that isn't a list of entries (edited by hand, or cut off) is logged and read as empty: the key goes,
//   as it can never be read.
// - A read or write waits for the carry-over, so a page that reads early still finds the old entries. A store that
//   can't be read just means looking the entry up again (null), and one that can't be written just means not
//   keeping it.
export const carryOverToIndexedDb = <T>(
  legacyKey: string,
  store: IndexedDbService<T>,
  toEntries: (entry: [string, unknown]) => [string, T][],
  keepFor: Duration
): CarriedOverStore<T> => {
  let carrying: Promise<void> | null = null;

  const carryOver = (): Promise<void> => {
    carrying ??= (async () => {
      const stored: unknown = GM_getValue(legacyKey, '');
      if (stored === '') {
        return;
      }

      for (const [key, value] of (readEntries(legacyKey, stored) ?? []).flatMap(toEntries)) {
        if ((await store.get(key)) === null) {
          await store.set(key, value, fromNow(keepFor));
        }
      }

      GM_deleteValue(legacyKey);
    })().finally(() => {
      carrying = null;
    });

    return carrying;
  };

  return {
    carryOver,
    get: async (key) => {
      await carryOver().catch(() => undefined);

      return store.get(key).catch(() => null);
    },
    remember: async (entries) => {
      await carryOver().catch(() => undefined);
      await Promise.all(entries.map(([key, value]) => store.set(key, value, fromNow(keepFor)).catch(() => undefined)));
    }
  };
};

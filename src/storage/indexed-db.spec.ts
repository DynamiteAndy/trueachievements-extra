import { useFakeTimers } from '@ta-x-test';

import { IndexedDbService } from './indexed-db';

// A database of its own for each test
const dbName = (): string => `test-db-${crypto.randomUUID()}`;

describe('IndexedDbService', () => {
  let service: IndexedDbService<string>;

  beforeEach(() => {
    service = new IndexedDbService<string>(dbName(), 'entries');
  });

  test('set then get round-trips a value', async () => {
    await service.set('key', 'value');

    expect(await service.get('key')).toBe('value');
  });

  test('get returns null and deletes the record once expiresAt has passed', async () => {
    await service.set('key', 'value', new Date(Date.now() - 1000));

    expect(await service.get('key')).toBeNull();
    // Gone from the store, not just filtered on read: keys lists expired records too
    expect(await service.keys()).toEqual([]);
  });

  test('keys lists every key, expired ones too', async () => {
    await service.set('fresh', 'value');
    await service.set('expired', 'value', new Date(Date.now() - 1000));

    expect((await service.keys()).sort()).toEqual(['expired', 'fresh']);
  });

  test('delete removes a key', async () => {
    await service.set('key', 'value');
    await service.delete('key');

    expect(await service.get('key')).toBeNull();
  });

  describe('several stores in one database', () => {
    test('gives each service its own store, even when they share a database', async () => {
      const name = dbName();
      const games = new IndexedDbService<string>(name, 'games');
      const gamers = new IndexedDbService<string>(name, 'gamers');

      await games.set('key', 'a game');
      await gamers.set('key', 'a gamer');

      expect(await games.get('key')).toBe('a game');
      expect(await gamers.get('key')).toBe('a gamer');
    });

    test('adds a store to a database that already exists, keeping the stores it had', async () => {
      const name = dbName();
      const games = new IndexedDbService<string>(name, 'games');
      await games.set('key', 'a game');

      // A later feature (or a later version of the script) adds its own store to the same database
      const gamers = new IndexedDbService<string>(name, 'gamers');
      await gamers.set('key', 'a gamer');

      expect(await gamers.get('key')).toBe('a gamer');
      expect(await games.get('key')).toBe('a game');
      expect(await new IndexedDbService<string>(name, 'games').get('key')).toBe('a game');
    });

    test('opens stores in one database at the same time', async () => {
      const name = dbName();
      const services = ['one', 'two', 'three'].map((store) => new IndexedDbService<string>(name, store));

      await Promise.all(services.map((service, index) => service.set('key', `value ${index}`)));

      expect(await Promise.all(services.map((service) => service.get('key')))).toEqual([
        'value 0',
        'value 1',
        'value 2'
      ]);
    });

    test('looks again when another connection took the version it was adding its store at (a VersionError)', async () => {
      const name = dbName();
      // The database is there, at version 1, without the service's store
      await new Promise<void>((resolve) => {
        const request = indexedDB.open(name, 1);
        request.onsuccess = () => {
          request.result.close();
          resolve();
        };
      });
      const gamers = new IndexedDbService<string>(name, 'gamers');

      // Queued behind the service's first open, so it runs once that connection closes to add its store (at version 2):
      // another connection (another tab, or a later build) takes the database to version 3 first
      const set = gamers.set('key', 'a gamer');
      const versions: number[] = [];
      await new Promise<void>((resolve) => {
        const request = indexedDB.open(name, 3);
        request.onupgradeneeded = (event) => versions.push(event.oldVersion);
        request.onsuccess = () => {
          request.result.close();
          resolve();
        };
      });
      await set;

      // It upgraded from 1 to 3 in between: the service's version 2 was taken
      expect(versions).toEqual([1]);
      expect(await gamers.get('key')).toBe('a gamer');
    });
  });

  test('tries opening the database again after a failed open', async () => {
    vi.spyOn(indexedDB, 'open').mockImplementationOnce(() => {
      throw new Error('open failed');
    });

    await expect(service.get('key')).rejects.toThrow('open failed');

    await service.set('key', 'value');
    expect(await service.get('key')).toBe('value');
  });

  describe('an open that another connection holds up', () => {
    // Another connection to the database that doesn't close when asked to, as a tab running an older build could do.
    // It holds `version` open with the store `stores` has
    const holdOpen = async (name: string, version: number, stores: string[]): Promise<IDBDatabase> =>
      new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);
        request.onupgradeneeded = () => stores.forEach((store) => request.result.createObjectStore(store));
        request.onsuccess = () => {
          // Closed when the test ends too, whatever happens in it: left open, it blocks the next upgrade
          onTestFinished(() => request.result.close());
          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      });

    // Resolves once a plain open of `name` at `version` succeeds, i.e. nothing is holding the database any more
    const openAt = async (name: string, version: number | undefined): Promise<IDBDatabase> =>
      new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error('blocked'));
      });

    test("should reject, not hang, when adding its store is blocked by a connection that won't close", async () => {
      const name = dbName();
      // A connection that won't close (until the test ends)
      await holdOpen(name, 1, ['other']);
      const blocked = new IndexedDbService<string>(name, 'entries', 1000);

      await expect(blocked.get('key')).rejects.toThrow(/blocked/);
    });

    test("should fail at once for a while after a held-up open, so each call doesn't wait again", async () => {
      // memoizeFetch reads, then writes: without it, each would pay the time limit
      const name = dbName();
      await holdOpen(name, 1, ['other']);
      const heldUp = new IndexedDbService<string>(name, 'entries', 1000, 60_000);
      await expect(heldUp.get('key')).rejects.toThrow(/blocked/);
      const open = vi.spyOn(indexedDB, 'open');

      await expect(heldUp.set('key', 'value')).rejects.toThrow(/held up/);

      expect(open).not.toHaveBeenCalled();
    });

    test('should let another connection upgrade the database (versionchange), and open again on its next use', async () => {
      // As another tab running a newer build would: its open at a higher version waits for every other connection to
      // close, so it's blocked unless the service closes on versionchange
      const name = dbName();
      const service = new IndexedDbService<string>(name, 'entries', 1000);
      await service.set('key', 'value');
      const current = await openAt(name, undefined);
      const { version } = current;
      current.close();

      const upgraded = await openAt(name, version + 1);
      upgraded.close();

      expect(await service.get('key')).toBe('value');
    });

    test('should reject once its time limit passes when its open waits behind a blocked upgrade', async () => {
      const name = dbName();
      const blocker = await holdOpen(name, 1, ['entries']);
      // Someone else's upgrade, stuck behind the blocker; a plain open queues behind it
      const upgrade = indexedDB.open(name, 2);
      upgrade.onerror = () => undefined;
      const queued = new IndexedDbService<string>(name, 'entries', 100);

      await expect(queued.get('key')).rejects.toThrow(/100 ms/);

      blocker.close();
      await new Promise((resolve) => (upgrade.onsuccess = () => resolve(upgrade.result.close())));
    });

    test('should close a connection that opens after it gave up, and work once the blocker goes', async () => {
      const name = dbName();
      const blocker = await holdOpen(name, 1, ['other']);
      // (trying again straight away, not after the usual wait)
      const late = new IndexedDbService<string>(name, 'entries', 1000, 0);
      await expect(late.set('key', 'value')).rejects.toThrow(/blocked/);

      blocker.close();
      // Its given-up upgrade (to version 2, adding its store) goes ahead now; left open, its connection would block
      // this next upgrade (fake timers can't be used with fake-indexeddb, so its result is waited for instead)
      await vi.waitFor(async () =>
        expect((await indexedDB.databases()).find((database) => database.name === name)?.version).toBe(2)
      );
      const next = await openAt(name, 3);
      expect(next.objectStoreNames.contains('entries')).toBe(true);
      next.close();

      await late.set('key', 'value');
      expect(await late.get('key')).toBe('value');
    });
  });

  test('clear removes every record', async () => {
    await service.set('expired', 'gone', new Date(Date.now() - 1000));
    await service.set('fresh', 'kept', new Date(Date.now() + 100_000));
    await service.set('no-expiry', 'kept-forever');

    await service.clear();

    expect(await service.keys()).toEqual([]);
  });

  test('clearExpired removes only expired records', async () => {
    // Two expired, so a sweep that stops at the first is caught
    await service.set('expired', 'gone', new Date(Date.now() - 1000));
    await service.set('fresh', 'kept', new Date(Date.now() + 100_000));
    await service.set('expired-too', 'gone', new Date(Date.now() - 2000));
    await service.set('no-expiry', 'kept-forever');

    await service.clearExpired();

    // Read through keys, as get drops an expired record itself
    expect((await service.keys()).sort()).toEqual(['fresh', 'no-expiry']);
    expect(await service.get('fresh')).toBe('kept');
    expect(await service.get('no-expiry')).toBe('kept-forever');
  });

  // The request succeeds before the transaction commits, so a write only counts once the transaction completes
  test.each([
    { write: 'set', run: (store: IndexedDbService<string>) => store.set('key', 'after') },
    { write: 'replace', run: (store: IndexedDbService<string>) => store.replace('key', 'after') }
  ])('$write rejects, keeping nothing, when its transaction aborts after the write succeeded', async ({ run }) => {
    await service.set('key', 'before');
    vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementationOnce(function (
      this: IDBObjectStore,
      ...args: Parameters<IDBObjectStore['put']>
    ) {
      const request = this.put(...args);
      request.addEventListener('success', () => this.transaction.abort());
      return request;
    });

    await expect(run(service)).rejects.toThrow();
    expect(await service.get('key')).toBe('before');
  });

  describe('replace', () => {
    test("rewrites an entry's value and keeps its expiry", async () => {
      useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-24T12:00:00Z') });
      await service.set('key', 'old', new Date('2026-11-24T13:00:00Z'));

      expect(await service.replace('key', 'new')).toBe(true);
      expect(await service.get('key')).toBe('new');

      vi.setSystemTime(new Date('2026-11-24T13:00:01Z'));
      expect(await service.get('key')).toBeNull();
    });

    test('keeps an entry with no expiry without one', async () => {
      await service.set('key', 'old');

      expect(await service.replace('key', 'new')).toBe(true);

      await service.clearExpired();
      expect(await service.get('key')).toBe('new');
    });

    test('adds nothing for a missing or expired key', async () => {
      await service.set('expired', 'old', new Date(Date.now() - 1000));

      expect([await service.replace('missing', 'new'), await service.replace('expired', 'new')]).toEqual([
        false,
        false
      ]);
      expect([await service.get('missing'), await service.get('expired')]).toEqual([null, null]);
    });
  });
});

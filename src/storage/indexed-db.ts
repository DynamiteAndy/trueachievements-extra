/**
 * Generic key/value wrapper over a single IndexedDB object store. Not tied to
 * HTTP or fetch caching — anything that needs to persist data too large or
 * too frequently-written for Tampermonkey's `GM_setValue`/`GM_getValue`
 * storage (which round-trips its entire value on every read/write) can
 * instantiate one of these against its own store name.
 *
 * `expiresAt` on `set()` is optional and per-entry (callers compute it, e.g. with `fromNow` from `lib/time.ts`);
 * `get()` and `clearExpired()` drop expired entries.
 */

interface StoredRecord<T> {
  value: T;
  expiresAt?: Date;
}

// Whether an entry is past its expiry; one without an expiry never is. get, replace and the sweep all ask this, so
// they agree on what has expired
const expired = (record: StoredRecord<unknown>): boolean =>
  record.expiresAt ? new Date(record.expiresAt) <= new Date() : false;

// An open that another connection held up: blocked, or past its time limit
class HeldUpError extends Error {}

export class IndexedDbService<T = unknown> {
  private db: Promise<IDBDatabase> | null = null;
  // When an open was last held up
  private heldUpAt: number | null = null;

  constructor(
    private readonly dbName: string,
    private readonly storeName: string,
    // How long an open may take before it's given up on. Opening takes milliseconds, unless another connection holds
    // the database up
    private readonly openTimeoutMs = 3000,
    // How long to fail at once after an open was held up, rather than have each call wait out the time limit again
    // (memoizeFetch reads, then writes, so each would pay it)
    private readonly heldUpRetryMs = 30_000
  ) {}

  // Opens the database at `version` (its current version when left out). A store can only be created while the
  // database is being upgraded, so this is also where a missing store is added.
  // An upgrade is blocked while another connection holds an older version open and won't close (every service's
  // connection closes when asked, see `connect`, but a tab running an older build may not), and a plain open waits
  // behind a blocked upgrade. Either would never settle, and every caller with it, so a blocked upgrade is rejected
  // at once and any open past its time limit is given up on: callers fall back (memoizeFetch fetches instead), and
  // calls fail at once until `heldUpRetryMs` has passed (see `getDb`). A connection that opens after it was given up
  // on is closed, so it holds nothing up.
  private open(version?: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, version);
      let settled = false;

      const giveUp = (error: unknown): void => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(error);
        }
      };

      const timer = setTimeout(
        () => giveUp(new HeldUpError(`Opening IndexedDB "${this.dbName}" took over ${this.openTimeoutMs} ms`)),
        this.openTimeoutMs
      );

      request.onerror = () => giveUp(request.error);
      request.onblocked = () =>
        giveUp(new HeldUpError(`Opening IndexedDB "${this.dbName}" is blocked by another connection`));
      request.onsuccess = () => {
        if (settled) {
          request.result.close();
          return;
        }

        settled = true;
        clearTimeout(timer);
        resolve(request.result);
      };
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(this.storeName)) {
          database.createObjectStore(this.storeName);
        }
      };
    });
  }

  // Several services can share a database, each with its own store, so the database version isn't fixed: when this
  // service's store is missing (a new database is created with it), reopen one version higher to add it. Repeats in
  // case another service upgraded the database in the meantime.
  private async connect(): Promise<IDBDatabase> {
    let database = await this.open();

    while (!database.objectStoreNames.contains(this.storeName)) {
      const version = database.version + 1;
      database.close();
      database = await this.open(version).catch((error: unknown) => {
        // Another service already took that version; look again from the database's current version
        if (error instanceof DOMException && error.name === 'VersionError') {
          return this.open();
        }

        throw error;
      });
    }

    // Let other services (or tabs) upgrade the database: close this connection and reopen on next use
    database.onversionchange = () => {
      database.close();
      this.db = null;
    };

    return database;
  }

  private getDb(): Promise<IDBDatabase> {
    if (!this.db) {
      if (this.heldUpAt !== null && Date.now() - this.heldUpAt < this.heldUpRetryMs) {
        return Promise.reject(new HeldUpError(`IndexedDB "${this.dbName}" was held up by another connection just now`));
      }

      this.db = this.connect().then(
        (database) => {
          this.heldUpAt = null;
          return database;
        },
        (error: unknown) => {
          // Don't keep a failed open: try again on the next call, or after a while when another connection held it up
          this.db = null;
          if (error instanceof HeldUpError) {
            this.heldUpAt = Date.now();
          }
          throw error;
        }
      );
    }

    return this.db;
  }

  // Runs `work` in one readwrite transaction on the store, resolving with what its result getter gives once the
  // transaction completes: a write's request succeeds before its transaction commits, and the commit can still fail (an
  // abort, the quota), so nothing counts until then. A request that fails aborts its transaction with its own error,
  // rejecting here
  private async inWriteTransaction<R>(work: (store: IDBObjectStore) => () => R): Promise<R> {
    const database = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readwrite');
      const result = work(transaction.objectStore(this.storeName));

      transaction.oncomplete = () => resolve(result());
      transaction.onabort = () => reject(transaction.error ?? new DOMException('Transaction aborted', 'AbortError'));
    });
  }

  // One request's result: a read's as soon as its request succeeds, a write's once it's committed
  private async withStore<R>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<R>): Promise<R> {
    if (mode === 'readwrite') {
      return this.inWriteTransaction((store) => {
        const request = fn(store);
        return () => request.result;
      });
    }

    const database = await this.getDb();

    return new Promise((resolve, reject) => {
      const request = fn(database.transaction(this.storeName, mode).objectStore(this.storeName));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /** Returns `null` if the key is missing, or if it's present but expired
   * (in which case the expired record is also deleted). */
  async get(key: string): Promise<T | null> {
    const record = await this.withStore<StoredRecord<T> | undefined>('readonly', (store) => store.get(key));

    if (!record) {
      return null;
    }

    if (expired(record)) {
      await this.delete(key);
      return null;
    }

    return record.value;
  }

  async set(key: string, value: T, expiresAt?: Date): Promise<void> {
    await this.withStore('readwrite', (store) => store.put({ value, expiresAt } satisfies StoredRecord<T>, key));
  }

  /** Rewrites an entry's value, keeping its `expiresAt`, but only while it's there and unexpired: nothing is added.
   * Resolves whether it was rewritten. One transaction, so an entry expiring or deleted meanwhile isn't brought back. */
  async replace(key: string, value: T): Promise<boolean> {
    return this.inWriteTransaction((store) => {
      const request = store.get(key);
      let replaced = false;

      request.onsuccess = () => {
        const record = request.result as StoredRecord<T> | undefined;

        if (record && !expired(record)) {
          store.put({ value, expiresAt: record.expiresAt } satisfies StoredRecord<T>, key);
          replaced = true;
        }
      };

      return () => replaced;
    });
  }

  /** Deletes every entry. */
  async clear(): Promise<void> {
    await this.withStore('readwrite', (store) => store.clear());
  }

  /** Every key in the store, expired entries' too. */
  async keys(): Promise<string[]> {
    return (await this.withStore('readonly', (store) => store.getAllKeys())).map(String);
  }

  async delete(key: string): Promise<void> {
    await this.withStore('readwrite', (store) => store.delete(key));
  }

  /** Walks every record and deletes the ones past their `expiresAt`. Records
   * without an `expiresAt` are never touched. */
  async clearExpired(): Promise<void> {
    await this.inWriteTransaction((store) => {
      const request = store.openCursor();

      request.onsuccess = () => {
        const cursor = request.result;

        if (!cursor) {
          return;
        }

        if (expired(cursor.value as StoredRecord<T>)) {
          cursor.delete();
        }

        cursor.continue();
      };

      return () => undefined;
    });
  }
}

/**
 * Generic key/value wrapper over a single IndexedDB object store. Not tied to
 * HTTP or fetch caching — anything that needs to persist data too large or
 * too frequently-written for Tampermonkey's `GM_setValue`/`GM_getValue`
 * storage (which round-trips its entire value on every read/write) can
 * instantiate one of these against its own store name.
 *
 * `expiresAt` on `set()` is optional and per-entry — callers that want
 * time-based expiry compute the `Date` themselves (see `MemoizedFetch` for
 * the period-based TTL math already used elsewhere in this codebase) and
 * pass it in; this service just checks it on `get()`/`clearExpired()`. Callers
 * that don't need expiry can omit it entirely.
 */

interface StoredRecord<T> {
  value: T;
  expiresAt?: Date;
}

export class IndexedDbService<T = unknown> {
  private db: Promise<IDBDatabase> | null = null;

  constructor(
    private readonly dbName: string,
    private readonly storeName: string,
    private readonly dbVersion = 1
  ) {}

  private getDb(): Promise<IDBDatabase> {
    if (!this.db) {
      this.db = new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onblocked = () =>
          reject(new Error(`IndexedDB open blocked for "${this.dbName}" — another tab is holding an older version open`));
        request.onupgradeneeded = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains(this.storeName)) {
            database.createObjectStore(this.storeName);
          }
        };
      });
    }

    return this.db;
  }

  private async withStore<R>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<R>): Promise<R> {
    const database = await this.getDb();

    return new Promise((resolve, reject) => {
      const store = database.transaction(this.storeName, mode).objectStore(this.storeName);
      const request = fn(store);

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

    if (record.expiresAt && new Date(record.expiresAt) <= new Date()) {
      await this.delete(key);
      return null;
    }

    return record.value;
  }

  async set(key: string, value: T, expiresAt?: Date): Promise<void> {
    await this.withStore('readwrite', (store) => store.put({ value, expiresAt } satisfies StoredRecord<T>, key));
  }

  async delete(key: string): Promise<void> {
    await this.withStore('readwrite', (store) => store.delete(key));
  }

  /** Walks every record and deletes the ones past their `expiresAt`. Records
   * without an `expiresAt` are never touched. */
  async clearExpired(): Promise<void> {
    const database = await this.getDb();

    return new Promise((resolve, reject) => {
      const store = database.transaction(this.storeName, 'readwrite').objectStore(this.storeName);
      const request = store.openCursor();

      request.onsuccess = () => {
        const cursor = request.result;

        if (!cursor) {
          resolve();
          return;
        }

        const record = cursor.value as StoredRecord<T>;
        if (record.expiresAt && new Date(record.expiresAt) <= new Date()) {
          cursor.delete();
        }

        cursor.continue();
      };

      request.onerror = () => reject(request.error);
    });
  }
}

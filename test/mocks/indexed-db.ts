import 'fake-indexeddb/auto';

// Every store the script keeps lives in this one database
const databaseName = 'trueachievements-extra';

const settled = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

// Empties every store in the database, so a new store needs no listing here. A plain open (no version) never upgrades,
// so the services' own connections stay open and nothing is blocked.
export const clearScriptDatabase = async (): Promise<void> => {
  const databases = await indexedDB.databases();
  if (!databases.some((database) => database.name === databaseName)) {
    return;
  }

  const database = await settled(indexedDB.open(databaseName));
  try {
    const names = [...database.objectStoreNames];
    if (names.length === 0) {
      return;
    }

    const transaction = database.transaction(names, 'readwrite');
    await Promise.all(names.map((name) => settled(transaction.objectStore(name).clear())));
  } finally {
    database.close();
  }
};

// The IndexedDB stores, like the Tampermonkey values in localStorage, must start empty for every test
afterEach(clearScriptDatabase);

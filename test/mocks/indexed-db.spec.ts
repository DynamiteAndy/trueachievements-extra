import { IndexedDbService } from '@ta-x-storage';

import { clearScriptDatabase } from './indexed-db';

describe('test/mocks/indexed-db', () => {
  test('should empty every store in the script database, listed anywhere or not', async () => {
    const unlisted = new IndexedDbService<string>('trueachievements-extra', 'test-mocks-unlisted');
    const another = new IndexedDbService<string>('trueachievements-extra', 'test-mocks-another');
    await unlisted.set('key', 'a value');
    await another.set('key', 'another value');

    await clearScriptDatabase();

    expect(await unlisted.get('key')).toBeNull();
    expect(await another.get('key')).toBeNull();
  });
});

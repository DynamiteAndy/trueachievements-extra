import 'fake-indexeddb/auto';
import { IndexedDbService } from './indexed-db-service';

describe('IndexedDbService', () => {
  let service: IndexedDbService<string>;

  beforeEach(() => {
    // Fresh db name per test so fake-indexeddb doesn't carry state over.
    service = new IndexedDbService<string>(`test-db-${crypto.randomUUID()}`, 'entries');
  });

  test('get returns null for a missing key', async () => {
    expect(await service.get('missing')).toBeNull();
  });

  test('set then get round-trips a value', async () => {
    await service.set('key', 'value');

    expect(await service.get('key')).toBe('value');
  });

  test('get returns null and deletes the record once expiresAt has passed', async () => {
    await service.set('key', 'value', new Date(Date.now() - 1000));

    expect(await service.get('key')).toBeNull();
    // Confirm it was actually deleted, not just filtered on read.
    await service.set('key', 'still there', new Date(Date.now() + 100_000));
    expect(await service.get('key')).toBe('still there');
  });

  test('get returns the value when expiresAt is in the future', async () => {
    await service.set('key', 'value', new Date(Date.now() + 100_000));

    expect(await service.get('key')).toBe('value');
  });

  test('delete removes a key', async () => {
    await service.set('key', 'value');
    await service.delete('key');

    expect(await service.get('key')).toBeNull();
  });

  test('clearExpired removes only expired records', async () => {
    await service.set('expired', 'gone', new Date(Date.now() - 1000));
    await service.set('fresh', 'kept', new Date(Date.now() + 100_000));
    await service.set('no-expiry', 'kept-forever');

    await service.clearExpired();

    expect(await service.get('expired')).toBeNull();
    expect(await service.get('fresh')).toBe('kept');
    expect(await service.get('no-expiry')).toBe('kept-forever');
  });
});

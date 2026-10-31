import { useFakeTimers } from '@ta-x-test';

import {
  carryOverOwnerProgressUrls,
  getOwnerProgressUrl,
  ownerProgressUrls,
  rememberOwnerProgressUrl
} from './owner-progress-urls';

describe('forum/view-thread/show-owner-progress/owner-progress-urls', () => {
  const mirrorsEdge = 'https://www.trueachievements.com/game/Mirrors-Edge/walkthrough';
  const madRiders = 'https://www.trueachievements.com/game/Mad-Riders/walkthrough';
  const day = 24 * 60 * 60 * 1000;

  test("should remember a thread's walkthrough page, and have none for another thread", async () => {
    await rememberOwnerProgressUrl('387144', mirrorsEdge);

    expect(await getOwnerProgressUrl('387144')).toBe(mirrorsEdge);
    expect(await getOwnerProgressUrl('162276')).toBeNull();
  });

  test('should forget a page 90 days after it was last saved, and saving it again keeps it another 90', async () => {
    useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-21T12:00:00Z') });
    await rememberOwnerProgressUrl('387144', mirrorsEdge);
    await rememberOwnerProgressUrl('162276', madRiders);

    vi.setSystemTime(Date.now() + 60 * day);
    await rememberOwnerProgressUrl('162276', madRiders);
    vi.setSystemTime(Date.now() + 31 * day);

    expect(await getOwnerProgressUrl('387144')).toBeNull();
    expect(await getOwnerProgressUrl('162276')).toBe(madRiders);
  });

  describe('the map kept in Tampermonkey storage before', () => {
    const legacy = (entries: [string, string][]): void =>
      GM_setValue('walkthroughOwnerProgressUrl', JSON.stringify(entries));

    test('should be carried over to IndexedDB, then deleted', async () => {
      legacy([
        ['387144', mirrorsEdge],
        ['162276', madRiders]
      ]);

      await carryOverOwnerProgressUrls();

      expect([await ownerProgressUrls.get('387144'), await ownerProgressUrls.get('162276')]).toEqual([
        mirrorsEdge,
        madRiders
      ]);
      expect(GM_listValues()).toEqual([]);
    });

    test("should skip an entry whose page isn't an address, carrying over the rest", async () => {
      GM_setValue(
        'walkthroughOwnerProgressUrl',
        JSON.stringify([
          ['387144', mirrorsEdge],
          ['162276', 42]
        ])
      );

      await carryOverOwnerProgressUrls();

      expect([await ownerProgressUrls.get('387144'), await ownerProgressUrls.get('162276')]).toEqual([
        mirrorsEdge,
        null
      ]);
    });
  });
});

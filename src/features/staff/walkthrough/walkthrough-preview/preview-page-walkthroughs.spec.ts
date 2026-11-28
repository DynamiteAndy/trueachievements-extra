import { useFakeTimers } from '@ta-x-test';

import {
  carryOverPreviewPageWalkthroughs,
  getPageWalkthrough,
  previewPageWalkthroughs,
  rememberPages
} from './preview-page-walkthroughs';

describe('staff/walkthrough/walkthrough-preview/preview-page-walkthroughs', () => {
  const day = 24 * 60 * 60 * 1000;

  test('should find the walkthrough of each remembered page, and none for another page', async () => {
    await rememberPages('3567', ['22622', '22623']);

    expect([
      await getPageWalkthrough('22622'),
      await getPageWalkthrough('22623'),
      await getPageWalkthrough('7881')
    ]).toEqual(['3567', '3567', null]);
  });

  test('should forget a page 90 days after it was last saved, and saving it again keeps it another 90', async () => {
    useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-21T12:00:00Z') });
    await rememberPages('3567', ['22622', '22623']);

    vi.setSystemTime(Date.now() + 60 * day);
    await rememberPages('3567', ['22623']);
    vi.setSystemTime(Date.now() + 31 * day);

    expect([await getPageWalkthrough('22622'), await getPageWalkthrough('22623')]).toEqual([null, '3567']);
  });

  describe('the map kept in Tampermonkey storage before', () => {
    const legacy = (entries: [string, string[]][]): void =>
      GM_setValue('previewWalkthroughId', JSON.stringify(entries));

    test("should be carried over to IndexedDB as each page's walkthrough, then deleted", async () => {
      legacy([
        ['3567', ['22622', '22623']],
        ['1578', ['7881']]
      ]);

      await carryOverPreviewPageWalkthroughs();

      expect([
        await previewPageWalkthroughs.get('22622'),
        await previewPageWalkthroughs.get('22623'),
        await previewPageWalkthroughs.get('7881')
      ]).toEqual(['3567', '3567', '1578']);
      expect(GM_listValues()).toEqual([]);
    });

    test("should skip an entry whose pages aren't a list, carrying over the rest", async () => {
      GM_setValue(
        'previewWalkthroughId',
        JSON.stringify([
          ['3567', '22622'],
          ['1578', ['7881']]
        ])
      );

      await carryOverPreviewPageWalkthroughs();

      expect([await previewPageWalkthroughs.get('22622'), await previewPageWalkthroughs.get('7881')]).toEqual([
        null,
        '1578'
      ]);
    });
  });
});

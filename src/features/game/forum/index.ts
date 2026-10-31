import { allConcurrently } from '@ta-x-lib';
import { whenParsed } from '@ta-x-page';
import { GamesRegex } from '@ta-x-site';

import { changeToDefaultThread } from './default-thread';
import { filterThreads } from './filter-threads';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.forum()) {
    return;
  }

  // Opening the default tab loads the forum again, so the thread filter is left to the page that comes. It reads the
  // whole thread list, so it waits for it to be parsed
  if (await changeToDefaultThread()) {
    return;
  }

  await whenParsed();

  await allConcurrently('Game Forum', [{ name: 'game:forum:filter-threads', task: filterThreads }]);
};

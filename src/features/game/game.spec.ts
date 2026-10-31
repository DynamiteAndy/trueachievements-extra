import * as taxLib from '@ta-x-lib';

import achievement from './achievement';
import achievements from './achievements';
import challenges from './challenges';
import clips from './clips';
import dlc from './dlc';
import forum from './forum';
import { linkForumsToDefaultThread } from './forum/default-thread-links';
import walkthrough from './walkthrough';

import game from '.';

describe('game', () => {
  // Each page folder checks its own page and has its own spec: here only which ones the group starts
  test('should start every games feature, once', async () => {
    const spy = vi.spyOn(taxLib, 'allConcurrently').mockResolvedValue([]);

    await game();

    expect(spy).toHaveBeenCalledExactlyOnceWith('Game', [
      { name: 'game:achievement', task: achievement },
      { name: 'game:achievements', task: achievements },
      { name: 'game:challenges', task: challenges },
      { name: 'game:clips', task: clips },
      { name: 'game:dlc', task: dlc },
      { name: 'game:forum', task: forum },
      { name: 'game:forum-links', task: linkForumsToDefaultThread },
      { name: 'game:walkthrough', task: walkthrough }
    ]);
  });
});

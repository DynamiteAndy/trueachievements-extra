import { allConcurrently } from '@ta-x-lib';
import { GamesRegex } from '@ta-x-site';

import { changeToDefaultStatus } from './default-status';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.clipsUrl()) {
    return;
  }

  await allConcurrently('Game Clips', [{ name: 'game:clips:change-to-default-status', task: changeToDefaultStatus }]);
};

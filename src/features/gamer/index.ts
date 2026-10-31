import { allConcurrently } from '@ta-x-lib';
import { GamerRegex } from '@ta-x-site';

import achievements from './achievements';

// Its tab in the settings menu (features/settings-tabs.tsx)
export { GamerSettings } from './GamerSettings';

export default async (): Promise<void> => {
  if (!GamerRegex.Test.all()) {
    return;
  }

  await allConcurrently('Gamer', [{ name: 'gamer:achievements', task: achievements }]);
};

import { allConcurrently } from '@ta-x-lib';
import { GamerRegex } from '@ta-x-site';

import { addGroupByGameButton } from './add-group-by-game-button';

export default async (): Promise<void> => {
  if (!GamerRegex.Test.gamerAchievementsUrl()) {
    return;
  }

  // The group by game button hands back its stop, which nothing here needs
  await allConcurrently<unknown>('Gamer Achievements', [
    { name: 'gamer:achievements:add-group-by-game-button', task: addGroupByGameButton }
  ]);
};

import { GamesRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { changeToDefaultStatus } from './default-status';

export default async(): Promise<void> => {
  if (!GamesRegex.Test.achievementsUrl()) return;

  allConcurrently('Games Achievements', [ 
    { name: 'games-achievements-change-to-default-status', task: changeToDefaultStatus }
   ]);
};

import { GamesRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { changeToDefaultStatus } from './default-status';
import { individualProgress } from './individual-progress';

export default async(): Promise<void> => {
  if (!GamesRegex.Test.achievementsUrl()) return;

  changeToDefaultStatus();

  allConcurrently('Games Achievements', [ 
    { name: 'games-achievements-individual-progress', task: individualProgress }
   ]);
};

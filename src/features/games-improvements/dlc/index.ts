import { GamesRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { changeToDefaultStatus } from './default-status';
import { individualProgress } from './individual-progress';

export default async(): Promise<void> => {
  if (!GamesRegex.Test.dlc()) return;

  changeToDefaultStatus();

  allConcurrently('Games DLC', [ 
    { name: 'games-dlc-individual-progress', task: individualProgress }
   ]);
};

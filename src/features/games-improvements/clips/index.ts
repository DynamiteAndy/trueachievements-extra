import { GamesRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { changeToDefaultStatus } from './default-status';

export default async(): Promise<void> => {
  if (!GamesRegex.Test.clipsUrl()) return;

  allConcurrently('Games Clips', [ 
    { name: 'games-clips-change-to-default-status', task: changeToDefaultStatus }
   ]);
};

import { gameDLC, GamesRegex } from '@ta-x-globals';
import { applyIndividualProgress } from '../shared';

export const individualProgress = (): void => {
  if (!gameDLC.gameDLCIndividualProgress) return;
  if (GamesRegex.Test.individualDlcUrl()) return;
  
  applyIndividualProgress();
};

export default { individualProgress };
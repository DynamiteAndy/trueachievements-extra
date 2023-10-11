import { gameDLC, GamesRegex } from '@ta-x-globals';
import { applyIndividualProgress } from '../shared';

export const individualProgress = async (): Promise<void> => {
  if (!gameDLC.gameDLCIndividualProgress) {
    return;
  }

  if (GamesRegex.Test.individualDlcUrl()) {
    return;
  }

  await applyIndividualProgress();
};

export default { individualProgress };

import { gameChallenges } from '@ta-x-globals';
import { applyIndividualProgress } from '../shared';

export const individualProgress = async (): Promise<void> => {
  if (!gameChallenges.gameChallengesIndividualProgress) {
    return;
  }

  await applyIndividualProgress();
};

export default { individualProgress };

import { gameChallenges } from '@ta-x-globals';
import { applyIndividualProgress } from '../shared';

export const individualProgress = (): void => {
  if (!gameChallenges.gameChallengesIndividualProgress) return;

  applyIndividualProgress();
};

export default { individualProgress };

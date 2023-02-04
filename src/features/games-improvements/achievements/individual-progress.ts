import { gameAchievements } from '@ta-x-globals';
import { applyIndividualProgress } from '../shared';

export const individualProgress = (): void => {
  if (!gameAchievements.gameAchievementsIndividualProgress) return;
  const hasDlc = document.querySelector('.pnl-hd.dlc') != null;

  if (!hasDlc) return;

  applyIndividualProgress();
};

export default { individualProgress };
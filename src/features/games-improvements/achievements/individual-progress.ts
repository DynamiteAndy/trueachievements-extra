import { gameAchievements } from '@ta-x-globals';
import { applyIndividualProgress } from '../shared';

export const individualProgress = async (): Promise<void> => {
  if (!gameAchievements.gameAchievementsIndividualProgress) {
    return;
  }

  const hasDlc = document.querySelector('.pnl-hd.game:not(.gamer):not([data-gid]), .pnl-hd.dlc') != null;
  if (!hasDlc) {
    return;
  }

  await applyIndividualProgress();
};

export default { individualProgress };

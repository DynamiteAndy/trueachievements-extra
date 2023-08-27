import { gameAchievements, GamesRegex } from '@ta-x-globals';
import { setDefaultStatus } from '../shared';

export const changeToDefaultStatus = (): void => {
  if (!gameAchievements.gameAchievementsDefaultStatus) {
    return;
  }

  const status = document.querySelector(`#${gameAchievements.gameAchievementsDefaultStatusValue}`) as HTMLSelectElement;

  setDefaultStatus(status, 'gameAchievementsDefaultStatusPathName', GamesRegex.Test.achievementsUrlWithGamerId);
};

export default { changeToDefaultStatus };

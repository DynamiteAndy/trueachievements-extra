import { Cache, Constants, gameAchievements, GamesRegex, getUrlProperties } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';

export const changeToDefaultStatus = async(): Promise<void> => {
  if (!gameAchievements.gameAchievementsDefaultStatus) return;

  const url = getUrlProperties(window.location.href, ['pathname','search']);
  const status = await waitForElement(`#${gameAchievements.gameAchievementsDefaultStatusValue}`) as HTMLSelectElement;

  if (status && url !== Cache.gameAchievementsDefaultStatusPathName) {
    Cache.gameAchievementsDefaultStatusPathName = getUrlProperties(window.location.href, ['pathname','search']);

    if (GamesRegex.Test.achievementsUrlWithGamerId() && new URLSearchParams(window.location.search).get('gamerid') !== Constants.gamerId) return;
    if (!status.hasAttribute('checked')) {
      const gamerProgress = document.querySelector('.game.gamer .progress .progress-ring text');
      
      if (gamerProgress && parseInt(gamerProgress.textContent) !== 100) {
        status.click();
      }
    }
  }
};

export default { changeToDefaultStatus };
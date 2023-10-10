import { Cache, getUrlProperties } from '@ta-x-globals';
import { getCookie } from '@ta-x-utilities';

export const setDefaultStatus = (
  status: HTMLSelectElement,
  cacheProperty: string,
  gamerIdRegex: (str?: string) => boolean
): void => {
  const url = getUrlProperties(window.location.href, ['pathname', 'search']);

  if (status && url !== Cache[cacheProperty]) {
    Cache[cacheProperty] = getUrlProperties(window.location.href, ['pathname', 'search']);

    if (gamerIdRegex() && new URLSearchParams(window.location.search).get('gamerid') !== getCookie('GamerID')) {
      return;
    }
    if (!status.hasAttribute('checked')) {
      const totalAchievements = [...document.querySelectorAll('.ach-panels li')].length;
      const wonAchievements = [...document.querySelectorAll('.ach-panels li.w')].length;

      if (wonAchievements !== totalAchievements) {
        status.click();
      }
    }
  }
};

export default { setDefaultStatus };

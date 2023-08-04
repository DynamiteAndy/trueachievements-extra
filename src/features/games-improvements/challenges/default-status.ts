import { gameChallenges, GamesRegex } from '@ta-x-globals';
import { setDefaultStatus } from '../shared';

export const changeToDefaultStatus = (): void => {
  if (!gameChallenges.gameChallengesDefaultStatus) return;

  const status = document.querySelector(`#${gameChallenges.gameChallengesDefaultStatusValue}`) as HTMLSelectElement;

  setDefaultStatus(status, 'gameChallengesDefaultStatusPathName', GamesRegex.Test.challengesUrlWithGamerId);
};

export default { changeToDefaultStatus };

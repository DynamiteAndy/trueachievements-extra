import { gameDLC, GamesRegex } from '@ta-x-globals';
import { setDefaultStatus } from '../shared';

export const changeToDefaultStatus = (): void => {
  if (!gameDLC.gameDLCDefaultStatus) return;

  const status = document.querySelector(`#${gameDLC.gameDLCDefaultStatusValue}`) as HTMLSelectElement;

  setDefaultStatus(
    status,
    'gameDLCDefaultStatusPathName',
    GamesRegex.Test.dlcUrl() ? GamesRegex.Test.dlcWithGamerId : GamesRegex.Test.individualDlcUrlWithGamerId
  );
};

export default { changeToDefaultStatus };

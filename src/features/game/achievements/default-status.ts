import { GamesRegex } from '@ta-x-site';
import { settings } from '@ta-x-storage';

import { setDefaultStatus } from '../shared';

const { achievements } = settings.game;

// Resolves whether it posted the page back
export const changeToDefaultStatus = (): Promise<boolean> =>
  setDefaultStatus(
    achievements.defaultStatus.peek(),
    achievements.defaultStatusValue.peek(),
    GamesRegex.Test.achievementsUrlWithGamerId
  );

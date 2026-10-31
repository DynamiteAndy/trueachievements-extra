import { GamesRegex } from '@ta-x-site';
import { settings } from '@ta-x-storage';

import { setDefaultStatus } from '../shared';

const { challenges } = settings.game;

// Resolves whether it posted the page back
export const changeToDefaultStatus = (): Promise<boolean> =>
  setDefaultStatus(
    challenges.defaultStatus.peek(),
    challenges.defaultStatusValue.peek(),
    GamesRegex.Test.challengesUrlWithGamerId
  );

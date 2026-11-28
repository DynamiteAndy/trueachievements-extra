import { GamesRegex } from '@ta-x-site';
import { effectiveSettings } from '@ta-x-storage';

import { setDefaultStatus } from '../shared';

// Resolves whether it posted the page back. On the DLC list or one DLC's page
export const changeToDefaultStatus = (): Promise<boolean> =>
  setDefaultStatus(
    effectiveSettings.dlc.defaultStatus.peek(),
    effectiveSettings.dlc.defaultStatusValue.peek(),
    GamesRegex.Test.dlcWithGamerId
  );

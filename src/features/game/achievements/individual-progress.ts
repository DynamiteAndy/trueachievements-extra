import { settings } from '@ta-x-storage';

import { applyIndividualProgress, whileOnDlcGroups } from '../shared';

// On a game with DLC groups, while the setting is on, live: turned off, each header's own text comes back. Returns the
// stop
export const individualProgress = (): (() => void) =>
  whileOnDlcGroups(settings.game.achievements.individualProgress, applyIndividualProgress);

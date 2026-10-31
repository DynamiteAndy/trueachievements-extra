import { effectiveSettings } from '@ta-x-storage';

import { applyIndividualProgress, whileOnDlcGroups } from '../shared';

// While the effective setting is on (the challenges page's own with its override on, else the achievements page's),
// live: the override and both settings it picks between apply live, as the override switches nothing else. Turned off,
// each header's own text comes back. A page with no group headers has nowhere to show progress, so the game's
// achievements page isn't fetched for it. Returns the stop
export const individualProgress = (): (() => void) =>
  whileOnDlcGroups(effectiveSettings.challenges.individualProgress, applyIndividualProgress);

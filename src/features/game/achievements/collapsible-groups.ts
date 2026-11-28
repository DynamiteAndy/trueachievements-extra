import { settings } from '@ta-x-storage';

import { applyCollapsibleGroups, whileOnDlcGroups } from '../shared';

// On a game with DLC groups, while the setting is on, live: turned off, the site's rows go back where they were.
// Returns the stop
export const collapsibleGroups = (): (() => void) =>
  whileOnDlcGroups(settings.game.achievements.collapsibleGroups, applyCollapsibleGroups);

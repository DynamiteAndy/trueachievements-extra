import { settings } from '@ta-x-storage';
import { addSearchAndFilterButton } from '@ta-x-ui';

import { GroupByGameButton } from './GroupByGameButton';

const { addGroupByGameButton: setting } = settings.gamer.achievements;

// Adds the button while the setting is on, live (addSearchAndFilterButton); turning it off takes any grouping away too.
// Returns the stop
export const addGroupByGameButton = (): (() => void) => addSearchAndFilterButton(setting, <GroupByGameButton />);

import { settings } from '@ta-x-storage';
import { addSearchAndFilterButton } from '@ta-x-ui';

import { HighlightGamesNotInCollectionButton } from './HighlightGamesNotInCollectionButton';

const { addHighlightGamesNotInCollectionButton: setting } = settings.gamesList;

// Adds the button while the setting is on, live (addSearchAndFilterButton); turning it off takes any highlight away
// too. Returns the stop
export const addHighlightGamesNotInCollectionButton = (): (() => void) =>
  addSearchAndFilterButton(setting, <HighlightGamesNotInCollectionButton />);

import { settings } from '@ta-x-storage';
import { CheckboxSetting } from '@ta-x-ui';

// The games list's setting in the settings menu's Games tab
export const GamesListSettings = () => {
  const gamesList = settings.gamesList;

  return (
    <CheckboxSetting label="Add Not In Collection Button" setting={gamesList.addHighlightGamesNotInCollectionButton} />
  );
};

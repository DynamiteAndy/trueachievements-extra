import { settings } from '@ta-x-storage';
import { CheckboxSetting } from '@ta-x-ui';

// The settings menu's Gamer tab
export const GamerSettings = () => {
  const gamerAchievements = settings.gamer.achievements;

  return <CheckboxSetting label="Add Group By Game Button" setting={gamerAchievements.addGroupByGameButton} />;
};

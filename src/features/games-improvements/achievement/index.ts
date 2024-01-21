import { AchievementsRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import importGuides from './import-guides';

export default async (): Promise<void> => {
  if (!AchievementsRegex.Test.achievementUrl()) {
    return;
  }

  allConcurrently('Games Achievement', [{ name: 'games-achievements-import-guides', task: importGuides }]);
};

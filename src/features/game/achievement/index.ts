import { allConcurrently } from '@ta-x-lib';
import { AchievementsRegex } from '@ta-x-site';

import { importGuides } from '../extra-guides';

export default async (): Promise<void> => {
  if (!AchievementsRegex.Test.achievementUrl()) {
    return;
  }

  await allConcurrently('Game Achievement', [{ name: 'game:achievement:extra-guides', task: importGuides }]);
};

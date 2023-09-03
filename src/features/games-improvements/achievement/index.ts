import { AchievementsRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import addXboxAchievementGuides from './add-xbox-achievement-guides';

export default async (): Promise<void> => {
  if (!AchievementsRegex.Test.achievementUrl()) {
    return;
  }

  allConcurrently('Games Achievement', [
    { name: 'games-achievement-xbox-achievement-guides', task: addXboxAchievementGuides }
  ]);
};

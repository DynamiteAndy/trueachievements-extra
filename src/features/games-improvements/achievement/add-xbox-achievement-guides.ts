import { gamesImprovements } from '@ta-x-globals';
import { addXboxAchievementGuides } from '../shared';

export default async (): Promise<void> => {
  if (!gamesImprovements.achievements.gameAchievementsShowXboxAchievementGuides) {
    return;
  }

  addXboxAchievementGuides();
};

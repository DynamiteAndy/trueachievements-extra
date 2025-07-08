import { ExternalRegex, gamesImprovements } from '@ta-x-globals';
import svg from '@ta-x-svgs/xboxachievements-icon.hbs';
import { ReseroNetwork } from '@ta-x-models';
import styles from './styles';

export const addXboxAchievementGuides = async (): Promise<void> => {
  const xboxAchievements = new ReseroNetwork({
    extensionEnabled: gamesImprovements.achievements.gameAchievementsShowXboxAchievementGuides,
    extensionSelector: `.${styles.jsXboxAchievementGuides}`,
    extensionSetting: 'gameAchievementsXboxAchievementsGuideUrl',
    importableGuideUrlTest: ExternalRegex.Test.xboxAchievementsGuide,
    guide: {
      name: '360Achievements',
      info: 'This guide was imported from 360Achievements.com',
      svg: {
        svgHTML: svg,
        svgClass: styles.xboxAchievementsIcon
      }
    }
  });

  await xboxAchievements.applyBody();
  xboxAchievements.listen();
};

export default { addXboxAchievementGuides };

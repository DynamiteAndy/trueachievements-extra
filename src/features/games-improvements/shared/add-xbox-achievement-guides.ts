import { Constants, ExternalRegex, gamesImprovements } from '@ta-x-globals';
import svg from '@ta-x-svgs/xboxachievements-icon.hbs';
import { ReseroNetwork } from '@ta-x-models';

export const addXboxAchievementGuides = async (): Promise<void> => {
  const xboxAchievements = new ReseroNetwork({
    extensionEnabled: gamesImprovements.achievements.gameAchievementsShowXboxAchievementGuides,
    extensionSelector: `.${Constants.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesJs}`,
    extensionSetting: 'gameAchievementsXboxAchievementsGuideUrl',
    importableGuideUrlTest: ExternalRegex.Test.xboxAchievementsGuide,
    guide: {
      name: '360Achievements',
      info: 'This guide was imported from 360Achievements.com',
      svg: {
        svgHTML: svg,
        svgClass: 'ta-x-xboxachievements-icon'
      }
    }
  });

  await xboxAchievements.applyBody();
  xboxAchievements.listen();
};

export default { addXboxAchievementGuides };

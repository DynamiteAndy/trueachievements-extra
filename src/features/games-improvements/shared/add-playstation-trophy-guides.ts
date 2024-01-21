import { Constants, ExternalRegex, gamesImprovements } from '@ta-x-globals';
import { ReseroNetwork } from '@ta-x-models';
import svg from '@ta-x-svgs/playstationtrophies-icon.hbs';

export const addPlaystationTrophyGuides = async (): Promise<void> => {
  const playstationTrophies = new ReseroNetwork({
    extensionEnabled: gamesImprovements.achievements.gameAchievementsShowPlaystationTrophyGuides,
    extensionSelector: `.${Constants.Styles.GamesImprovements.Achievements.showPlaystationTrophyGuidesJs}`,
    extensionSetting: 'gameAchievementsPlaystationTrophiesGuideUrl',
    importableGuideUrlTest: ExternalRegex.Test.playstationTrophiesGuide,
    guide: {
      name: 'Playstation Trophies',
      info: 'This guide was imported from PlaystationTrophies.org',
      svg: {
        svgHTML: svg,
        svgClass: 'ta-x-playstationtrophies-icon'
      }
    }
  });

  await playstationTrophies.applyBody();
  playstationTrophies.listen();
};

export default { addPlaystationTrophyGuides };

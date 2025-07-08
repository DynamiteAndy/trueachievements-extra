import { ExternalRegex, gamesImprovements } from '@ta-x-globals';
import { ReseroNetwork } from '@ta-x-models';
import svg from '@ta-x-svgs/playstationtrophies-icon.hbs';
import styles from './styles';

export const addPlaystationTrophyGuides = async (): Promise<void> => {
  const playstationTrophies = new ReseroNetwork({
    extensionEnabled: gamesImprovements.achievements.gameAchievementsShowPlaystationTrophyGuides,
    extensionSelector: `.${styles.jsPlaystationTrophyGuides}`,
    extensionSetting: 'gameAchievementsPlaystationTrophiesGuideUrl',
    importableGuideUrlTest: ExternalRegex.Test.playstationTrophiesGuide,
    guide: {
      name: 'Playstation Trophies',
      info: 'This guide was imported from PlaystationTrophies.org',
      svg: {
        svgHTML: svg,
        svgClass: styles.playstationTrophiesIcon
      }
    }
  });

  await playstationTrophies.applyBody();
  playstationTrophies.listen();
};

export default { addPlaystationTrophyGuides };

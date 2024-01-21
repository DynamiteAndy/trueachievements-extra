import { allConcurrently, waitForElement } from '@ta-x-utilities';
import { Constants } from '@ta-x-globals';
import { addPlaystationTrophyGuides } from './add-playstation-trophy-guides';
import { addXboxAchievementGuides } from './add-xbox-achievement-guides';
import html from './import-guides.hbs';

const applyBody = async (): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const asideColumn = await waitForElement('.main aside');
  const firstSection = await waitForElement('section:not(.smallpanel)', asideColumn);

  asideColumn.insertBefore(
    parsedDocument.querySelector(`.${Constants.Styles.GamesImprovements.Achievements.importGuidesJs}`),
    firstSection
  );
};

export const importGuides = async (): Promise<void> => {
  if (!(await waitForElement('.game h2 a'))) {
    return;
  }

  await applyBody();
  await allConcurrently('Import Guides', [
    { name: 'import-guides-xbox-achievements', task: addXboxAchievementGuides },
    { name: 'import-guides-playstation-trophies', task: addPlaystationTrophyGuides }
  ]);
};

export default { importGuides };

import { achievements, Constants, GamerRegex } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import html from './gamer-improvements.html';

const listen = (button: HTMLElement): void => {
  button.addEventListener('click', async() => {
    const containerTable = document.querySelector('table#oAchievementList tbody');
    ([...containerTable.querySelectorAll('tr.even, tr.odd')] as HTMLElement[]).sort((el1, el2) => {
      const el1Alt = el1.querySelector('.gamethumb img').getAttribute('alt');
      const el2Alt = el2.querySelector('.gamethumb img').getAttribute('alt');

      if (el1Alt > el2Alt) {
          return 1;
      } else if (el1Alt < el2Alt) {
          return -1;
      } else {
          return 0;
      }
    })
    .forEach((element: HTMLElement, index: number) => {
      element.classList.remove('odd', 'even');
      element.classList.add((index + 1 & 1) ? 'even' : 'odd');

      containerTable.appendChild(element);
    });
  });
};

export const addGroupByGameButton = async(): Promise<void> => {
  if (!achievements.addGroupByGameButton) return;
  if (!GamerRegex.Test.gamerAchievementsUrl()) return;

  const searchAndFilterContainer =  await waitForElement('.search-and-filter');

  if (!searchAndFilterContainer) return;
  
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  searchAndFilterContainer.appendChild(parsedDocument.querySelector(`.${Constants.Styles.GamerImprovements.groupByGameButtonJs}`));

  const button = searchAndFilterContainer.querySelector(`.${Constants.Styles.GamerImprovements.groupByGameButtonJs}`);

  listen(button as HTMLElement);
};

export default { addGroupByGameButton };
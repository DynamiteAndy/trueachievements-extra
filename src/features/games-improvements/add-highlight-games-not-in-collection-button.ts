import { Constants, games, GamesRegex } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import html from './games-improvements.html';

const listen = (button: HTMLElement): void => {
  button.addEventListener('click', async () => {
    ([...document.querySelectorAll('#oGameList img[alt*="Add game to My Game Collection"]')] as HTMLElement[]).forEach(
      (el) => {
        const tr = el.closest('tr');
        tr.classList.remove('odd', 'even');
        tr.classList.add('green');
      }
    );
  });
};

export const addHighlightGamesNotInCollectionButton = async (): Promise<void> => {
  if (!games.addHighlightGamesNotInCollectionButton) {
    return;
  }
  if (!GamesRegex.Test.gamesUrl()) {
    return;
  }

  const searchAndFilterContainer = await waitForElement('.search-and-filter');

  if (!searchAndFilterContainer) {
    return;
  }

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  searchAndFilterContainer.appendChild(
    parsedDocument.querySelector(`.${Constants.Styles.GamesImprovements.highlightGamesButtonJs}`)
  );

  const button = searchAndFilterContainer.querySelector(
    `.${Constants.Styles.GamesImprovements.highlightGamesButtonJs}`
  );

  listen(button as HTMLElement);
};

export default { addHighlightGamesNotInCollectionButton };

import { callAll } from '@ta-x-lib';
import { SearchAndFilterButton } from '@ta-x-ui';
import { useLayoutEffect, useState } from 'preact/hooks';

import styles from '../styles';

// Turns the games list's rows for games not in the collection green, in place of the site's odd/even striping. Returns
// the undo, which gives each row its striping back
const highlightGamesNotInCollection = (): (() => void) => {
  const undos = [...document.querySelectorAll('#oGameList img[alt*="Add game to My Game Collection"]')].flatMap(
    (img) => {
      const row = img.closest('tr');
      if (!row || row.classList.contains('green')) {
        return [];
      }

      const striping = ['odd', 'even'].filter((name) => row.classList.contains(name));
      row.classList.remove(...striping);
      row.classList.add('green');

      return [
        () => {
          row.classList.remove('green');
          row.classList.add(...striping);
        }
      ];
    }
  );

  return () => callAll(undos);
};

// The games list's button that highlights the games not in the collection. The highlight lasts while the button is
// there: once it's gone (the setting turned off), the rows get the site's striping back
export const HighlightGamesNotInCollectionButton = () => {
  const [highlighted, setHighlighted] = useState(false);

  useLayoutEffect(() => (highlighted ? highlightGamesNotInCollection() : undefined), [highlighted]);

  return (
    <SearchAndFilterButton class={styles.highlightGamesButton} onClick={() => setHighlighted(true)}>
      Highlight games not in collection
    </SearchAndFilterButton>
  );
};

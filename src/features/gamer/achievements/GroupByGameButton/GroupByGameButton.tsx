import { SearchAndFilterButton } from '@ta-x-ui';
import { useLayoutEffect, useState } from 'preact/hooks';

import styles from '../styles';

const gameName = (row: HTMLTableRowElement): string => row.querySelector('.gamethumb img')?.getAttribute('alt') ?? '';

// Sorts the achievement list's rows by game and restripes them. Returns the undo, which puts each row back in its place
// with its own striping
const groupByGame = (): (() => void) | undefined => {
  const tbody = document.querySelector('table#oAchievementList tbody');
  if (!tbody) {
    return undefined;
  }
  const rows = [...tbody.querySelectorAll<HTMLTableRowElement>('tr.even, tr.odd')];
  const places = rows.map((row) => ({ row, next: row.nextSibling, className: row.className }));

  rows
    .sort((a, b) => gameName(a).localeCompare(gameName(b)))
    .forEach((row, index) => {
      row.classList.remove('odd', 'even');
      row.classList.add(index % 2 === 0 ? 'even' : 'odd');

      tbody.appendChild(row);
    });

  // Last first, so each row's old next sibling is already back in place
  return () =>
    places.toReversed().forEach(({ row, next, className }) => {
      tbody.insertBefore(row, next);
      row.className = className;
    });
};

// The achievement list's button that groups the achievements by game. The grouping lasts while the button is there:
// once it's gone (the setting turned off), the rows go back to the site's order and striping
export const GroupByGameButton = () => {
  const [grouped, setGrouped] = useState(false);

  useLayoutEffect(() => (grouped ? groupByGame() : undefined), [grouped]);

  return (
    <SearchAndFilterButton class={styles.groupByGameButton} onClick={() => setGrouped(true)}>
      Group achievements by game
    </SearchAndFilterButton>
  );
};

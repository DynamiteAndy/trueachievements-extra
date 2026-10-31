import { callAll, timed } from '@ta-x-lib';
import { addClasses, moveInto } from '@ta-x-page';
import { useLayoutEffect, useState } from 'preact/hooks';

import { nameKey, useElement, walkthroughMarkup } from '../../shared';
import { ManageWalkthroughTableLinks } from '../ManageWalkthroughTableLinks';
import styles from '../styles';

// An achievement guided on several pages is listed once per page: merges each into its first row, listing every page,
// and corrects the list's total. Returns how to undo it
const deDupeAchievements = (achievementsPanel: HTMLElement): (() => void) => {
  const names = [...achievementsPanel.querySelectorAll<HTMLElement>(`${walkthroughMarkup.achievementsTable} .c1`)];
  const byName = new Map<string, HTMLElement[]>();
  for (const name of names) {
    const key = nameKey(name.textContent);
    byName.set(key, [...(byName.get(key) ?? []), name]);
  }
  const duplicates = [...byName.values()].filter((rows) => rows.length > 1);
  const undo: (() => void)[] = [];

  if (duplicates.length === 0) {
    return () => undefined;
  }

  let removedRows = 0;

  for (const rows of duplicates) {
    // Each name's pages are the cell after it
    const firstPages = rows[0].nextElementSibling;
    if (!(firstPages instanceof HTMLElement)) {
      continue;
    }
    const firstPagesText = firstPages.textContent;

    for (const name of rows.slice(1)) {
      const row = name.closest('tr');
      const parent = row?.parentNode;
      const pages = name.nextElementSibling;
      if (!row || !parent || !(pages instanceof HTMLElement)) {
        continue;
      }

      const next = row.nextSibling;
      firstPages.textContent += `, ${pages.textContent.trim()}`;
      row.remove();
      removedRows++;
      undo.push(() => parent.insertBefore(row, next));
    }

    undo.push(() => {
      firstPages.textContent = firstPagesText;
    });
  }

  const total = achievementsPanel.querySelector<HTMLElement>(walkthroughMarkup.achievementsTotal);
  if (total) {
    const totalText = total.textContent;
    total.textContent = totalText.replace(names.length.toString(), (names.length - removedRows).toString());
    undo.push(() => {
      total.textContent = totalText;
    });
  }

  return () => callAll(undo, { reverse: true });
};

interface ManageWalkthroughProps {
  // The site's walkthrough holder (#divWalkthroughHolder); the controller is mounted after its walkthrough details
  holder: HTMLElement;
}

// A controller for the staff manage walkthrough page: it renders a right sidebar container after the walkthrough's
// details and moves the site's achievements, games, gamers and other site panels into it (a missing one is skipped),
// merging achievements listed on several pages, and links their tables' names (ManageWalkthroughTableLinks). It also
// moves the hidden Action menu's items into the buttons row. Everything it moves or changes goes back as it was on
// unmount
export const ManageWalkthrough = ({ holder }: ManageWalkthroughProps) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const achievements = useElement(walkthroughMarkup.achievementsPanel, holder);
  const games = useElement(walkthroughMarkup.gamesPanel, holder);
  const gamers = useElement(walkthroughMarkup.gamersPanel, holder);
  const otherSiteLink = useElement('#chWalkthroughOtherSiteLink', holder);
  const actionMenu = useElement('#btnWalkthrough_Options', holder);
  // The list's total follows its table, so once it's there the whole list has been parsed: the merge waits for it and
  // runs once, on every row
  const total = useElement(walkthroughMarkup.achievementsTotal, achievements);
  const mergedAchievements = total ? achievements : null;

  useLayoutEffect(
    () =>
      mergedAchievements
        ? timed('Manage walkthrough: merge duplicates', () => deDupeAchievements(mergedAchievements))
        : undefined,
    [mergedAchievements]
  );

  // The panels that have turned up so far, in their order
  useLayoutEffect(() => {
    if (!container) {
      return undefined;
    }

    return moveInto(
      container,
      [achievements, games, gamers, otherSiteLink].filter((panel) => panel !== null)
    );
  }, [container, achievements, games, gamers, otherSiteLink]);

  // The Action menu's items (Add page, View public page, Preview, View and edit content, Clear Cache), shown as
  // buttons in the row the menu sits in. The row is spaced as a wrapping flex row: the site's own buttons are spaced
  // by the whitespace between them, which the moved items don't have, and a wrapped second row would have no gap
  useLayoutEffect(() => {
    const items = actionMenu ? [...actionMenu.querySelectorAll<HTMLAnchorElement>('li a')] : [];
    const buttonsRow = items[0]?.closest('.buttons');

    if (!buttonsRow) {
      return undefined;
    }

    // The site's own `button` class, where an item has it, stays on (addClasses)
    const giveClassesBack = [
      ...items.map((item) => addClasses(item, 'button')),
      addClasses(buttonsRow, styles.manageWalkthroughActionButtonsRow)
    ];
    const putBack = moveInto(buttonsRow, items);

    return () => {
      putBack();
      callAll(giveClassesBack);
    };
  }, [actionMenu]);

  return (
    <>
      <div ref={setContainer} class={styles.manageWalkthroughContainer} />
      {/* The links count and portal into the merged list's rows and total, so they read it once it's merged */}
      <ManageWalkthroughTableLinks achievements={mergedAchievements} games={games} gamers={gamers} />
    </>
  );
};

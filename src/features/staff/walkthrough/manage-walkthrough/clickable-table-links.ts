import { allConcurrently } from '@ta-x-lib';
import { isFreshArrival, waitForElement } from '@ta-x-page';

import {
  forgetWalkthroughPreview,
  getGameAchievements,
  nameKey,
  readWalkthroughPreview,
  sameName,
  selectedWalkthroughId,
  walkthroughMarkup
} from '../shared';

// A cell of one of the page's tables, and the link from elsewhere that its name becomes
export interface TableLink {
  cell: HTMLElement;
  link: HTMLAnchorElement;
  href: string;
}

// An achievement of the walkthrough's games that its achievements table doesn't list yet
interface MissingAchievement {
  name: string;
  href: string;
}

export interface AchievementLinks {
  links: TableLink[];
  missing: MissingAchievement[];
  // The table the missing rows go in, and its body when it has one
  table: HTMLTableElement;
  body: HTMLTableSectionElement | null;
  // How many rows the table lists once the missing ones are added
  rows: number;
}

// The preview of the walkthrough selected in the page's list, or null when none is
export const selectedWalkthroughPreview = async (): Promise<Document | null> => {
  if (!(await waitForElement(`${walkthroughMarkup.selectedWalkthroughRow} a`))) {
    return null;
  }

  const walkthroughId = selectedWalkthroughId();

  if (!walkthroughId) {
    return null;
  }

  // A post back (a game or editor added or removed, another walkthrough picked) can leave the copy out of date: it's
  // dropped before reading, as the drop on this page's visit (the walkthrough preview's) waits for the page to be parsed
  if (!isFreshArrival()) {
    await forgetWalkthroughPreview(walkthroughId);
  }

  return readWalkthroughPreview(walkthroughId);
};

// Matches each name in one of the page's tables (its games or its gamers) to the preview's link to it, by name. Each
// link is used once: games can share a name (a walkthrough can list several "Xbox 360 Team" games, each its own), and
// the table's rows carry nothing else to tell them apart (no id or link, and the two lists are in different orders), so
// the rows with one name take that name's links in turn rather than all the first
export const linkNames = (panel: HTMLElement, cells: string, links: HTMLAnchorElement[]): TableLink[] => {
  const unused = [...links];

  return [...panel.querySelectorAll<HTMLElement>(cells)].flatMap((cell) => {
    const index = unused.findIndex((link) => sameName(link.innerText, cell.innerText));
    if (index === -1) {
      return [];
    }

    const [link] = unused.splice(index, 1);
    return [{ cell, link, href: link.href }];
  });
};

// Matches the achievements table's names to the walkthrough's games' achievement pages, and lists the games'
// achievements it's missing. Undefined when the panel has no table
export const linkAchievements = async (
  achievementsPanel: HTMLElement,
  walkthroughPreviewDocument: Document
): Promise<AchievementLinks | undefined> => {
  // Looked up first, so a panel with no table fetches no game's achievements page
  const table = achievementsPanel.querySelector<HTMLTableElement>(`${walkthroughMarkup.achievementsTable} table`);
  if (!table) {
    return undefined;
  }

  const gameAchievements = (
    await allConcurrently(
      'Manage Walkthrough - Table Links - Achievements by Game',
      [...walkthroughPreviewDocument.querySelectorAll<HTMLAnchorElement>(walkthroughMarkup.previewGameLinks)].map(
        (game) => ({
          name: `staff:walkthrough:manage-walkthrough:table-links:achievements:${game.innerText}`,
          task: () => getGameAchievements(game.href)
        })
      ),
      // Each fetches the game's achievements page, so not all at once
      3
    )
  ).flatMap((achievements) => achievements ?? []);

  const body = table.tBodies.item(0);
  // Each cell's text read once, not once per achievement, as a long walkthrough lists many. A name the table lists
  // twice takes its first row
  const cellsByName = new Map<string, HTMLElement>();
  achievementsPanel.querySelectorAll<HTMLElement>(`${walkthroughMarkup.achievementsTable} .c1`).forEach((cell) => {
    const key = nameKey(cell.innerText);
    if (!cellsByName.has(key)) {
      cellsByName.set(key, cell);
    }
  });

  const linked = new Set<HTMLElement>();
  const links: TableLink[] = [];
  const missing: MissingAchievement[] = [];

  gameAchievements.forEach(({ title, link }) => {
    const cell = cellsByName.get(nameKey(title));

    if (cell && linked.has(cell)) {
      // A name on two of its games' pages: the first game's link
      return;
    }

    if (cell) {
      linked.add(cell);
      links.push({ cell, link, href: link.href });
    } else {
      missing.push({ name: title, href: link.href });
    }
  });

  return { links, missing, table, body, rows: (body?.querySelectorAll('.c1').length ?? 0) + missing.length };
};

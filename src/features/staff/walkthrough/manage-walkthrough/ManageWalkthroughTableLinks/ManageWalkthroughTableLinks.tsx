import { logger } from '@ta-x-lib';
import { applyLive, settings } from '@ta-x-storage';
import { createElement, createPortal } from 'preact';
import { useEffect, useLayoutEffect, useMemo, useState } from 'preact/hooks';

import { walkthroughMarkup } from '../../shared';
import {
  type AchievementLinks,
  linkAchievements,
  linkNames,
  selectedWalkthroughPreview,
  type TableLink
} from '../clickable-table-links';
import { ManageWalkthroughAchievementRow } from '../ManageWalkthroughAchievementRow';

const { manageWalkthrough } = settings.staff.walkthrough;

// A table cell showing a link in place of its name: the link as its own page has it (its attributes, with `href`),
// while the cell's own content waits aside until unmount
const LinkedCell = ({ cell, link, href }: TableLink) => {
  // Read while rendering, before the link is added to the cell
  const siteContent = useMemo(() => [...cell.childNodes], [cell]);

  useLayoutEffect(() => {
    siteContent.forEach((node) => node.remove());
    return () => cell.prepend(...siteContent);
  }, [cell, siteContent]);

  const attributes = Object.fromEntries([...link.attributes].map(({ name, value }) => [name, value]));

  return createPortal(createElement('a', { ...attributes, href }, link.textContent), cell);
};

interface ManageWalkthroughTableLinksProps {
  // The site's panels, once each has turned up
  achievements: HTMLElement | null;
  games: HTMLElement | null;
  gamers: HTMLElement | null;
}

// Links the names in the manage page's achievements, games and gamers tables to what the selected walkthrough's preview
// links them to, and adds the games' achievements the walkthrough doesn't list yet (counted in the list's total).
// Everything goes back as it was on unmount
const TableLinks = ({ achievements, games, gamers }: ManageWalkthroughTableLinksProps) => {
  const [preview, setPreview] = useState<Document | null>(null);
  const [achievementLinks, setAchievementLinks] = useState<AchievementLinks | undefined>(undefined);

  useEffect(() => {
    let unmounted = false;
    // Without the preview the tables stay as the site drew them
    selectedWalkthroughPreview()
      .then((found) => {
        if (!unmounted) {
          setPreview(found);
        }
      })
      .catch((error: unknown) => {
        logger.warn('manage-walkthrough', "the walkthrough's preview couldn't be read", error);
      });

    return () => {
      unmounted = true;
    };
  }, []);

  // Matched while rendering, so each cell's name is read before its link replaces it
  const gameLinks = useMemo(
    () =>
      preview && games
        ? linkNames(games, `${walkthroughMarkup.gamesTable} .c1`, [
            ...preview.querySelectorAll<HTMLAnchorElement>(walkthroughMarkup.previewGameLinks)
          ])
        : [],
    [preview, games]
  );
  const gamerLinks = useMemo(
    () =>
      preview && gamers
        ? linkNames(gamers, `${walkthroughMarkup.gamersTable} .c1`, [
            ...preview.querySelectorAll<HTMLAnchorElement>(walkthroughMarkup.previewEditorLinks)
          ])
        : [],
    [preview, gamers]
  );

  useEffect(() => {
    if (!preview || !achievements) {
      return undefined;
    }

    let unmounted = false;
    void linkAchievements(achievements, preview).then((found) => {
      if (!unmounted) {
        setAchievementLinks(found);
      }
    });

    return () => {
      unmounted = true;
    };
  }, [preview, achievements]);

  const missingRows = achievementLinks?.missing.map(({ name, href }) => (
    <ManageWalkthroughAchievementRow key={href} name={name} href={href} />
  ));
  const total = achievementLinks ? achievements?.querySelector(walkthroughMarkup.achievementsTotal) : null;

  return (
    <>
      {gameLinks.map((tableLink, index) => (
        <LinkedCell key={`game-${index}`} {...tableLink} />
      ))}
      {gamerLinks.map((tableLink, index) => (
        <LinkedCell key={`gamer-${index}`} {...tableLink} />
      ))}
      {achievementLinks?.links.map((tableLink, index) => (
        <LinkedCell key={`achievement-${index}`} {...tableLink} />
      ))}
      {achievementLinks &&
        achievementLinks.missing.length > 0 &&
        (achievementLinks.body
          ? createPortal(<>{missingRows}</>, achievementLinks.body)
          : createPortal(<tbody>{missingRows}</tbody>, achievementLinks.table))}
      {achievementLinks && total && createPortal(`/${achievementLinks.rows}`, total)}
    </>
  );
};

// Part of the manage walkthrough page's controller: the table links while their setting is on. It applies live (read
// with .value): turned off, the links unmount and give the tables back; turned on again, they're read afresh
export const ManageWalkthroughTableLinks = (props: ManageWalkthroughTableLinksProps) => {
  const on = manageWalkthrough.clickableTableLinks.value;

  // While mounted, changing it needs no reload, so the settings menu's notice leaves it out. A layout effect, so
  // unmounting unregisters it at once
  useLayoutEffect(() => applyLive(manageWalkthrough.clickableTableLinks), []);

  return on ? <TableLinks {...props} /> : null;
};

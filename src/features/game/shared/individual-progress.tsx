import { fetchOk, updateMemoizedFetch } from '@ta-x-fetch';
import { yieldToPage } from '@ta-x-lib';
import { mountDetached } from '@ta-x-page';
import { allAchievementsShown, GamesRegex, wonAchievementsShown } from '@ta-x-site';
import { AccordionStyles } from '@ta-x-ui';

import {
  dlcGroupHeader,
  getBaseGroupHeader,
  getDlcGroupHeaders,
  getProgressGroupHeaders,
  groupStats,
  groupTitle
} from './achievement-groups';
import { IndividualProgress, type AchievementGroup } from './IndividualProgress';

const stat = (header: Element, selector: string): string =>
  header.querySelector<HTMLElement>(selector)?.innerText ?? '';

// The site's lists in a group's next element: the list itself, or the lists collapsible groups moved into its wrapper
// (turned on live, individual progress can start after them, reading the page as they left it)
const listsIn = (child: HTMLElement): HTMLElement[] => {
  if (child.tagName === 'UL') {
    return [child];
  }

  return child.classList.contains(AccordionStyles.accordionContent)
    ? [...child.children].filter((list): list is HTMLElement => list instanceof HTMLElement && list.tagName === 'UL')
    : [];
};

// A group's totals from its header, and the achievements in the lists from `first` on, up to a header `stop` matches
const createAchievementGroup = (header: HTMLElement, first: ChildNode | null, stop: string): AchievementGroup => {
  const achievements: HTMLElement[] = [];

  for (let child = first; child; child = child.nextSibling) {
    if (!(child instanceof HTMLElement)) {
      continue;
    }
    if (child.matches(stop)) {
      break;
    }
    for (const list of listsIn(child)) {
      achievements.push(...list.querySelectorAll<HTMLElement>('li'));
    }
  }

  return {
    title: groupTitle(header),
    maxTAScore: stat(header, groupStats.taScore),
    maxGamerScore: stat(header, groupStats.gamerscore),
    maxAchievements: stat(header, groupStats.achievements),
    achievements
  };
};

// The base game's achievements run from its first list to the next header of any kind; each DLC's from its header to
// the next DLC's
const getAchievementGroups = (main: HTMLElement): AchievementGroup[] => {
  const baseHeader = getBaseGroupHeader(main);

  return [
    ...(baseHeader ? [createAchievementGroup(baseHeader, main.querySelector('.ach-panels'), '.pnl-hd')] : []),
    ...getDlcGroupHeaders(main).map((header) => createAchievementGroup(header, header.nextSibling, dlcGroupHeader))
  ];
};

// Started once the list is parsed, in a task of its own, as it reads every row. Applied live by the achievements, DLC
// and challenges pages (whileSetting): `aborted` says it was turned off meanwhile. The headers are handed to an
// IndividualProgress controller, and the function returned unmounts it, which puts each header's own text back
export const applyIndividualProgress = async (aborted?: AbortSignal): Promise<(() => void) | undefined> => {
  await yieldToPage();
  if (aborted?.aborted) {
    return undefined;
  }

  let mainElement: HTMLElement | null;
  if (allAchievementsShown() === true || wonAchievementsShown()) {
    // On All the page is the full list, and on Won it lists every achievement won under each group's header with the
    // group's totals, which is all the progress needs. All is stored, whether or not it was cached before, for the pages
    // that read it. A failed write is ignored (updateMemoizedFetch catches it)
    if (allAchievementsShown() === true) {
      void updateMemoizedFetch(window.location.href, document.documentElement.outerHTML);
    }

    mainElement = document.querySelector('main');
  } else {
    // Not Won, or a challenges page: the full list, fetched fresh, as a copy cached earlier would miss what's been won
    // since (a Not Won page can't work the totals out itself: a header's TrueAchievement total isn't its rows' sum).
    // Stored as the All page would be
    const url = GamesRegex.Test.challengesUrl()
      ? window.location.href.replace('/challenges', '/achievements')
      : window.location.href;
    const page = await (await fetchOk(url)).text();
    void updateMemoizedFetch(url, page);

    mainElement = new DOMParser().parseFromString(page, 'text/html').querySelector('main');
  }

  if (!mainElement || aborted?.aborted) {
    return undefined;
  }

  return mountDetached(
    <IndividualProgress headers={getProgressGroupHeaders()} groups={getAchievementGroups(mainElement)} />
  ).unmount;
};

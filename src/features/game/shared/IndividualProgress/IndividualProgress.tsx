import { callAll, timed, toInt } from '@ta-x-lib';
import { useLayoutEffect } from 'preact/hooks';

import { groupStats, groupTitle } from '../achievement-groups';

// A group's totals as its header gives them, and its achievements in the full list
export interface AchievementGroup {
  title: string;
  maxTAScore: string;
  maxGamerScore: string;
  maxAchievements: string;
  achievements: HTMLElement[];
}

// The total of an attribute the site puts on each won achievement (data-af its TrueAchievement score, data-bf its
// gamerscore)
const sumOf = (achievements: HTMLElement[], attribute: string): string =>
  achievements
    .reduce(
      (total, achievement) =>
        total + (toInt(achievement.querySelector(`[${attribute}]`)?.getAttribute(attribute)) ?? 0),
      0
    )
    .toString();

// Shows a header stat (its number, in the span beside its icon) as won/total, e.g. 3,819/3,819; returns what puts the
// site's own text back
const showProgress = (header: Element, selector: string, total: string, won: string | number): (() => void) => {
  const value = header.querySelector(selector)?.querySelector('span');
  if (!value) {
    return () => undefined;
  }

  const was = value.textContent;
  value.textContent = `${(toInt(won) ?? 0).toLocaleString('en-US')}/${total}`;

  return () => {
    value.textContent = was;
  };
};

// Every title is read before any header is written: groupTitle reads innerText, which would lay the page out again
// after each write
const setGroupProgress = (headers: HTMLElement[], groups: AchievementGroup[]): (() => void)[] =>
  headers
    .map((header) => [header, groupTitle(header).toLowerCase()] as const)
    .flatMap(([header, title]) => {
      const group = groups.find((candidate) => candidate.title.toLowerCase() === title);

      if (!group) {
        return [];
      }

      const won = group.achievements.filter((achievement) => achievement.classList.contains('w'));
      // All won: the totals as they are
      const allWon = won.length === toInt(group.maxAchievements);

      return [
        showProgress(header, groupStats.taScore, group.maxTAScore, allWon ? group.maxTAScore : sumOf(won, 'data-af')),
        showProgress(
          header,
          groupStats.gamerscore,
          group.maxGamerScore,
          allWon ? group.maxGamerScore : sumOf(won, 'data-bf')
        ),
        showProgress(header, groupStats.achievements, group.maxAchievements, won.length)
      ];
    });

interface IndividualProgressProps {
  // The site's group headers on the page, whose stats it rewrites
  headers: HTMLElement[];
  // Each group's totals and achievements, read from the full list
  groups: AchievementGroup[];
}

// A controller for the site's group headers: while mounted, each header's stats show what was won of its group's
// totals; unmounted, each header gets its own text back. It renders nothing of its own
export const IndividualProgress = ({ headers, groups }: IndividualProgressProps) => {
  useLayoutEffect(() => {
    const putBack = timed('Individual progress: headers', () => setGroupProgress(headers, groups));

    return () => callAll(putBack);
  }, [headers, groups]);

  return null;
};

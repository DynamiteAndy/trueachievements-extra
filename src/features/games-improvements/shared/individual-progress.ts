import { GamesRegex } from '@ta-x-globals';
import { memoizeFetch, updateMemoizedFetch } from '@ta-x-helpers';
import { AchievementGroup } from '@ta-x-types';
import { allConcurrently, insertSeperator, toInt } from '@ta-x-utilities';

const createAchievementGroup = (header: HTMLElement): AchievementGroup => ({
  title: (header.querySelector('h2 a') as HTMLElement).innerText,
  maxTAScore: (header.querySelector('[title="Maximum TrueAchievement"]') as HTMLElement).innerText,
  maxGamerScore: (header.querySelector('[title="Maximum Gamerscore"]') as HTMLElement).innerText,
  maxAchievements: (
    header.querySelector('[title="Maximum achievements"], [title="Maximum Achievements"]') as HTMLElement
  ).innerText,
  achievements: []
});

const getBaseAchievementGroup = (el: HTMLElement): AchievementGroup[] => {
  const baseAchievementHeader = el.querySelector('.pnl-hd.no-pills.no-pr.game:not(.gamer)') as HTMLElement;

  if (!baseAchievementHeader) {
    return [];
  }

  const baseAchievementGroup = createAchievementGroup(baseAchievementHeader);

  if (baseAchievementGroup.title === 'Overall DLC Stats') {
    return [];
  }

  for (let child = el.querySelector('.ach-panels') as HTMLElement; child; child = child.nextSibling as HTMLElement) {
    if (child.tagName !== 'UL') {
      if (child.classList?.contains('pnl-hd')) {
        break;
      }

      continue;
    }

    baseAchievementGroup.achievements = baseAchievementGroup.achievements.concat([
      ...child.querySelectorAll('li')
    ] as HTMLElement[]);
  }

  return [baseAchievementGroup];
};

const getDLCAchievementGroups = async (el: HTMLElement): Promise<AchievementGroup[]> => {
  const achievementGroups: AchievementGroup[] = [];
  const dlcAchievementHeaders = [...el.querySelectorAll('.pnl-hd.dlc')] as HTMLElement[];

  await allConcurrently(
    'individualProgress - Groups',
    dlcAchievementHeaders.map((dlcHeader: HTMLElement) => ({
      name: 'individual-progress-group-dlc-grouping',
      task: async (): Promise<void> => {
        const group = createAchievementGroup(dlcHeader);

        for (let child = dlcHeader.nextSibling as HTMLElement; child; child = child.nextSibling as HTMLElement) {
          if (child.tagName !== 'UL') {
            if (child.classList?.contains('pnl-hd') && child.classList?.contains('dlc')) {
              break;
            }

            continue;
          }

          group.achievements = group.achievements.concat([...child.querySelectorAll('li')] as HTMLElement[]);
        }

        achievementGroups.push(group);
      }
    })),
    5
  );

  return achievementGroups;
};

const getAchievementGroups = async (el: HTMLElement): Promise<AchievementGroup[]> => {
  const achievementGroups = await allConcurrently('Game Improvements Individual Progress', [
    {
      name: 'game-improvements-individual-progress-base',
      task: async () => getBaseAchievementGroup(el)
    },
    {
      name: 'game-improvements-individual-progress-dlc',
      task: async () => getDLCAchievementGroups(el)
    }
  ]);

  return achievementGroups.flat();
};

const setGroupProgress = async (groups: AchievementGroup[]): Promise<void> => {
  const achievementGroups = [
    ...document.querySelectorAll('.pnl-hd.game:not(.gamer):not([data-gid]), .pnl-hd.dlc')
  ] as HTMLElement[];

  await allConcurrently(
    'individualProgress - Groups',
    achievementGroups.map((achievementGroup: HTMLElement) => ({
      name: 'individual-progress-group',
      task: async (): Promise<void> => {
        const groupName = (achievementGroup.querySelector('h2 a') as HTMLElement).innerText;
        const grouping = groups.find((groups) => groups.title.toLowerCase() === groupName.toLowerCase());

        if (!grouping) {
          return;
        }

        const maxTAScore = achievementGroup.querySelector('[title="Maximum TrueAchievement"]') as HTMLElement;
        const maxGamerscore = achievementGroup.querySelector('[title="Maximum Gamerscore"]') as HTMLElement;
        const maxAchievements = achievementGroup.querySelector(
          '[title="Maximum achievements"], [title="Maximum Achievements"]'
        ) as HTMLElement;

        const wonAchievements = grouping.achievements.filter((achievement) => achievement.classList.contains('w'));
        const wonTrueAchievementScore =
          wonAchievements.length !== toInt(grouping.maxAchievements)
            ? wonAchievements
                .reduce((totalTAScore, achievement) => {
                  const TAScore = toInt(achievement.querySelector('[data-af]')?.getAttribute('data-af'));
                  return totalTAScore + TAScore;
                }, 0)
                .toString()
            : grouping.maxTAScore;

        const wonGamerscore =
          wonAchievements.length !== toInt(grouping.maxAchievements)
            ? wonAchievements
                .reduce((totalGamerscore, achievement) => {
                  const gamerscore = toInt(achievement.querySelector('[data-bf]')?.getAttribute('data-bf'));
                  return totalGamerscore + gamerscore;
                }, 0)
                .toString()
            : grouping.maxGamerScore;

        maxTAScore.innerHTML = maxTAScore.innerHTML.replace(
          grouping.maxTAScore,
          `${insertSeperator(wonTrueAchievementScore)}/${grouping.maxTAScore}`
        );
        maxGamerscore.innerHTML = maxGamerscore.innerHTML.replace(
          grouping.maxGamerScore,
          `${insertSeperator(wonGamerscore)}/${grouping.maxGamerScore}`
        );
        maxAchievements.innerHTML = maxAchievements.innerHTML.replace(
          grouping.maxAchievements,
          `${insertSeperator(wonAchievements.length)}/${grouping.maxAchievements}`
        );
      }
    })),
    5
  );
};

export const applyIndividualProgress = async () => {
  const status = document.querySelector('#rdoAllAchievements') as HTMLSelectElement;

  let mainElement: HTMLElement;
  if (!status?.hasAttribute('checked')) {
    const gameResponse = GamesRegex.Test.challengesUrl()
      ? await memoizeFetch(window.location.href.replace('/challenges', '/achievements'))
      : await memoizeFetch(window.location.href);
    const gameDocument = new DOMParser().parseFromString(gameResponse, 'text/html');

    mainElement = gameDocument.querySelector('main');
  } else {
    updateMemoizedFetch(window.location.href, document.documentElement.outerHTML);

    mainElement = document.querySelector('main');
  }

  const achievementGroups = await getAchievementGroups(mainElement);
  await setGroupProgress(achievementGroups);
};

export default { applyIndividualProgress };

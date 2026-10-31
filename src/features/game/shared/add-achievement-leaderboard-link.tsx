import { yieldToPage } from '@ta-x-lib';
import { mount } from '@ta-x-page';

import { AchievementLeaderboardLink } from './AchievementLeaderboardLink';
import styles from './styles';

// Rows linked per task: a long list linked in one go is a long task, so the page waits for input and paint in
// between
export const rowsPerTask = 100;

const linkToLeaderboard = (achievement: HTMLElement): void => {
  const title = achievement.querySelector<HTMLAnchorElement>('.title');
  const progress = achievement.querySelector<HTMLDivElement>('.progress-bar');

  if (!title || !progress) {
    return;
  }

  // Both the bar and its link carry it: the CSS shows one or the other by screen width
  progress.classList.add(styles.achievementLeaderboardLinks);

  mount(
    <AchievementLeaderboardLink
      progress={progress}
      href={`${new URL(title.href).pathname}/gamers`}
      achievement={title.textContent.trim()}
    />,
    achievement,
    progress.nextElementSibling
  );
};

// Each achievement's progress bar links to its leaderboard: a copy of the bar as a link goes right after it. Started
// once the list is parsed (the achievements, challenges and DLC entry points), a task of its own per `rowsPerTask` rows
export const addAchievementLeaderboardLink = async (): Promise<void> => {
  const achievements = [...document.querySelectorAll<HTMLElement>('main ul.ach-panels li:not(.heading)')];

  for (let start = 0; start < achievements.length; start += rowsPerTask) {
    await yieldToPage();
    achievements.slice(start, start + rowsPerTask).forEach(linkToLeaderboard);
  }
};

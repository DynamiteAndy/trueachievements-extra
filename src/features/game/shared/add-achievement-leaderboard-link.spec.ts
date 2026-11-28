import { find, required, setHtml, tick } from '@ta-x-test';

import { addAchievementLeaderboardLink, rowsPerTask } from './add-achievement-leaderboard-link';
import styles from './styles';

describe('game/shared/add-achievement-leaderboard-link', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/game-achievements/won-no-dlc.html', {
      url: 'https://www.trueachievements.com/game/Example/achievements'
    });
  });

  test("should put a link to each achievement's leaderboard right after its progress bar", async () => {
    const achievements = [...document.querySelectorAll<HTMLElement>('main ul.ach-panels li:not(.heading)')];

    await addAchievementLeaderboardLink();

    expect(achievements).toHaveLength(4);
    achievements.forEach((achievement) => {
      const progress = find<HTMLElement>('div.progress-bar', achievement);
      const link = progress.nextElementSibling as HTMLAnchorElement;
      const title = find<HTMLAnchorElement>('.title', achievement);

      expect(link.tagName).toBe('A');
      expect(link.getAttribute('href')).toBe(`${new URL(title.href).pathname}/gamers`);
      // Both carry the class the CSS uses to show one or the other by screen width
      expect(progress.classList).toContain(styles.achievementLeaderboardLinks);
      expect(link.className).toBe(progress.className);
      expect(link.getAttribute('data-af')).toBe(progress.getAttribute('data-af'));
      expect(link.innerHTML).toBe(progress.innerHTML);
      // The bar has no text: named as the site's own leaderboard link is titled, with the achievement and its figures
      expect(link.getAttribute('aria-label')).toBe(
        `Gamers with ${title.textContent.trim()}, ${progress.getAttribute('data-af')}`
      );
    });
  });

  test('should skip an achievement without a title, and link the rest', async () => {
    const achievements = [...document.querySelectorAll<HTMLElement>('main ul.ach-panels li:not(.heading)')];
    find('.title', achievements[0]).remove();

    await addAchievementLeaderboardLink();

    expect(achievements.map((achievement) => achievement.querySelector('a.progress-bar, a[data-af]') !== null)).toEqual(
      achievements.map((_, index) => index !== 0)
    );
  });

  test('should skip an achievement without a progress bar, and link the rest', async () => {
    const achievements = [...document.querySelectorAll<HTMLElement>('main ul.ach-panels li:not(.heading)')];
    find('.progress-bar', achievements[0]).remove();

    await addAchievementLeaderboardLink();

    expect(
      achievements.map((achievement) => achievement.querySelector(`a.${styles.achievementLeaderboardLinks}`) !== null)
    ).toEqual(achievements.map((_, index) => index !== 0));
  });

  // It starts with the other list features once the page is parsed, so it waits for a task of its own. And a long list
  // in one go is a long task, so the page gets a turn between chunks
  test('should leave the list alone until it has a task of its own, then link a chunk of rows per task', async () => {
    // A list of its own: copies of one of the fixture's rows
    const row = [...document.querySelectorAll('main ul.ach-panels li:not(.heading)')].find(
      (li) => li.querySelector('.title') && li.querySelector('.progress-bar')
    );
    const list = document.createElement('ul');
    list.className = 'ach-panels';
    list.append(...Array.from({ length: rowsPerTask + 50 }, () => required(row).cloneNode(true)));
    find('main').replaceChildren(list);
    const linked = (): number => document.querySelectorAll(`a.${styles.achievementLeaderboardLinks}`).length;

    const adding = addAchievementLeaderboardLink();

    expect(linked()).toBe(0);

    await tick();

    expect(linked()).toBe(rowsPerTask);

    await adding;

    expect(linked()).toBe(rowsPerTask + 50);
  });
});

import * as taxFetch from '@ta-x-fetch';
import { fetchDocumentsThroughMemoizeFetch, readFixture, readFixtureDocument, required } from '@ta-x-test';

import { getGameAchievements } from './game-achievements';

describe('staff/walkthrough/shared/game-achievements', () => {
  const achievementsPage = readFixture('@ta-x-test-views/game-achievements/blud.html');
  const sprite = 'https://www.trueachievements.com/smaps/29337_G12914_1_1.jpg';

  beforeEach(() => {
    fetchDocumentsThroughMemoizeFetch();
  });

  test("should read the game's achievements from its achievements page, not the game hub", async () => {
    const memoizeFetch = vi.spyOn(taxFetch, 'memoizeFetch').mockResolvedValue(achievementsPage);

    await getGameAchievements('https://www.trueachievements.com/game/BLUD/');

    expect(memoizeFetch).toHaveBeenCalledExactlyOnceWith('https://www.trueachievements.com/game/BLUD/achievements');
  });

  test('should list each achievement with its title, description, id, link and sprite icon', async () => {
    vi.spyOn(taxFetch, 'memoizeFetch').mockResolvedValue(achievementsPage);

    const achievements = await getGameAchievements('https://www.trueachievements.com/game/BLUD');

    expect(achievements.map(({ link, ...achievement }) => [achievement, link.getAttribute('href')])).toEqual([
      [
        {
          title: 'No Filter',
          description: 'Take Selifes with everyone you can.',
          id: '434650',
          icon: { sprite, index: 3 }
        },
        '/a434650/no-filter-achievement#96119'
      ],
      [
        {
          title: 'Token Collector',
          description: 'Find the first token in the game',
          id: '434651',
          icon: { sprite, index: 4 }
        },
        '/a434651/token-collector-achievement#96119'
      ],
      [
        {
          title: 'Duck Face',
          description: "Like you *wouldn't* take selfies with all of the animals.",
          id: '434666',
          icon: { sprite, index: 19 }
        },
        '/a434666/duck-face-achievement#96119'
      ],
      [
        {
          title: 'Gamer Grrrrrl',
          description: 'Beat Fantasy Adventure II.',
          id: '434685',
          icon: { sprite, index: 38 }
        },
        '/a434685/gamer-grrrrrl-achievement#96119'
      ]
    ]);
    expect(achievements[0].link.className).toBe('title');
  });

  test('should leave out a row with no title link, and still read the others', async () => {
    // The first achievement's row without its title link
    const page = readFixtureDocument('@ta-x-test-views/game-achievements/blud.html');
    required(page.querySelector('main ul.ach-panels li a.title')).remove();
    vi.spyOn(taxFetch, 'memoizeFetch').mockResolvedValue(page.documentElement.outerHTML);

    const achievements = await getGameAchievements('https://www.trueachievements.com/game/BLUD');

    expect(achievements).toHaveLength(3);
    expect(achievements.map(({ title }) => title)).not.toContain('No Filter');
  });

  test("should leave out the icon when the page's sprite sheets can't be found", async () => {
    vi.spyOn(taxFetch, 'memoizeFetch').mockResolvedValue(
      achievementsPage.replace(/<style>\s*\.sms[\s\S]*?<\/style>/, '')
    );

    const achievements = await getGameAchievements('https://www.trueachievements.com/game/BLUD');

    expect(achievements.map(({ icon }) => icon)).toEqual([undefined, undefined, undefined, undefined]);
  });
});

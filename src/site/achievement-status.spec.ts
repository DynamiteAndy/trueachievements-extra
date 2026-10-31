import { readFixtureDocument } from '@ta-x-test';

import { allAchievementsShown, wonAchievementsShown } from './achievement-status';

describe('site/achievement-status', () => {
  test.each([
    { name: 'an achievements page set to All', view: 'game-achievements/won-with-dlc.html', expected: true },
    {
      name: 'an achievements page set to Won',
      view: 'game-achievements/won-with-dlc-won-status.html',
      expected: false
    },
    {
      name: 'an achievements page set to Not Won',
      view: 'game-achievements/won-with-dlc-not-won-status.html',
      expected: false
    },
    { name: 'a DLC page set to All', view: 'game-dlc/won.html', expected: true },
    { name: 'a DLC page set to Won', view: 'game-dlc/won-won-status.html', expected: false },
    { name: 'a challenges page, with no status to set', view: 'game-challenges/won-with-dlc.html', expected: null }
  ])('should read $name as $expected', ({ view, expected }) => {
    expect(allAchievementsShown(readFixtureDocument(`@ta-x-test-views/${view}`))).toBe(expected);
  });

  test.each([
    { name: 'an achievements page set to Won', view: 'game-achievements/won-with-dlc-won-status.html', expected: true },
    { name: 'a DLC page set to Won', view: 'game-dlc/won-won-status.html', expected: true },
    { name: 'an achievements page set to All', view: 'game-achievements/won-with-dlc.html', expected: false },
    {
      name: 'an achievements page set to Not Won',
      view: 'game-achievements/won-with-dlc-not-won-status.html',
      expected: false
    },
    { name: 'a challenges page, with no status to set', view: 'game-challenges/won-with-dlc.html', expected: false }
  ])('should read $name as showing only the won achievements: $expected', ({ view, expected }) => {
    expect(wonAchievementsShown(readFixtureDocument(`@ta-x-test-views/${view}`))).toBe(expected);
  });
});

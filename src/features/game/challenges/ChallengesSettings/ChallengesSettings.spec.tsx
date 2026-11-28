import { getAccordions, getSettings, setSettings, shownSettings } from '@ta-x-test';

import { ChallengesSettings } from './ChallengesSettings';

describe('game/challenges/ChallengesSettings', () => {
  test('should show every setting while the settings it depends on are on, each saving to its own', () => {
    setSettings({
      'game.challenges.overrideAchievementsIndividualProgress': true,
      'game.challenges.defaultStatus': true
    });

    expect(getSettings(<ChallengesSettings />)).toEqual([
      [
        'ta-x-game-challenges-override-achievements-individual-progress',
        'game.challenges.overrideAchievementsIndividualProgress'
      ],
      ['ta-x-game-challenges-individual-progress', 'game.challenges.individualProgress'],
      ['ta-x-game-challenges-default-status', 'game.challenges.defaultStatus'],
      ['ta-x-game-challenges-default-status-value', 'game.challenges.defaultStatusValue']
    ]);
  });

  test('should put them in an accordion', () => {
    expect(getAccordions(<ChallengesSettings />)).toEqual(['Challenges']);
  });

  test('should leave out the settings that depend on the override and the default status while that is off', () => {
    expect(shownSettings(<ChallengesSettings />)).toEqual([
      'ta-x-game-challenges-override-achievements-individual-progress',
      'ta-x-game-challenges-default-status'
    ]);
  });
});

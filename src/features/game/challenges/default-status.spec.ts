import { arriveFrom, setHtml, setSettings } from '@ta-x-test';

import { recordClickedRadios } from '../shared/default-status.spec-helpers';

import { changeToDefaultStatus } from './default-status';

describe('game/challenges/default-status', () => {
  const page = 'https://www.trueachievements.com/game/Sea-of-Thieves/challenges';
  let clicked: string[];

  // A game's challenges, arrived at from its hub (each radio's click is a post back on the site)
  const arrive = (fixture: string): void => {
    setHtml(`@ta-x-test-views/game-challenges/${fixture}`, { url: page });
    arriveFrom('https://www.trueachievements.com/game/Sea-of-Thieves');
    clicked = recordClickedRadios();
  };

  const defaultTo = (value: string): void =>
    setSettings({
      'game.challenges.defaultStatus': true,
      'game.challenges.defaultStatusValue': value
    });

  test('should leave the filter alone while the default status is off', async () => {
    setSettings({ 'game.challenges.defaultStatusValue': 'rdoWonChallenges' });
    arrive('won-with-dlc.html');

    expect(await changeToDefaultStatus()).toBe(false);
    expect(clicked).toEqual([]);
  });

  test('should pick the default when a challenge is not won yet', async () => {
    defaultTo('rdoWonChallenges');
    arrive('won-with-dlc.html');

    expect(await changeToDefaultStatus()).toBe(true);
    expect(clicked).toEqual(['rdoWonChallenges']);
  });

  test('should not count the list\'s "Expired Challenges" heading as a challenge not won', async () => {
    // Every challenge in the list is won (the Won filter's list); its heading row is an <li class="heading">, not .w
    defaultTo('rdoNotWonChallenges');
    arrive('won-with-dlc-won-status.html');

    expect(await changeToDefaultStatus()).toBe(false);
    expect(clicked).toEqual([]);
  });
});

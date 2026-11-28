import { arriveFrom, setHtml, setSettings } from '@ta-x-test';

import { recordClickedRadios } from '../shared/default-status.spec-helpers';

import { changeToDefaultStatus } from './default-status';

// The shared default status has its own specs (achievements, challenges); these check what DLC adds: its settings
// inherit the achievements' unless its override is on, and another gamer's page is told apart on the DLC list and on
// one DLC's page.
describe('game/dlc/default-status', () => {
  const list = 'https://www.trueachievements.com/game/Gears-of-War-3/dlc';
  const oneDlc = 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack';
  let clicked: string[];

  // A DLC page arrived at from the game's hub (each radio's click is a post back on the site). The fixture has the
  // site's status filter with All selected and one achievement not won
  const arrive = (url: string, fixture = 'won.html'): void => {
    setHtml(`@ta-x-test-views/game-dlc/${fixture}`, { url });
    arriveFrom('https://www.trueachievements.com/game/Gears-of-War-3');
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');
    clicked = recordClickedRadios();
  };

  // The achievements' default status, which DLC inherits without its override
  const achievementsDefault = (value: string): Record<string, unknown> => ({
    'game.achievements.defaultStatus': true,
    'game.achievements.defaultStatusValue': value
  });

  // With a status chosen that isn't the page's, so it's the setting being off that stops it
  test('should leave the filter alone while the default status is off', async () => {
    setSettings({
      ...achievementsDefault('rdoWonAchievements'),
      'game.achievements.defaultStatus': false
    });
    arrive(list);

    expect(await changeToDefaultStatus()).toBe(false);
    expect(clicked).toEqual([]);
  });

  test("should use the achievements' default status without its own override", async () => {
    setSettings(achievementsDefault('rdoWonAchievements'));
    arrive(list);

    expect(await changeToDefaultStatus()).toBe(true);
    expect(clicked).toEqual(['rdoWonAchievements']);
  });

  test('should use its own default status with its override on', async () => {
    setSettings({
      ...achievementsDefault('rdoWonAchievements'),
      'game.dlc.overrideAchievementsPageSettings': true,
      'game.dlc.defaultStatus': true,
      'game.dlc.defaultStatusValue': 'rdoNotWonAchievements'
    });
    arrive(oneDlc);

    expect(await changeToDefaultStatus()).toBe(true);
    expect(clicked).toEqual(['rdoNotWonAchievements']);
  });

  // Its own status isn't the page's either, so it's its own default being off that stops it
  test("should leave the filter alone with its override on and its own default off, though the achievements' is on", async () => {
    setSettings({
      ...achievementsDefault('rdoWonAchievements'),
      'game.dlc.overrideAchievementsPageSettings': true,
      'game.dlc.defaultStatus': false,
      'game.dlc.defaultStatusValue': 'rdoNotWonAchievements'
    });
    arrive(list);

    expect(await changeToDefaultStatus()).toBe(false);
    expect(clicked).toEqual([]);
  });

  test.each([
    { name: 'the DLC list', url: `${list}?gamerid=12345`, expected: [] },
    { name: 'the DLC list, their own', url: `${list}?gamerid=52877`, expected: ['rdoWonAchievements'] }
  ])("should only pick it on the gamer's own DLC: $name", async ({ url, expected }) => {
    setSettings(achievementsDefault('rdoWonAchievements'));
    arrive(url);

    expect(await changeToDefaultStatus()).toBe(expected.length > 0);
    expect(clicked).toEqual(expected);
  });
});

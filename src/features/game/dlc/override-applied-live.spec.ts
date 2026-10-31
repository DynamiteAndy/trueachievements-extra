import { isAppliedLive, settings } from '@ta-x-storage';
import { setHtml, setSettings } from '@ta-x-test';

import { overrideAppliedLive } from './override-applied-live';

const { dlc } = settings.game;

// The DLC override also switches the default status, which applies only on arrival, so it counts as live only while
// neither page's default status is on
describe('game/dlc/override-applied-live', () => {
  const live = (): boolean => isAppliedLive(dlc.overrideAchievementsPageSettings);
  const open = (url: string) => setHtml('@ta-x-test-views/game-dlc/won.html', { url });
  // Starts it, stopping it when the test ends
  const start = (): void => {
    onTestFinished(overrideAppliedLive());
  };

  test.each([
    {
      name: 'should register the override as applied live while neither default status is on',
      own: false,
      parent: false,
      expected: true
    },
    {
      name: "should leave it to the notice while the DLC page's own default status is on",
      own: true,
      parent: false,
      expected: false
    },
    {
      name: "should leave it to the notice while the achievements page's default status is on",
      own: false,
      parent: true,
      expected: false
    }
  ])('$name', ({ own, parent, expected }) => {
    open('https://www.trueachievements.com/game/Gears-of-War-3/dlc');
    setSettings({ 'game.dlc.defaultStatus': own, 'game.achievements.defaultStatus': parent });

    start();

    expect(live()).toBe(expected);
  });

  test('should follow either default status as it changes', () => {
    open('https://www.trueachievements.com/game/Gears-of-War-3/dlc');
    setSettings({
      'game.dlc.defaultStatus': false,
      'game.achievements.defaultStatus': false
    });
    start();

    const seen = [live()];
    setSettings({ 'game.achievements.defaultStatus': true });
    seen.push(live());
    setSettings({ 'game.dlc.defaultStatus': true });
    seen.push(live());
    setSettings({ 'game.achievements.defaultStatus': false });
    seen.push(live());
    setSettings({ 'game.dlc.defaultStatus': false });
    seen.push(live());

    expect(seen).toEqual([true, false, false, false, true]);
  });

  test('should unregister it once stopped', () => {
    open('https://www.trueachievements.com/game/Gears-of-War-3/dlc');
    setSettings({
      'game.dlc.defaultStatus': false,
      'game.achievements.defaultStatus': false
    });
    const stop = overrideAppliedLive();

    stop();

    expect(live()).toBe(false);
  });
});

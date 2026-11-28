import * as taxLib from '@ta-x-lib';
import { isAppliedLive, settings } from '@ta-x-storage';
import { changeSettingLive, expectAppliesLive, find, setHtml, setSettings, tick } from '@ta-x-test';

import styles from '../shared/styles';

import { collapsibleGroups } from './collapsible-groups';

const { achievements, dlc } = settings.game;

// The gate in front of the shared collapsible groups (their own spec covers the buttons): the setting, inherited from
// the achievements' unless its override is on, applied live. Only the DLC list runs it (dlc/index.ts leaves one DLC's
// page, a single group, out). The fixture's groups are the shared spec's, with the DLC list's address.
describe('game/dlc/collapsible-groups', () => {
  const list = 'https://www.trueachievements.com/game/Human-Fall-Flat/dlc';
  const applied = (): boolean => find('main').classList.contains(styles.collapsibleGroups);
  const main = (): string => find('main').outerHTML;
  const open = (url: string) => setHtml('@ta-x-test-views/game-achievements/human-fall-flat-dlc-groups.html', { url });
  // Starts it, stopping it when the test ends, with every group done at once (each waits for a task of its own)
  const start = async (): Promise<void> => {
    vi.spyOn(taxLib, 'yieldToPage').mockResolvedValue(undefined);
    onTestFinished(collapsibleGroups());
    await tick();
  };

  test("should do nothing with its override on and its own setting off, though the achievements' is on", async () => {
    open(list);
    setSettings({
      'game.achievements.collapsibleGroups': true,
      'game.dlc.overrideAchievementsPageSettings': true,
      'game.dlc.collapsibleGroups': false
    });

    await start();

    expect(applied()).toBe(false);
  });

  describe('applied live', () => {
    beforeEach(() => open(list));

    test("should apply the achievements' setting live while the override is off", async () => {
      setSettings({ 'game.achievements.collapsibleGroups': false });
      await start();

      await expectAppliesLive(achievements.collapsibleGroups, main);
    });

    test('should apply its own setting live while the override is on', async () => {
      setSettings({
        'game.dlc.overrideAchievementsPageSettings': true,
        'game.dlc.collapsibleGroups': false
      });
      await start();

      await expectAppliesLive(dlc.collapsibleGroups, main);
    });

    test("should follow the override live, giving the site's rows back when it picks a setting that's off", async () => {
      setSettings({
        'game.achievements.collapsibleGroups': true,
        'game.dlc.collapsibleGroups': false
      });
      const before = main();
      await start();
      const wrapped = main();

      await changeSettingLive(dlc.overrideAchievementsPageSettings, true);
      expect(main()).toBe(before);

      await changeSettingLive(dlc.overrideAchievementsPageSettings, false);
      expect(main()).toBe(wrapped);
    });

    test('should register both settings it picks between as applied live, and neither once stopped', () => {
      const live = () => [dlc.collapsibleGroups, achievements.collapsibleGroups].map(isAppliedLive);
      const stop = collapsibleGroups();

      expect(live()).toEqual([true, true]);

      stop();

      expect(live()).toEqual([false, false]);
    });
  });
});

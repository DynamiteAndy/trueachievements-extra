import * as taxLib from '@ta-x-lib';
import { isAppliedLive, settings } from '@ta-x-storage';
import { changeSettingLive, expectAppliesLive, find, setHtml, setSettings, tick } from '@ta-x-test';

import styles from '../shared/styles';

import { collapsibleGroups } from './collapsible-groups';

const { achievements } = settings.game;

// The gate in front of the shared collapsible groups (their own spec covers the buttons): the setting, applied live,
// and a page with DLC groups to collapse
describe('game/achievements/collapsible-groups', () => {
  const applied = (): boolean => find('main').classList.contains(styles.collapsibleGroups);
  const main = (): string => find('main').outerHTML;
  // Starts it, stopping it when the test ends. Each group waits for a task of its own, so `waits` says whether they do
  // here (else they're all done at once)
  const start = async ({ waits = false } = {}): Promise<void> => {
    if (!waits) {
      vi.spyOn(taxLib, 'yieldToPage').mockResolvedValue(undefined);
    }
    onTestFinished(collapsibleGroups());
    await tick();
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/game-achievements/human-fall-flat-dlc-groups.html', {
      url: 'https://www.trueachievements.com/game/Human-Fall-Flat/achievements'
    });
  });

  test('should apply live on a game without DLC, with nothing to collapse when turned on', async () => {
    setHtml('@ta-x-test-views/game-achievements/won-no-dlc.html');
    setSettings({ 'game.achievements.collapsibleGroups': false });
    await start();
    const served = main();

    expect(isAppliedLive(achievements.collapsibleGroups)).toBe(true);
    await changeSettingLive(achievements.collapsibleGroups, true);

    expect(applied()).toBe(false);
    expect(main()).toBe(served);
  });

  test("should apply live: on, off and on again from the menu, off giving the site's rows back exactly", async () => {
    setSettings({ 'game.achievements.collapsibleGroups': false });
    await start();
    expect(isAppliedLive(achievements.collapsibleGroups)).toBe(true);

    await expectAppliesLive(achievements.collapsibleGroups, main);
  });

  test('should wrap no more groups once turned off part way, giving back those it had', async () => {
    setSettings({ 'game.achievements.collapsibleGroups': false });
    await start({ waits: true });
    const before = main();

    // On, and off once the first group is wrapped (each later one waits for a task of its own)
    setSettings({ 'game.achievements.collapsibleGroups': true });
    await tick();
    expect(applied()).toBe(true);
    await changeSettingLive(achievements.collapsibleGroups, false);

    expect(main()).toBe(before);
  });
});

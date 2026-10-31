import { settings } from '@ta-x-storage';
import { changeSettingLive, expectAppliesLive, find, required, setHtml, setSettings, tick } from '@ta-x-test';
import { SearchAndFilterButtonStyles } from '@ta-x-ui';

import { addGroupByGameButton } from './add-group-by-game-button';
import styles from './styles';

describe('gamer/achievements/add-group-by-game-button', () => {
  // Runs it, stopping it when the test ends
  const run = async (): Promise<void> => {
    onTestFinished(addGroupByGameButton());
    await tick();
  };
  const enable = (): void => {
    setSettings({ 'gamer.achievements.addGroupByGameButton': true });
  };
  const games = (): (string | null)[] =>
    [...document.querySelectorAll('#oAchievementList .gamethumb img')].map((img) => img.getAttribute('alt'));
  const grouped = [
    'Ad Infinitum',
    'Ad Infinitum',
    'Dungeon Village',
    'The Sushi Spinnery',
    'The Sushi Spinnery',
    'The Sushi Spinnery'
  ];

  beforeEach(() => {
    setHtml('@ta-x-test-views/gamer-achievements/three-games-interleaved.html');
  });

  test('should append the button after the site filter controls', async () => {
    enable();

    await run();

    const container = find('.search-and-filter');
    expect(required(container.lastElementChild)).toHaveExactClasses([
      'button',
      styles.groupByGameButton,
      SearchAndFilterButtonStyles.searchAndFilterButton
    ]);
    // The site's own clear div, which has other classes on some pages
    expect(required(required(container.lastElementChild).previousElementSibling).classList).toContain('clear');
    expect(container.querySelectorAll(`.${styles.groupByGameButton}`)).toHaveLength(1);
  });

  test('should apply live: on, off and on again from the menu, off giving the page back exactly', async () => {
    setSettings({ 'gamer.achievements.addGroupByGameButton': false });
    await run();

    await expectAppliesLive(settings.gamer.achievements.addGroupByGameButton);
  });

  test("should add a working button, giving the rows back in the site's order when the setting goes off after a click", async () => {
    enable();
    await run();
    const order = games();
    find(`.${styles.groupByGameButton}`).click();
    await tick();
    expect(games()).toEqual(grouped);

    await changeSettingLive(settings.gamer.achievements.addGroupByGameButton, false);

    expect(document.querySelector(`.${styles.groupByGameButton}`)).toBeNull();
    expect(games()).toEqual(order);
  });
});

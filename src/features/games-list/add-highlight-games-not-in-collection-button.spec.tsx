import { settings } from '@ta-x-storage';
import { changeSettingLive, expectAppliesLive, find, required, setHtml, setSettings, tick } from '@ta-x-test';
import { SearchAndFilterButtonStyles } from '@ta-x-ui';

import { addHighlightGamesNotInCollectionButton } from './add-highlight-games-not-in-collection-button';
import styles from './styles';

describe('games-list/add-highlight-games-not-in-collection-button', () => {
  // Runs it, stopping it when the test ends
  const run = async (): Promise<void> => {
    onTestFinished(addHighlightGamesNotInCollectionButton());
    await tick();
  };
  const enable = (): void => {
    setSettings({ 'gamesList.addHighlightGamesNotInCollectionButton': true });
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/games-list/in-and-not-in-collection.html');
  });

  test('should append the button after the site filter controls', async () => {
    enable();

    await run();

    const container = find('.search-and-filter');
    expect(required(container.lastElementChild)).toHaveExactClasses([
      'button',
      styles.highlightGamesButton,
      SearchAndFilterButtonStyles.searchAndFilterButton
    ]);
    // The site's own clear div, which has other classes on some pages
    expect(required(required(container.lastElementChild).previousElementSibling).classList).toContain('clear');
    expect(container.querySelectorAll(`.${styles.highlightGamesButton}`)).toHaveLength(1);
  });

  test('should apply live: on, off and on again from the menu, off giving the page back exactly', async () => {
    setSettings({ 'gamesList.addHighlightGamesNotInCollectionButton': false });
    await run();

    await expectAppliesLive(settings.gamesList.addHighlightGamesNotInCollectionButton);
  });

  test('should add a working button, giving the rows their striping back when the setting goes off after a click', async () => {
    enable();
    await run();
    const striping = required(document.getElementById('tr6066')).className;
    find(`.${styles.highlightGamesButton}`).click();
    await tick();
    expect(required(document.getElementById('tr6066')).className).toBe('green');

    await changeSettingLive(settings.gamesList.addHighlightGamesNotInCollectionButton, false);

    expect(document.querySelector(`.${styles.highlightGamesButton}`)).toBeNull();
    expect(required(document.getElementById('tr6066')).className).toBe(striping);
  });
});

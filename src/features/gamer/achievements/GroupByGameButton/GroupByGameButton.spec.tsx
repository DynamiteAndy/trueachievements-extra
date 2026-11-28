import { click, elementOf, find, mountForTest, required, setHtml } from '@ta-x-test';
import { SearchAndFilterButtonStyles } from '@ta-x-ui';
import { act } from 'preact/test-utils';

import styles from '../styles';

import { GroupByGameButton } from './GroupByGameButton';

describe('GroupByGameButton', () => {
  const rows = (): HTMLTableRowElement[] => [...document.querySelectorAll<HTMLTableRowElement>('#oAchievementList tr')];
  const games = (): string[] =>
    rows()
      .slice(1)
      .map((tr) => find('.gamethumb img', tr).getAttribute('alt') ?? '');
  const achievements = (): string[] =>
    rows()
      .slice(1)
      .map((tr) => find('.achthumb img', tr).getAttribute('alt') ?? '');

  const mountButton = () => mountForTest(<GroupByGameButton />, find('.search-and-filter'));

  beforeEach(() => {
    setHtml('@ta-x-test-views/gamer-achievements/three-games-interleaved.html');
  });

  test('should render a site button with its style classes', () => {
    const root = mountButton();

    expect(required(root.element).tagName).toBe('A');
    expect([...required(root.element).classList]).toEqual([
      'button',
      styles.groupByGameButton,
      SearchAndFilterButtonStyles.searchAndFilterButton
    ]);
    expect(required(root.element).textContent.trim()).toBe('Group achievements by game');
  });

  test('should group rows by game and restripe them when clicked', async () => {
    await act(() => required(mountButton().element).click());

    expect(games()).toEqual([
      'Ad Infinitum',
      'Ad Infinitum',
      'Dungeon Village',
      'The Sushi Spinnery',
      'The Sushi Spinnery',
      'The Sushi Spinnery'
    ]);
    expect(
      rows()
        .slice(1)
        .map((tr) => tr.className)
    ).toEqual(['even', 'odd', 'even', 'odd', 'even', 'odd']);
  });

  // By the language's order, so a name starting in lower case doesn't sort after every capital
  test('should order the games alphabetically whatever their case', async () => {
    document
      .querySelectorAll('#oAchievementList .gamethumb img[alt="Dungeon Village"]')
      .forEach((image) => image.setAttribute('alt', 'eShop Village'));

    await act(() => required(mountButton().element).click());

    expect(games()).toEqual([
      'Ad Infinitum',
      'Ad Infinitum',
      'eShop Village',
      'The Sushi Spinnery',
      'The Sushi Spinnery',
      'The Sushi Spinnery'
    ]);
  });

  test('should keep the existing order of achievements within each game', async () => {
    await act(() => required(mountButton().element).click());

    expect(achievements()).toEqual([
      'Peace',
      'Path of Corruption',
      'Those who mastered Kairobot !',
      'The strongest autonomous sushi robot.',
      'The sushi restaurant that I want to go to at',
      'Sushi goes around everywhere.'
    ]);
  });

  // Its href="#" would otherwise add # to the URL and jump to the top of the page
  test('should stay where it is on the page when clicked', () => {
    expect(click(elementOf(mountButton())).defaultPrevented).toBe(true);
  });

  test('should give the same order and stripes when clicked again', async () => {
    const root = mountButton();
    await act(() => required(root.element).click());
    const firstGames = games();
    const firstAchievements = achievements();

    await act(() => required(root.element).click());

    expect(games()).toEqual(firstGames);
    expect(achievements()).toEqual(firstAchievements);
    expect(
      rows()
        .slice(1)
        .map((tr) => tr.className)
    ).toEqual(['even', 'odd', 'even', 'odd', 'even', 'odd']);
  });

  test("should put the rows back in the site's order and striping when it's removed", async () => {
    const order = achievements();
    const striping = rows().map((tr) => tr.className);
    const root = mountButton();
    await act(() => required(root.element).click());

    await act(() => root.unmount());

    expect(achievements()).toEqual(order);
    expect(rows().map((tr) => tr.className)).toEqual(striping);
  });
});

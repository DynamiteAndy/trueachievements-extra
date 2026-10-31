import { click, elementOf, find, mountForTest, required, setHtml } from '@ta-x-test';
import { SearchAndFilterButtonStyles } from '@ta-x-ui';
import { act } from 'preact/test-utils';

import styles from '../styles';

import { HighlightGamesNotInCollectionButton } from './HighlightGamesNotInCollectionButton';

describe('games-list/HighlightGamesNotInCollectionButton', () => {
  const notInCollection = ['tr6066', 'tr9192'];
  const inCollection = ['tr5357', 'tr2151'];
  const rowClass = (id: string): string => required(document.getElementById(id)).className;

  const mountButton = () => mountForTest(<HighlightGamesNotInCollectionButton />, find('.search-and-filter'));

  beforeEach(() => {
    setHtml('@ta-x-test-views/games-list/in-and-not-in-collection.html');
  });

  test('should render a site button with its style classes', () => {
    const root = mountButton();

    expect(required(root.element).tagName).toBe('A');
    expect(required(root.element)).toHaveExactClasses([
      'button',
      styles.highlightGamesButton,
      SearchAndFilterButtonStyles.searchAndFilterButton
    ]);
    expect(required(root.element).textContent.trim()).toBe('Highlight games not in collection');
  });

  test('should highlight the games not in the collection in place of their striping', async () => {
    const root = mountButton();
    await act(() => required(root.element).click());

    expect(notInCollection.map(rowClass)).toEqual(['green', 'green']);
  });

  test('should leave games already in the collection and the header row unchanged', async () => {
    const root = mountButton();
    await act(() => required(root.element).click());

    expect(inCollection.map(rowClass)).toEqual(['odd', 'odd']);
    expect(find('#oGameList tr').className).toBe('NoDrop');
  });

  // Its href="#" would otherwise add # to the URL and jump to the top of the page
  test('should stay where it is on the page when clicked', () => {
    expect(click(elementOf(mountButton())).defaultPrevented).toBe(true);
  });

  test('should leave highlighted rows unchanged when clicked again', async () => {
    const root = mountButton();
    await act(() => required(root.element).click());
    await act(() => required(root.element).click());

    expect(notInCollection.map(rowClass)).toEqual(['green', 'green']);
    expect(inCollection.map(rowClass)).toEqual(['odd', 'odd']);
  });

  test("should give the rows their striping back when it's removed", async () => {
    const striping = notInCollection.map(rowClass);
    const root = mountButton();
    await act(() => required(root.element).click());

    await act(() => root.unmount());

    expect(notInCollection.map(rowClass)).toEqual(striping);
    expect(inCollection.map(rowClass)).toEqual(['odd', 'odd']);
  });
});

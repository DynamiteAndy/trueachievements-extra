import sheet from '@ta-x-scss/index.scss';
import { click, find, hiddenThreads, pressKey, setHtml } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { rootClass } from '../constants';

import attributes from './attributes';
import { hideRow } from './hide-row';
import styles from './styles';

describe('hideRow', () => {
  const toggle = (row: HTMLElement): HTMLElement => find(`.${styles.hideableRow}`, row);

  describe('forum threads', () => {
    const threads = (): HTMLLIElement[] => [...document.querySelectorAll<HTMLLIElement>('.view-board li:not(.header)')];

    // The two threads the forum's thread filter hides with "Xbox sale round-up" (its own spec checks which match),
    // hidden here as it hides them: by their title link
    beforeEach(() => {
      setHtml('@ta-x-test-views/forum-thread-list/game-forum-filter-set.html');
      [1, 3].forEach((index) =>
        hideRow({
          element: find('.desc > div:not(.stack) > p:first-child > a', threads()[index]),
          method: 'forum',
          hiddenBy: 'filter "Xbox sale round-up"'
        })
      );
    });

    test('should hide only the threads it is given', () => {
      expect(hiddenThreads()).toEqual(['shown', 'true', 'shown', 'true']);
    });

    test('should say which filter hid the thread', () => {
      const filterText = find(`.topic > .${styles.filterText}`, threads()[1]);

      expect(filterText.tagName).toBe('P');
      expect(filterText.textContent).toBe('Hidden by filter "Xbox sale round-up"');
      expect(threads()[0].querySelector(`.${styles.filterText}`)).toBeNull();
    });

    test('should add a show/hide toggle at the end of the last post column', () => {
      const lastPost = find('.last', threads()[1]);
      const icons = [...toggle(threads()[1]).children];

      expect(lastPost.lastElementChild).toBe(toggle(threads()[1]));
      expect(toggle(threads()[1]).tagName).toBe('DIV');
      expect(icons.map((icon) => icon.tagName.toLowerCase())).toEqual(['svg', 'svg']);
      expect(icons[0]).toHaveExactClasses([styles.showIcon]);
      expect(icons[1]).toHaveExactClasses([styles.hideIcon]);
      expect(document.querySelectorAll(`.${styles.hideableRow}`)).toHaveLength(2);
    });

    test('should make the toggle a keyboard button saying whether the thread is shown', async () => {
      const thread = threads()[3];

      // Still a div among the site's cells (see HideableRow), with a name, as it has no text
      expect(
        ['role', 'tabindex', 'aria-expanded', 'aria-label'].map((name) => toggle(thread).getAttribute(name))
      ).toEqual([
        'button',
        '0',
        'false',
        `Show or hide ${find('.desc > div:not(.stack) > p:first-child > a', thread).textContent.trim()}`
      ]);

      await act(() => toggle(thread).click());
      expect(toggle(thread).getAttribute('aria-expanded')).toBe('true');
    });

    test.each([
      { name: 'Enter', key: 'Enter' },
      { name: 'Space', key: ' ' }
    ])('should show and hide the thread with $name, without the key or a click going further', async ({ key }) => {
      const thread = threads()[3];
      const rowClick = vi.fn();
      thread.addEventListener('click', rowClick);
      const keyDown = (): KeyboardEvent => pressKey(toggle(thread), key);

      expect(keyDown().defaultPrevented).toBe(true);
      expect(thread.getAttribute(attributes.rowHidden)).toBe('false');

      keyDown();
      expect(thread.getAttribute(attributes.rowHidden)).toBe('true');
      expect(rowClick).not.toHaveBeenCalled();
    });

    test('should show and hide the thread again when the toggle is clicked, without the click going further', async () => {
      const thread = threads()[3];
      const rowClick = vi.fn();
      thread.addEventListener('click', rowClick);

      const event = click(toggle(thread));

      expect(thread.getAttribute(attributes.rowHidden)).toBe('false');
      expect(event.defaultPrevented).toBe(true);
      expect(rowClick).not.toHaveBeenCalled();

      await act(() => toggle(thread).click());
      expect(thread.getAttribute(attributes.rowHidden)).toBe('true');
      expect(threads()[1].getAttribute(attributes.rowHidden)).toBe('true');
    });
  });

  describe('sale table rows', () => {
    const getRow = () => find<HTMLTableRowElement>('table.sale tbody tr');

    beforeEach(() => {
      setHtml('@ta-x-test-views/sale-article/shocktober-groups.html');
    });

    // Hidden at font size 0, the first cell's links would still be reached by Tab and read out, with nothing to see
    test("should hide the first cell's own links (a bundle's too), leaving only the filter text", () => {
      setHtml('@ta-x-test-views/sale-article/owned-picks.html');
      const style = document.createElement('style');
      style.textContent = sheet;
      document.head.append(style);
      document.body.classList.add(rootClass);
      onTestFinished(() => {
        style.remove();
        document.body.classList.remove(rootClass);
      });
      const cell = find('table tbody tr td:first-child:has(.indent)');
      const row = cell.closest('tr') as HTMLTableRowElement;

      hideRow({ element: row, method: 'table', prefix: 'Hide', hiddenBy: 'Owned Items' });

      const links = [...cell.querySelectorAll('a')];
      expect(links.length).toBeGreaterThan(1);
      expect(links.map((link) => getComputedStyle(link).visibility)).toEqual(links.map(() => 'hidden'));
      expect(getComputedStyle(find(`.${styles.filterText}`, cell)).visibility).not.toBe('hidden');
    });

    test('should put the toggle in the last cell and the filter text in the first', () => {
      const row = getRow();

      hideRow({ element: row, method: 'table', prefix: 'Hide', hiddenBy: 'Owned Items' });

      expect(row.getAttribute(attributes.rowHidden)).toBe('true');
      // In a wrapper of its own, beside whatever the site has in that cell (the unobtainable flag)
      const cell = find('td:last-child', row);
      expect(cell.children).toHaveLength(1);
      const toggleCell = find(`:scope > .${styles.toggleCell}`, cell);
      expect(toggleCell.lastElementChild).toBe(toggle(row));
      expect(find(`:scope > .${styles.filterText}`, find('td', row)).textContent).toBe('Hidden by "Hide Owned Items"');
    });

    test("should put the site's own content of the last cell beside the toggle, and back once unmounted", async () => {
      setHtml('@ta-x-test-views/sale-article/unobtainable-picks.html');
      const row = find<HTMLTableRowElement>('table.sale tbody tr:nth-child(2)');
      const cell = find('td:last-child', row);
      const flag = find('img', cell);
      const before = cell.innerHTML;

      const unmount = hideRow({ element: row, method: 'table', prefix: 'Hide', hiddenBy: 'Unobtainable Items' });

      const wrapper = find(`.${styles.toggleCell}`, cell);
      expect([...wrapper.children]).toEqual([flag, toggle(row)]);

      await act(() => unmount());
      expect(cell.innerHTML).toBe(before);
      expect(find('img', cell)).toBe(flag);
    });

    test('should find the row from a cell inside it', () => {
      const row = getRow();

      hideRow({ element: find('td', row), method: 'table', hiddenBy: 'filter "xbox"' });

      expect(row.getAttribute(attributes.rowHidden)).toBe('true');
    });

    test('should keep working when the site moves the row (its sort moves the same rows)', async () => {
      const row = getRow();
      const tbody = find('table.sale tbody');
      const other = document.createElement('tr');
      tbody.append(other);

      hideRow({ element: row, method: 'table', hiddenBy: 'filter "xbox"' });
      tbody.insertBefore(other, row);
      await act(() => toggle(row).click());

      expect(row.getAttribute(attributes.rowHidden)).toBe('false');
      expect([...tbody.children].indexOf(row)).toBe(1);
      expect(row.querySelectorAll(`.${styles.hideableRow}`)).toHaveLength(1);
    });

    describe('a row two features hide (an owned game that is also unobtainable)', () => {
      // As the sales features pass them: the shared start of their setting names, and their own part
      const owned = { prefix: 'Hide', hiddenBy: 'Owned Items' };
      const unobtainable = { prefix: 'Hide', hiddenBy: 'Unobtainable Items' };
      const texts = (row: HTMLElement) =>
        [...row.querySelectorAll(`.${styles.filterText}`)].map((text) => text.textContent);

      test('should give it one toggle, and one line giving every reason', async () => {
        const row = getRow();

        hideRow({ element: row, method: 'table', ...owned });
        hideRow({ element: find('td', row), method: 'table', ...unobtainable });

        expect(row.querySelectorAll(`.${styles.hideableRow}`)).toHaveLength(1);
        expect(texts(row)).toEqual(['Hidden by "Hide Owned Items and Unobtainable Items"']);

        // One click shows it, one more hides it again
        await act(() => toggle(row).click());
        expect(row.getAttribute(attributes.rowHidden)).toBe('false');
        await act(() => toggle(row).click());
        expect(row.getAttribute(attributes.rowHidden)).toBe('true');
      });

      test('should list three reasons with commas', () => {
        const row = getRow();

        hideRow({ element: row, method: 'table', hiddenBy: '"A"' });
        hideRow({ element: row, method: 'table', hiddenBy: '"B"' });
        hideRow({ element: row, method: 'table', hiddenBy: '"C"' });

        expect(texts(row)).toEqual(['Hidden by "A", "B" and "C"']);
      });

      test('should list reasons with a different prefix, or none, separately', () => {
        const row = getRow();

        hideRow({ element: row, method: 'table', ...owned });
        hideRow({ element: row, method: 'table', hiddenBy: 'filter "xbox"' });
        hideRow({ element: row, method: 'table', ...unobtainable });

        expect(texts(row)).toEqual(['Hidden by "Hide Owned Items and Unobtainable Items" and filter "xbox"']);
      });

      test('should keep it hidden by the other feature when one gives it back, and give it back after both', async () => {
        const row = getRow();
        const before = row.innerHTML;

        const unmountOwned = hideRow({ element: row, method: 'table', ...owned });
        const unmountUnobtainable = hideRow({ element: row, method: 'table', ...unobtainable });

        await act(() => unmountOwned());
        expect(row.getAttribute(attributes.rowHidden)).toBe('true');
        expect(texts(row)).toEqual(['Hidden by "Hide Unobtainable Items"']);
        expect(row.querySelectorAll(`.${styles.hideableRow}`)).toHaveLength(1);

        // Giving it back twice does nothing more
        await act(() => unmountOwned());
        await act(() => unmountUnobtainable());
        expect(row.hasAttribute(attributes.rowHidden)).toBe(false);
        expect(row.innerHTML).toBe(before);
      });

      // A's second give-back comes after the row has a new controller (B's): it mustn't drop that one, or C's hide
      // would add a second toggle
      test("should leave a later feature's hide alone when an earlier one gives the row back twice", async () => {
        const row = getRow();

        const unmountA = hideRow({ element: row, method: 'table', hiddenBy: '"A"' });
        await act(() => unmountA());
        hideRow({ element: row, method: 'table', hiddenBy: '"B"' });
        await act(() => unmountA());
        await act(() => {
          hideRow({ element: row, method: 'table', hiddenBy: '"C"' });
        });

        expect(row.querySelectorAll(`.${styles.hideableRow}`)).toHaveLength(1);
        expect(texts(row)).toEqual(['Hidden by "B" and "C"']);
      });
    });
  });
});

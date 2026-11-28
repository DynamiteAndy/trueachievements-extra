import { logger } from '@ta-x-lib';
import * as taxPage from '@ta-x-page';
import { settings } from '@ta-x-storage';
import {
  click,
  elementOf,
  expectAppliesLive,
  find,
  mountForTest,
  pressKey,
  required,
  setHtml,
  setSettings,
  tick
} from '@ta-x-test';

import { addSearchAndFilterButton } from './add-search-and-filter-button';
import { SearchAndFilterButton } from './SearchAndFilterButton';
import styles from './styles';

describe('ui/search-and-filter-button', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/gamer-achievements/three-games-interleaved.html');
  });

  describe('SearchAndFilterButton', () => {
    test("should render a site button with the feature's classes, then the shared one", () => {
      const root = mountForTest(
        <SearchAndFilterButton class="feature" onClick={() => undefined}>
          Do it
        </SearchAndFilterButton>,
        find('.search-and-filter')
      );

      expect(elementOf(root).tagName).toBe('A');
      expect(elementOf(root).getAttribute('href')).toBe('#');
      expect(elementOf(root)).toHaveExactClasses(['button', 'feature', styles.searchAndFilterButton]);
      expect(elementOf(root).textContent).toBe('Do it');
    });

    test("should do its job when clicked, without the link's jump", () => {
      const onClick = vi.fn();
      const root = mountForTest(
        <SearchAndFilterButton class="feature" onClick={onClick}>
          Do it
        </SearchAndFilterButton>,
        find('.search-and-filter')
      );

      const event = click(elementOf(root));

      expect(onClick).toHaveBeenCalledOnce();
      expect(event.defaultPrevented).toBe(true);
    });

    test.each([
      { name: 'Enter', key: 'Enter' },
      { name: 'Space', key: ' ' }
    ])('should do its job with $name, as a button', ({ key }) => {
      const onClick = vi.fn();
      const root = mountForTest(
        <SearchAndFilterButton class="feature" onClick={onClick}>
          Do it
        </SearchAndFilterButton>,
        find('.search-and-filter')
      );

      expect(elementOf(root).getAttribute('role')).toBe('button');
      expect(pressKey(elementOf(root), key).defaultPrevented).toBe(true);
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe('addSearchAndFilterButton', () => {
    // Any boolean setting will do: one of its users'
    const on = settings.gamer.achievements.addGroupByGameButton;
    const button = (
      <SearchAndFilterButton class="feature" onClick={() => undefined}>
        Do it
      </SearchAndFilterButton>
    );
    const ours = (): HTMLElement | null => document.querySelector('.feature');

    beforeEach(() => {
      setSettings({ 'gamer.achievements.addGroupByGameButton': true });
    });

    test('should add the button once, last in the search and filter bar', async () => {
      onTestFinished(addSearchAndFilterButton(on, button));
      await tick();

      const bar = find('.search-and-filter');
      expect(bar.lastElementChild).toBe(required(ours()));
      // The site's own clear div, which has other classes on some pages
      expect(required(required(bar.lastElementChild).previousElementSibling).classList).toContain('clear');
      expect(bar.querySelectorAll('.feature')).toHaveLength(1);
    });

    test('should add nothing when the bar never loads, giving up quietly', async () => {
      vi.spyOn(taxPage, 'waitForElement').mockResolvedValueOnce(null);
      const logError = vi.spyOn(logger, 'error');

      onTestFinished(addSearchAndFilterButton(on, button));
      await tick();

      expect(ours()).toBeNull();
      // Rather than failing to mount into the missing bar
      expect(logError).not.toHaveBeenCalled();
    });

    test('should add nothing once stopped while it waits for the bar', async () => {
      find('.search-and-filter').remove();
      const stop = addSearchAndFilterButton(on, button);
      // Its wait given up by the stop
      stop();
      await tick();

      expect(ours()).toBeNull();
    });

    test('should apply live: on, off and on again, off giving the bar back exactly', async () => {
      setSettings({ 'gamer.achievements.addGroupByGameButton': false });
      onTestFinished(addSearchAndFilterButton(on, button));

      await expectAppliesLive(on, () => find('.search-and-filter').outerHTML);
    });
  });
});

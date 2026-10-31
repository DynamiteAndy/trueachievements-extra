import { find, mountInPage, pressKey, renderElement, required } from '@ta-x-test';
import { act } from 'preact/test-utils';

import styles from '../styles';
import { useTabs } from '../use-tabs';

import { TabBar } from './TabBar';

describe('ui/tabs/TabBar', () => {
  const tabs = [
    { id: 'trueachievements', label: 'TrueAchievements' },
    { id: 'controller', label: 'Controller' }
  ];

  test('renders a tab list with a link per tab, the selected one marked', () => {
    const bar = renderElement(<TabBar tabs={tabs} selected="controller" onSelect={() => undefined} />);

    expect(bar.tagName).toBe('UL');
    expect(bar.className).toBe(styles.tabsLinkContainer);
    expect(bar.getAttribute('role')).toBe('tablist');
    expect(
      [...bar.children].map((link) => [
        link.textContent,
        link.getAttribute('aria-controls'),
        link.getAttribute('aria-selected')
      ])
    ).toEqual([
      ['TrueAchievements', 'ta-x-tabs-trueachievements', 'false'],
      ['Controller', 'ta-x-tabs-controller', 'true']
    ]);
  });

  test("puts the user's classes first, and the line along the top of its tabs when asked", () => {
    const bar = renderElement(
      <TabBar tabs={tabs} selected="controller" onSelect={() => undefined} class="tabs-nav" borderTop />
    );

    expect(bar.className).toBe(`tabs-nav ${styles.tabsLinkContainer}`);
    expect([...bar.children].map((link) => link.hasAttribute('data-border-top'))).toEqual([true, true]);
  });

  test("calls onSelect with a tab's id when it's clicked", () => {
    const onSelect = vi.fn();
    const bar = mountInPage(<TabBar tabs={tabs} selected="trueachievements" onSelect={onSelect} />).root.element;

    find<HTMLElement>('[aria-controls="ta-x-tabs-controller"]', bar).click();

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('controller');
  });

  describe('the keyboard', () => {
    const threeTabs = [...tabs, { id: 'flags', label: 'Flags' }];

    // A bar keeping its own selection, as its users do (useTabs)
    const Group = () => {
      const { selected, select, tabGroupId } = useTabs('trueachievements');

      return <TabBar tabs={threeTabs} selected={selected} onSelect={select} tabGroupId={tabGroupId} />;
    };

    const mountGroup = () => {
      const bar = required(mountInPage(<Group />).root.element);
      const links = [...bar.children] as HTMLElement[];
      const selected = () => links.map((link) => link.getAttribute('aria-selected') === 'true');

      return { bar, links, selected };
    };

    test('moves to the next and previous tab with the arrow keys, round from the ends, selecting and focusing it', () => {
      const { links, selected } = mountGroup();
      // Only the bar scrolls to the tab, never the page
      const focus = vi.spyOn(HTMLElement.prototype, 'focus');

      expect(pressKey(links[0], 'ArrowRight').defaultPrevented).toBe(true);
      expect([selected(), document.activeElement]).toEqual([[false, true, false], links[1]]);
      expect(focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true });

      pressKey(links[1], 'ArrowRight');
      pressKey(links[2], 'ArrowRight');
      expect([selected(), document.activeElement]).toEqual([[true, false, false], links[0]]);

      pressKey(links[0], 'ArrowLeft');
      expect([selected(), document.activeElement]).toEqual([[false, false, true], links[2]]);

      pressKey(links[2], 'ArrowLeft');
      expect([selected(), document.activeElement]).toEqual([[false, true, false], links[1]]);
    });

    test('moves to the first and last tab with Home and End', () => {
      const { links, selected } = mountGroup();

      pressKey(links[0], 'End');
      expect([selected(), document.activeElement]).toEqual([[false, false, true], links[2]]);

      pressKey(links[2], 'Home');
      expect([selected(), document.activeElement]).toEqual([[true, false, false], links[0]]);
    });

    test('keeps only the selected tab in the Tab order', () => {
      const { links } = mountGroup();

      pressKey(links[0], 'ArrowRight');

      expect(links.map((link) => link.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
    });

    test('leaves other keys alone', () => {
      const { links, selected } = mountGroup();

      expect(pressKey(links[0], 'ArrowDown').defaultPrevented).toBe(false);
      expect(selected()).toEqual([true, false, false]);
    });

    // Alt+Left and Alt+Right are the browser's back and forward
    test.each([{ altKey: true }, { ctrlKey: true }, { metaKey: true }])(
      'leaves the arrow keys pressed with Alt, Ctrl or Cmd to the browser (%o)',
      (modifiers) => {
        const { links, selected } = mountGroup();

        expect(pressKey(links[0], 'ArrowRight', modifiers).defaultPrevented).toBe(false);
        expect(selected()).toEqual([true, false, false]);
      }
    );

    test('takes the arrow keys only from a tab, not from the bar itself', () => {
      const { bar, selected } = mountGroup();

      expect(pressKey(bar, 'ArrowRight').defaultPrevented).toBe(false);
      expect(selected()).toEqual([true, false, false]);
    });

    // E.g. the settings menu's changelog, a view with no tab of its own: the bar stays reachable by Tab
    test('keeps the first tab in the Tab order while what is shown is none of its tabs', () => {
      const shown = renderElement(<TabBar tabs={threeTabs} selected="changelog" onSelect={() => undefined} />);

      expect([...shown.children].map((link) => link.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    });

    test("gives each bar's tabs ids of their own, so two on a page don't share them", () => {
      const controls = (bar: HTMLElement) =>
        [...bar.children].map((link) => link.getAttribute('aria-controls')).join(' ');

      expect(controls(mountGroup().bar)).not.toBe(controls(mountGroup().bar));
      expect(controls(mountGroup().bar)).toMatch(/^ta-x-tabs-group-\d+-trueachievements /);
    });
  });

  test('scrolls sideways when dragged', () => {
    const bar = mountInPage(<TabBar tabs={tabs} selected="trueachievements" onSelect={() => undefined} />).root.element;

    required(bar).dispatchEvent(Object.assign(new MouseEvent('mousedown'), { pageX: 100 }));

    expect(required(bar)).toHaveExactClasses([styles.tabsLinkContainer, styles.tabScroll]);
  });

  test("scrolls a newly selected tab that's past the bar's edge into view, smoothly", async () => {
    const { root } = mountInPage(<TabBar tabs={tabs} selected="trueachievements" onSelect={() => undefined} />);
    const render = (selected: string) =>
      act(() => {
        root.render(<TabBar tabs={tabs} selected={selected} onSelect={() => undefined} />);
      });
    const bar = root.element;
    // A 100px bar showing only the first tab; the second runs from 120 to 220
    Object.defineProperty(bar, 'clientWidth', { value: 100 });
    required(bar).getBoundingClientRect = () => ({ left: 0, width: 100 }) as DOMRect;
    const [, controller] = [...required(bar).children] as HTMLElement[];
    controller.getBoundingClientRect = () => ({ left: 120, width: 100 }) as DOMRect;
    const scrollTo = vi.spyOn(required(bar), 'scrollTo');

    await render('controller');

    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 120, behavior: 'smooth' });
  });
});

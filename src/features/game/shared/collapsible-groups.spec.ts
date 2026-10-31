import { find, required, setHtml, tick, useFakeTimers } from '@ta-x-test';
import { AccordionStyles } from '@ta-x-ui';
import { act } from 'preact/test-utils';

import { applyCollapsibleGroups } from './collapsible-groups';
import styles from './styles';

describe('game/shared/collapsible-groups', () => {
  const buttons = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(`.${styles.collapseIcon}`)];

  beforeEach(() => {
    setHtml('@ta-x-test-views/game-achievements/human-fall-flat-dlc-groups.html', {
      url: 'https://www.trueachievements.com/game/Human-Fall-Flat/achievements?gamerid=96119'
    });
  });

  test("should add a collapse button first in the base game's and each DLC's options, not the gamer's", async () => {
    await applyCollapsibleGroups();

    expect(find('main').classList).toContain(styles.collapsibleGroups);
    expect(
      buttons().map((button) => [
        find('h2', button.closest('.pnl-hd')).textContent,
        required(button.parentElement).firstElementChild === button,
        button.className
      ])
    ).toEqual(
      ['Base Game (Excludes DLC)', 'Aztec', 'Dark'].map((title) => [
        title,
        true,
        `button menubutton ta-x-achievement-groups-collapse-icon ${AccordionStyles.accordion} ${AccordionStyles.collapseButton} expanded`
      ])
    );
    expect(find('.pnl-hd.gamer').children).toHaveLength(0);
    // Each named for its group, and pointing at the content it collapses
    expect(buttons().map((button) => button.getAttribute('aria-label'))).toEqual([
      'Show or hide Base Game (Excludes DLC)',
      'Show or hide Aztec',
      'Show or hide Dark'
    ]);
    buttons().forEach((button) => {
      expect(document.getElementById(button.getAttribute('aria-controls') ?? '')).toHaveExactClasses([
        AccordionStyles.accordionContent
      ]);
    });
  });

  test('should pass over a group header with no options, and still add the others', async () => {
    const aztec = required(
      [...document.querySelectorAll('.pnl-hd')].find((header) => header.querySelector('h2')?.textContent === 'Aztec')
    );
    find('.options', aztec).remove();

    await applyCollapsibleGroups();

    expect(buttons().map((button) => find('h2', button.closest('.pnl-hd')).textContent)).toEqual([
      'Base Game (Excludes DLC)',
      'Dark'
    ]);
  });

  test("should keep the site's own options after the button", async () => {
    await applyCollapsibleGroups();

    const aztecOptions = buttons()[1].parentElement;
    expect([...required(aztecOptions).children].slice(1).map((child) => `${child.tagName}.${child.className}`)).toEqual(
      ['SPAN.button menubutton dd-share', 'A.button menubutton dd-ellipses', 'UL.menuitems']
    );
  });

  test("should move each group's achievement lists and ad slots into a content after its header", async () => {
    await applyCollapsibleGroups();

    const article = find('article');
    expect([...article.children].map((child) => `${child.tagName}.${child.className}`)).toEqual([
      'H1.gh pagetitle',
      'DIV.pnl-hd no-pills no-pr game',
      `DIV.${AccordionStyles.accordionContent}`,
      'DIV.pnl-hd no-pills no-pr game dlc',
      `DIV.${AccordionStyles.accordionContent}`,
      'DIV.pnl-hd no-pills no-pr game dlc',
      `DIV.${AccordionStyles.accordionContent}`
    ]);
    expect(
      buttons().map((button) =>
        [...required(required(button.closest('.pnl-hd')).nextElementSibling).children].map((child) =>
          child.matches('ul') ? find('a.title', child).textContent : child.className
        )
      )
    ).toEqual([['Petrolhead', 'dyn-lb', 'Adventurer'], ['Clockwork', 'dyn-lb', 'The End'], ['Planks? No Thanks!']]);
  });

  test("should collapse and expand only its own group's content", async () => {
    // Our collapse button's classes, collapsed (expanded adds one)
    const collapseButtonClasses = [
      'button',
      'menubutton',
      styles.collapseIcon,
      AccordionStyles.accordion,
      AccordionStyles.collapseButton
    ];
    await applyCollapsibleGroups();
    useFakeTimers();
    const contents = () =>
      buttons().map((button) => required(button.closest('.pnl-hd')).nextElementSibling as HTMLElement);

    await act(() => buttons()[1].click());
    expect(contents().map((content) => content.style.maxHeight)).toEqual(['', '0px', '']);
    expect(buttons()[1]).toHaveExactClasses(collapseButtonClasses);

    await act(() => buttons()[1].click());
    vi.runAllTimers();
    expect(contents().map((content) => content.style.maxHeight)).toEqual(['', '', '']);
    expect(buttons()[1]).toHaveExactClasses([...collapseButtonClasses, 'expanded']);
  });

  test("should give the site's rows back where they were, and take its buttons and contents away", async () => {
    const before = find('article').outerHTML;

    const cleanup = required(await applyCollapsibleGroups());
    cleanup();

    expect(find('article').outerHTML).toBe(before);
    expect(find('main').classList).not.toContain(styles.collapsibleGroups);
  });

  // It starts with the other list features once the page is parsed, so it waits for a task of its own
  test('should leave the list alone until it has a task of its own, then do one group per task', async () => {
    const applying = applyCollapsibleGroups();

    expect(buttons()).toHaveLength(0);

    await tick();

    expect(buttons()).toHaveLength(1);

    await applying;

    expect(buttons()).toHaveLength(3);
  });
});

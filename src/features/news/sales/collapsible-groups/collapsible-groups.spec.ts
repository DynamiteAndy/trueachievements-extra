import { settings } from '@ta-x-storage';
import { changeSettingLive, expectAppliesLive, find, required, setHtml, setSettings, useFakeTimers } from '@ta-x-test';
import { AccordionStyles } from '@ta-x-ui';
import { act } from 'preact/test-utils';

import { capturedAdSlot } from '../ad-row.spec-helpers';

import styles from './styles';

import collapsibleGroups from '.';

describe('news/sales/collapsible-groups', () => {
  const headers = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(`.${styles.collapsibleGroups}`)];
  // Starts it (at once: it wraps every table as it starts), stopping it when the test ends
  const start = (): void => {
    onTestFinished(collapsibleGroups());
  };

  beforeEach(() => {
    setSettings({ 'news.sales.collapsibleGroups': true });
    setHtml('@ta-x-test-views/sale-article/shocktober-groups.html', {
      url: 'https://www.trueachievements.com/news/xbox-shocktober-sale-2026'
    });
  });

  test('should add a header per sale table, holding its headings and a collapse button', async () => {
    start();

    expect(headers()).toHaveLength(2);
    expect(
      headers().map((header) => [
        [...required(header.firstElementChild).children].map((heading) => `${heading.tagName}:${heading.textContent}`),
        required(header.lastElementChild).className
      ])
    ).toEqual([
      [
        ['H2:Xbox 360 (backwards compatible) Sales', 'H3:Xbox 360 (backwards compatible) Games'],
        `button menubutton ${AccordionStyles.accordion} ${AccordionStyles.collapseButton} expanded`
      ],
      [
        ['H2:Xbox Series X|S Sales', 'H3:Xbox Series X|S Games'],
        `button menubutton ${AccordionStyles.accordion} ${AccordionStyles.collapseButton} expanded`
      ]
    ]);
    headers().forEach((header) => {
      expect(required(header.firstElementChild).tagName).toBe('DIV');
      expect(required(header.firstElementChild).className).toBe('');
    });
    // Each named for its table's heading
    expect(headers().map((header) => required(header.lastElementChild).getAttribute('aria-label'))).toEqual([
      'Show or hide Xbox 360 (backwards compatible) Games',
      'Show or hide Xbox Series X|S Games'
    ]);
  });

  test('should wrap each table in an accordion content after its header', async () => {
    start();

    const section = find('section.sale');
    expect([...section.children].map((child) => `${child.tagName}.${child.className}`)).toEqual([
      'DIV.region-selector cf-region',
      `DIV.${styles.collapsibleGroups}`,
      `DIV.${AccordionStyles.accordionContent}`,
      `DIV.${styles.collapsibleGroups}`,
      `DIV.${AccordionStyles.accordionContent}`
    ]);
    // Each content holds its sale table (find fails the test where one doesn't)
    expect(headers()).toHaveLength(2);
    headers().forEach((header) => find('div.tab-w > table.sale', header.nextElementSibling));
  });

  describe('what comes before a table', () => {
    const headings = (): string[][] =>
      headers().map((header) => [...required(header.firstElementChild).children].map((heading) => heading.tagName));
    const sectionChildren = (): string[] =>
      [...find('section.sale').children].map((child) => `${child.tagName}.${child.className}`);
    const removeHeadings = (...selectors: string[]): void => selectors.forEach((selector) => find(selector).remove());

    test("should take only an h3 that follows the previous table, leaving that table's", async () => {
      // A group's later tables have their h3 alone (e.g. on the Shocktober DLC sale)
      removeHeadings('section.sale > h2:nth-of-type(2)');

      start();

      expect(headings()).toEqual([['H2', 'H3'], ['H3']]);
    });

    test.each([
      {
        name: 'leaving what comes before a table that has no heading where it is',
        remove: ['section.sale > h2', 'section.sale > h3'],
        first: 'DIV.region-selector cf-region'
      },
      {
        name: 'when a table has nothing before it',
        remove: ['section.sale > .region-selector', 'section.sale > h2', 'section.sale > h3'],
        first: `DIV.${styles.collapsibleGroups}`
      }
    ])('should still add the headers, $name', async ({ remove, first }) => {
      removeHeadings(...remove);

      start();

      expect(headings()).toEqual([[], ['H2', 'H3']]);
      expect(sectionChildren()[0]).toBe(first);
      expect(
        headers().map((header) => [
          required(header.nextElementSibling).className,
          required(header.nextElementSibling).querySelectorAll('div.tab-w > table.sale').length
        ])
      ).toEqual([
        [AccordionStyles.accordionContent, 1],
        [AccordionStyles.accordionContent, 1]
      ]);
    });
  });

  test("should give the site's tables and headings back where they were, and take its headers away", async () => {
    const before = find('section.sale').outerHTML;

    const stop = collapsibleGroups();
    stop();

    expect(find('section.sale').outerHTML).toBe(before);
  });

  test("should apply live: on, off and on again from the menu, off giving the site's tables back exactly", async () => {
    setSettings({ 'news.sales.collapsibleGroups': false });
    start();

    await expectAppliesLive(settings.news.sales.collapsibleGroups, () => find('section.sale').outerHTML);
  });

  // The site adds its in-content ad slots between the groups once the page has loaded (on this sale, one before each
  // later group's header), so turned off and on again later, one sits between a table's headings and its header
  test("should still take each table's headings when turned on again after the site's ad slots arrived", async () => {
    start();
    const slot = capturedAdSlot();
    headers()[1].before(slot);

    await changeSettingLive(settings.news.sales.collapsibleGroups, false);
    await changeSettingLive(settings.news.sales.collapsibleGroups, true);

    expect(
      headers().map((header) =>
        [...required(header.firstElementChild).children].map((heading) => `${heading.tagName}:${heading.textContent}`)
      )
    ).toEqual([
      ['H2:Xbox 360 (backwards compatible) Sales', 'H3:Xbox 360 (backwards compatible) Games'],
      ['H2:Xbox Series X|S Sales', 'H3:Xbox Series X|S Games']
    ]);
    // The ad slot stays in the page, before the second header
    expect(headers()[1].previousElementSibling).toBe(slot);
  });

  test('should give the headings back before a table with nothing between them, as a page without spaces would be', async () => {
    // The spaces between the headings and the table's wrapper taken out: the last heading's next sibling is then the
    // header put in the wrapper's place, so the headings must go back while it's there
    const section = find('section.sale');
    [...section.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).forEach((node) => node.remove());
    const before = section.outerHTML;

    const stop = collapsibleGroups();
    stop();

    expect(section.outerHTML).toBe(before);
  });

  test("should collapse and expand only its own table's content", async () => {
    useFakeTimers();
    start();
    const button = (index: number) => headers()[index].lastElementChild as HTMLElement;
    // Our collapse button's classes, collapsed (expanded adds one)
    const collapseButtonClasses = ['button', 'menubutton', AccordionStyles.accordion, AccordionStyles.collapseButton];
    const contents = () => headers().map((header) => (header.nextElementSibling as HTMLElement).style.maxHeight);

    await act(() => button(0).click());
    expect(contents()).toEqual(['0px', '']);
    expect(button(0)).toHaveExactClasses(collapseButtonClasses);

    await act(() => button(0).click());
    vi.runAllTimers();
    expect(contents()).toEqual(['', '']);
    expect(button(0)).toHaveExactClasses([...collapseButtonClasses, 'expanded']);
  });
});

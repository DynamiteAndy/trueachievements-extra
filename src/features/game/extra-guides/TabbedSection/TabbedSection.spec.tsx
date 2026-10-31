import { find, mountForTest, renderElement, required } from '@ta-x-test';
import { TabsStyles } from '@ta-x-ui';

import styles from './styles';
import { TabbedSection } from './TabbedSection';

describe('game/extra-guides/TabbedSection', () => {
  const tabs = [
    { id: 'latest', label: 'Latest', content: <p>Latest content</p> },
    { id: 'popular', label: 'Popular', content: <p>Popular content</p> }
  ];

  test("renders a section with no title: its tab bar across the top, then each tab's content in its body", () => {
    const section = renderElement(
      <TabbedSection tabs={tabs} selected="latest" onSelect={() => undefined} class="js-ta-x-feature" data-feature="" />
    );

    expect(section.tagName).toBe('SECTION');
    expect(section.className).toBe(`${styles.tabbedSection} js-ta-x-feature`);
    expect(section.hasAttribute('data-feature')).toBe(true);
    expect([...section.children].map((child) => child.tagName)).toEqual(['UL', 'ARTICLE']);

    const bar = section.firstElementChild;
    expect(required(bar).className).toBe(`${styles.tabbedSectionTabs} ${TabsStyles.tabsLinkContainer}`);
    expect([...required(bar).children].map((link) => [link.textContent, link.hasAttribute('data-border-top')])).toEqual(
      [
        ['Latest', true],
        ['Popular', true]
      ]
    );
    expect(
      [...section.querySelectorAll(`:scope > article > .${TabsStyles.tabsContent}`)].map((content) => [
        content.id,
        content.hasAttribute('data-tab-visible'),
        content.textContent
      ])
    ).toEqual([
      ['ta-x-tabs-latest', true, 'Latest content'],
      ['ta-x-tabs-popular', false, 'Popular content']
    ]);
  });

  test("calls onSelect with a tab's id when it's clicked, leaving which is selected to its user", () => {
    const onSelect = vi.fn();
    const section = mountForTest(
      <TabbedSection tabs={tabs} selected="latest" onSelect={onSelect} />,
      document.createElement('div')
    ).element;

    find<HTMLElement>('[aria-controls="ta-x-tabs-popular"]', section).click();

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('popular');
    expect(find('[data-tab-visible]', section).id).toBe('ta-x-tabs-latest');
  });
});

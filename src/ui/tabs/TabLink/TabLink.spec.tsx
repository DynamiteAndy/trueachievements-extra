import { mountInPage, pressKey, renderElement, required } from '@ta-x-test';

import styles from '../styles';

import { TabLink } from './TabLink';

describe('ui/tabs/TabLink', () => {
  test('renders a tab link with its class, controlling its content', () => {
    const link = renderElement(<TabLink id="smileysemotion">Smileys & Emotion</TabLink>);

    expect(link.tagName).toBe('LI');
    expect(link).toHaveExactClasses([styles.tabsLink]);
    expect(link.getAttribute('aria-controls')).toBe('ta-x-tabs-smileysemotion');
    // Its panel's name points here
    expect(link.id).toBe('ta-x-tab-smileysemotion');
    expect(link.textContent).toBe('Smileys & Emotion');
  });

  test("controls its group's own content when given its group", () => {
    const link = renderElement(
      <TabLink id="flags" tabGroupId="group-7">
        Flags
      </TabLink>
    );

    expect(link.getAttribute('aria-controls')).toBe('ta-x-tabs-group-7-flags');
    expect(link.id).toBe('ta-x-tab-group-7-flags');
  });

  test('is selected, with its line along the top, when asked, and in the Tab order', () => {
    const link = renderElement(
      <TabLink id="xbox-achievements" selected borderTop>
        Xbox Achievements
      </TabLink>
    );

    expect(link).toHaveExactClasses([styles.tabsLink, styles.tabSelected]);
    expect(link.getAttribute('aria-selected')).toBe('true');
    expect(link.hasAttribute('data-border-top')).toBe(true);
    expect(link.getAttribute('role')).toBe('tab');
    expect(link.getAttribute('tabindex')).toBe('0');
  });

  test('is neither selected nor top-lined by default, and out of the Tab order (the arrow keys reach it)', () => {
    const link = renderElement(<TabLink id="controller">Controller</TabLink>);

    expect(link).toHaveExactClasses([styles.tabsLink]);
    expect(link.getAttribute('aria-selected')).toBe('false');
    expect(link.hasAttribute('data-border-top')).toBe(false);
    expect(link.getAttribute('tabindex')).toBe('-1');
  });

  test.each([
    { name: 'Enter', key: 'Enter' },
    { name: 'Space', key: ' ' }
  ])('is clicked by $name, without the page taking the key', ({ key }) => {
    const onClick = vi.fn();
    const link = required(
      mountInPage(
        <TabLink id="controller" onClick={onClick}>
          Controller
        </TabLink>
      ).root.element
    );

    expect(pressKey(link, key).defaultPrevented).toBe(true);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

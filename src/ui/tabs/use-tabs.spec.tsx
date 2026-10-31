import { mountInPage, visibleTabs } from '@ta-x-test';
import { act } from 'preact/test-utils';

import styles from './styles';
import { TabContent } from './TabContent';
import { TabLink } from './TabLink';
import { useTabs, type Tabs } from './use-tabs';

describe('useTabs', () => {
  let tabs: Tabs;

  // Two tabs and two views (panels with no tab), like the settings menu's. Hands its tabs to the spec
  const Group = ({ onRender }: { onRender: (tabs: Tabs) => void }) => {
    const tabs = useTabs('one');
    onRender(tabs);
    return (
      <div>
        <ul class={styles.tabsLinkContainer}>
          {['one', 'two'].map((id) => (
            <TabLink key={id} id={id} selected={tabs.selected === id} onClick={() => tabs.select(id)}>
              {id}
            </TabLink>
          ))}
        </ul>
        {['one', 'two', 'changelog', 'documentation'].map((id) => (
          <TabContent key={id} id={id} visible={tabs.selected === id} />
        ))}
      </div>
    );
  };

  const links = () => [...document.querySelectorAll<HTMLElement>(`.${styles.tabsLink}`)];
  const selected = () =>
    links()
      .filter((link) => link.getAttribute('aria-selected') === 'true')
      .map((link) => link.textContent);

  beforeEach(() => {
    mountInPage(
      <Group
        onRender={(current) => {
          tabs = current;
        }}
      />
    );
  });

  test('should show the first tab', () => {
    expect(visibleTabs()).toEqual(['ta-x-tabs-one']);
    expect(selected()).toEqual(['one']);
  });

  test('should switch tabs when one is clicked', async () => {
    await act(() => links()[1].click());

    expect(visibleTabs()).toEqual(['ta-x-tabs-two']);
    expect(selected()).toEqual(['two']);
    expect(links()[0]).toHaveExactClasses([styles.tabsLink]);
  });

  test('should show a view in place of the current tab, then go back to it', async () => {
    await act(() => links()[1].click());

    await act(() => tabs.toggleView('changelog'));
    expect(visibleTabs()).toEqual(['ta-x-tabs-changelog']);
    expect(selected()).toEqual([]);

    await act(() => tabs.toggleView('changelog'));
    expect(visibleTabs()).toEqual(['ta-x-tabs-two']);
    expect(selected()).toEqual(['two']);
  });

  test('should keep the tab to go back to when moving between views', async () => {
    await act(() => tabs.toggleView('changelog'));
    await act(() => tabs.toggleView('documentation'));
    expect(visibleTabs()).toEqual(['ta-x-tabs-documentation']);

    await act(() => tabs.toggleView('documentation'));
    expect(visibleTabs()).toEqual(['ta-x-tabs-one']);
  });

  test('should leave a view for the tab clicked', async () => {
    await act(() => tabs.toggleView('changelog'));

    await act(() => links()[1].click());

    expect(visibleTabs()).toEqual(['ta-x-tabs-two']);

    await act(() => tabs.toggleView('documentation'));
    await act(() => tabs.toggleView('documentation'));
    expect(visibleTabs()).toEqual(['ta-x-tabs-two']);
  });

  test('should keep the same functions between renders', async () => {
    const { select, toggleView } = tabs;

    await act(() => links()[1].click());

    expect([tabs.select, tabs.toggleView]).toEqual([select, toggleView]);
  });
});

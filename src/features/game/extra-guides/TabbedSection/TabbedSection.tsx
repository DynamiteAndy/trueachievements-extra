import { classNames } from '@ta-x-lib';
import { TabBar, TabContent, type Tab } from '@ta-x-ui';

import type { ComponentChildren, HTMLAttributes } from 'preact';

import styles from './styles';

interface TabbedSectionTab extends Tab {
  content: ComponentChildren;
}

interface TabbedSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'selected' | 'onSelect' | 'class'> {
  class?: string;
  tabs: TabbedSectionTab[];
  // The selected tab's id (useTabs), kept by the user so it can select a tab itself
  selected: string;
  onSelect: (id: string) => void;
  // The tab group's page-unique id (useTabs)
  tabGroupId?: string;
}

// A side column section shaped like the site's Popular Content box: no title, its tab bar across the top, then the
// selected tab's content in the section's body (an article, as in Section). It's our own markup and class, not the
// site's .tabbed (its script binds to that, and its CSS restyles everything inside). Each tab keeps the tabs' colour
// for its place, as a line along the selected tab's top. Any other attributes (the feature's classes, data-*) go on the
// section.
export const TabbedSection = ({
  tabs,
  selected,
  onSelect,
  tabGroupId,
  class: classes,
  ...attributes
}: TabbedSectionProps) => (
  <section class={classNames(styles.tabbedSection, classes)} {...attributes}>
    <TabBar
      tabs={tabs}
      selected={selected}
      onSelect={onSelect}
      tabGroupId={tabGroupId}
      class={styles.tabbedSectionTabs}
      borderTop
    />
    {/* The site's section body, so the tabs' content gets its text styles (a div here would be styled as a title) */}
    <article>
      {tabs.map(({ id, content }) => (
        <TabContent key={id} id={id} tabGroupId={tabGroupId} visible={selected === id}>
          {content}
        </TabContent>
      ))}
    </article>
  </section>
);

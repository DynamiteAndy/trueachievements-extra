import { classNames } from '@ta-x-lib';

import type { ComponentChildren } from 'preact';

import { clickOnEnterOrSpace } from '../../click-on-enter-or-space';
import styles from '../styles';
import { tabId, tabPanelId } from '../tab-ids';

interface TabLinkProps {
  id: string;
  // The tab group's page-unique id (useTabs), shared with its TabContents' ids
  tabGroupId?: string;
  // Whether its panel is the one shown (useTabs)
  selected?: boolean;
  // Whether Tab reaches it (TabBar): the selected tab, or the bar's first while none is
  tabStop?: boolean;
  onClick?: () => void;
  // Marks the selected tab with a line along its top instead of its bottom
  borderTop?: boolean;
  children?: ComponentChildren;
}

// A tab in a tab group's bar; the group keeps which is selected (useTabs) and shows the TabContent with the same id.
// An <li> with role="tab" (the tab bars' CSS, ours and the site's, styles their li), taking Enter and Space. Only the
// tab stop (the selected tab, unless the bar says otherwise) is in the Tab order; the bar moves between tabs with the
// arrow keys (TabBar)
export const TabLink = ({
  id,
  tabGroupId,
  selected = false,
  tabStop = selected,
  onClick,
  borderTop = false,
  children
}: TabLinkProps) => (
  <li
    id={tabId(id, tabGroupId)}
    class={classNames(styles.tabsLink, selected && styles.tabSelected)}
    data-border-top={borderTop ? '' : undefined}
    role="tab"
    tabIndex={tabStop ? 0 : -1}
    aria-selected={selected ? 'true' : 'false'}
    aria-controls={tabPanelId(id, tabGroupId)}
    onClick={onClick}
    onKeyDown={clickOnEnterOrSpace}
  >
    {children}
  </li>
);

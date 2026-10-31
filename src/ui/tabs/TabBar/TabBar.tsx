import { classNames } from '@ta-x-lib';
import { useRef } from 'preact/hooks';

import type { ComponentChildren, KeyboardEventHandler } from 'preact';

import { pressedWithModifier } from '../../click-on-enter-or-space';
import styles from '../styles';
import { TabLink } from '../TabLink';

import { useDragScroll, useScrollToSelected } from './use-tab-bar-scroll';

export interface Tab {
  id: string;
  label: ComponentChildren;
}

interface TabBarProps {
  tabs: Tab[];
  // The selected tab's id (useTabs)
  selected: string;
  onSelect: (id: string) => void;
  // The tab group's page-unique id (useTabs), shared with its TabContents' ids
  tabGroupId?: string;
  // The user's own classes on the bar, e.g. the site's tabs-nav
  class?: string;
  // Marks the selected tab with a line along its top instead of its bottom
  borderTop?: boolean;
}

// Where each key moves to from the tab at `from` of `count`, round from the last to the first and back
const moves: Record<string, (from: number, count: number) => number> = {
  ArrowRight: (from, count) => (from + 1) % count,
  ArrowLeft: (from, count) => (from - 1 + count) % count,
  Home: () => 0,
  End: (_from, count) => count - 1
};

// A tab group's bar: a link per tab, scrolling (or dragged) sideways when they don't all fit, and keeping the selected
// tab in view. The group keeps which is selected (useTabs) and shows the TabContent with the same id. The arrow keys
// (and Home and End) select the next tab and move the focus to it, as a tab list does
export const TabBar = ({ tabs, selected, onSelect, tabGroupId, class: classes, borderTop }: TabBarProps) => {
  const bar = useRef<HTMLUListElement>(null);
  useDragScroll(bar);
  useScrollToSelected(bar, selected);

  // The tab Tab reaches: the selected one or, while a view with no tab of its own is shown (the settings menu's
  // changelog), the first, so the bar can still be reached
  const tabStop = tabs.some(({ id }) => id === selected) ? selected : tabs.at(0)?.id;

  const onKeyDown: KeyboardEventHandler<HTMLUListElement> = (event) => {
    const move = moves[event.key];
    const links = [...event.currentTarget.children] as HTMLElement[];
    // Only from a tab itself (not something inside one, nor the bar)
    const from = links.findIndex((link) => link === event.target);

    if (!move || from === -1 || pressedWithModifier(event)) {
      return;
    }

    event.preventDefault();
    const to = move(from, links.length);
    onSelect(tabs[to].id);
    // Only the bar scrolls to it (useScrollToSelected), never the page
    links[to].focus({ preventScroll: true });
  };

  return (
    <ul ref={bar} class={classNames(classes, styles.tabsLinkContainer)} role="tablist" onKeyDown={onKeyDown}>
      {tabs.map(({ id, label }) => (
        <TabLink
          key={id}
          id={id}
          tabGroupId={tabGroupId}
          selected={selected === id}
          tabStop={tabStop === id}
          onClick={() => onSelect(id)}
          borderTop={borderTop}
        >
          {label}
        </TabLink>
      ))}
    </ul>
  );
};

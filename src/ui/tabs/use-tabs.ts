import { useMemo, useState } from 'preact/hooks';

import { useUniqueId } from '../use-unique-id';

export interface Tabs {
  // A page-unique id for the group, for its TabBar and TabContents to put in their ids
  tabGroupId: string;
  // The panel shown
  selected: string;
  // Shows a tab's panel
  select: (id: string) => void;
  // Shows a view: a panel with no tab of its own (e.g. the settings menu's changelog), in place of the current tab, or
  // goes back to that tab if the view is already shown. Moving from one view to another keeps the tab to go back to
  toggleView: (id: string) => void;
}

// A tab group's state: which panel is shown, and the tab to go back to from a view. Each tab group lays out its own tab
// links (TabLink: selected, onClick) and panels (TabContent: visible) from it
export const useTabs = (first: string): Tabs => {
  const [{ selected }, setState] = useState({ selected: first, returnTo: first });
  const tabGroupId = useUniqueId('group');

  // The same functions every render, so effects can depend on them
  const actions = useMemo<Omit<Tabs, 'selected' | 'tabGroupId'>>(
    () => ({
      select: (id) => setState({ selected: id, returnTo: id }),
      toggleView: (id) =>
        setState((current) =>
          current.selected === id ? { ...current, selected: current.returnTo } : { ...current, selected: id }
        )
    }),
    []
  );

  return { selected, tabGroupId, ...actions };
};

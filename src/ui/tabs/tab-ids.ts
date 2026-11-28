// The id of a tab's panel (its TabContent, and its TabLink's aria-controls). A tab group's `tabGroupId` (useTabs) makes
// it unique on the page, so two of one group (two emoji pickers) don't share them; without one it's the tab's id alone
export const tabPanelId = (id: string, tabGroupId?: string): string =>
  `ta-x-tabs-${tabGroupId ? `${tabGroupId}-` : ''}${id}`;

// The id of the tab itself (its TabLink), which names its panel (the TabContent's aria-labelledby)
export const tabId = (id: string, tabGroupId?: string): string => `ta-x-tab-${tabGroupId ? `${tabGroupId}-` : ''}${id}`;

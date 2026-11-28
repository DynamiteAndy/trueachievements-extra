import { classNames } from '@ta-x-lib';
import { useLayoutEffect, useState } from 'preact/hooks';

import type { ComponentChildren } from 'preact';

import attributes from '../attributes';
import styles from '../styles';
import { tabId, tabPanelId } from '../tab-ids';

interface TabContentProps {
  id: string;
  // The tab group's page-unique id (useTabs), shared with its TabBar's links
  tabGroupId?: string;
  // Whether it's the panel shown (useTabs); the tabs CSS shows it by data-tab-visible
  visible?: boolean;
  // Builds its children the first time it's shown, and keeps them from then on: for panels most visits never open.
  // Children worked out at a cost go in as a function, so not even that runs before then
  lazy?: boolean;
  // Extra classes, e.g. the settings menu's t-settings
  class?: string;
  // For a view no tab shows (the settings menu's changelog): its name, as a region rather than a tab's panel
  label?: string;
  children?: ComponentChildren | (() => ComponentChildren);
}

export const TabContent = ({
  id,
  tabGroupId,
  visible = false,
  lazy = false,
  class: classes,
  label,
  children
}: TabContentProps) => {
  // Shown before: kept once hidden again
  const [shownBefore, setShownBefore] = useState(visible);
  useLayoutEffect(() => {
    if (visible) {
      setShownBefore(true);
    }
  }, [visible]);
  const built = !lazy || visible || shownBefore;

  return (
    <div
      id={tabPanelId(id, tabGroupId)}
      class={classNames(styles.tabsContent, classes)}
      {...(label
        ? { role: 'region', 'aria-label': label }
        : { role: 'tabpanel', 'aria-labelledby': tabId(id, tabGroupId) })}
      {...{ [attributes.visibleTab]: visible ? '' : undefined }}
    >
      {built && (typeof children === 'function' ? children() : children)}
    </div>
  );
};

import { CollapseButton } from '@ta-x-ui';

import styles from '../styles';

interface CollapsibleGroupsHeaderProps {
  // The wrapper around the group's sale table, which the button collapses
  content: HTMLElement;
  // The table's heading, in the button's name
  name?: string;
}

// The empty div is filled with the group's own headings once mounted
export const CollapsibleGroupsHeader = ({ content, name }: CollapsibleGroupsHeaderProps) => (
  <div class={styles.collapsibleGroups}>
    <div />
    <CollapseButton content={content} name={name} />
  </div>
);

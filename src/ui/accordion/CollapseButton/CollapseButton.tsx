import { classNames } from '@ta-x-lib';
import { useState } from 'preact/hooks';

import { clickOnEnterOrSpace } from '../../click-on-enter-or-space';
import { ChevronDown } from '../../icons/ChevronDown';
import styles from '../styles';
import { useCollapse } from '../use-collapse';

interface CollapseButtonProps {
  // The feature's own class for the button, when it styles or finds it (the component gives it its look)
  class?: string;
  // The content it collapses: a wrapper the feature puts around the site's own group
  content: HTMLElement;
  // What it collapses, in its name ("Show or hide <name>"), so each button on a page can be told apart
  name?: string;
}

// A button that collapses and expands content it doesn't render, keeping its own open state (open to start with, as
// the site shows the groups). A span with role="button", not a <button>: it's dressed as the site's own `span.button
// menubutton` beside it (its share button), and a <button> would bring browser and site button styles that the site's
// .button doesn't set
export const CollapseButton = ({ class: classes, content, name }: CollapseButtonProps) => {
  const [expanded, setExpanded] = useState(true);
  useCollapse(content, expanded);

  return (
    <span
      class={classNames('button menubutton', classes, styles.accordion, styles.collapseButton, expanded && 'expanded')}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-controls={content.id || undefined}
      aria-label={`Show or hide ${name || 'the group'}`}
      onClick={() => setExpanded((current) => !current)}
      onKeyDown={clickOnEnterOrSpace}
    >
      <ChevronDown />
    </span>
  );
};

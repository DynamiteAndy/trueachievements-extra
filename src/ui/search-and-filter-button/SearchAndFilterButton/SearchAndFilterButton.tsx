import type { ComponentChildren } from 'preact';

import { clickOnEnterOrSpace } from '../../click-on-enter-or-space';
import { noJump } from '../../link-action';
import styles from '../styles';

interface SearchAndFilterButtonProps {
  // The feature's own classes, after the shared ones
  class: string;
  // What the button does: the link's own jump is stopped first
  onClick: () => void;
  children: ComponentChildren;
}

// A text-only site button (`a.button`) in the site's search and filter bar
export const SearchAndFilterButton = ({ class: classes, onClick, children }: SearchAndFilterButtonProps) => {
  // The site's button markup has href="#", which would add # to the URL and jump to the top of the page
  const click = noJump(onClick);

  return (
    <a
      class={`button ${classes} ${styles.searchAndFilterButton}`}
      href="#"
      role="button"
      onClick={click}
      onKeyDown={clickOnEnterOrSpace}
    >
      {children}
    </a>
  );
};

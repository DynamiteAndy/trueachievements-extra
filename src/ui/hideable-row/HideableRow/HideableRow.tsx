import { createPortal } from 'preact';
import { useLayoutEffect, useState } from 'preact/hooks';

import { clickOnEnterOrSpace } from '../../click-on-enter-or-space';
import { Hide } from '../../icons/Hide';
import { Show } from '../../icons/Show';
import { linkAction } from '../../link-action';
import attributes from '../attributes';
import styles from '../styles';

interface HideableRowProps {
  // The site's own row (a forum thread's <li>, a sale table's <tr>); it stays the site's, and only its
  // data-row-hidden attribute and our parts below are ours
  row: HTMLElement;
  // Where the eye toggle goes (the row's last column)
  toggleTarget: HTMLElement;
  // What hid the row, after "Hidden by" (every feature hiding it, already listed), and where it's said
  hiddenBy?: string;
  filterTarget?: HTMLElement | null;
  // What the row is (its thread or game), in the toggle's name ("Show or hide <name>")
  name?: string;
}

// A controller for a row the site owns: it owns whether the row is hidden (hidden to start with; a dev build switches
// it with Preact DevTools, its useState), applies it to the row (our CSS hides the row's content by data-row-hidden),
// and renders the toggle and the filter text into the row's own cells. The site can move the row (its table sort does)
// without it noticing. The toggle is a div with role="button", not a <button>: it sits in the site's own cells, laid
// out by their CSS (and a forum row can be a link, which can't hold a button)
export const HideableRow = ({ row, toggleTarget, hiddenBy = '', filterTarget, name }: HideableRowProps) => {
  const [hidden, setHidden] = useState(true);

  useLayoutEffect(() => {
    row.setAttribute(attributes.rowHidden, String(hidden));
  }, [row, hidden]);

  useLayoutEffect(() => () => row.removeAttribute(attributes.rowHidden), [row]);

  // The toggle sits inside the site's row, which can be a link or have its own click handling
  const toggle = linkAction(() => setHidden((current) => !current));

  return (
    <>
      {filterTarget && hiddenBy && createPortal(<p class={styles.filterText}>Hidden by {hiddenBy}</p>, filterTarget)}
      {createPortal(
        <div
          class={styles.hideableRow}
          role="button"
          tabIndex={0}
          aria-expanded={!hidden}
          aria-label={`Show or hide ${name || 'the row'}`}
          onClick={toggle}
          onKeyDown={clickOnEnterOrSpace}
        >
          <Show class={styles.showIcon} />
          <Hide class={styles.hideIcon} />
        </div>,
        toggleTarget
      )}
    </>
  );
};

import { useLayoutEffect, useRef } from 'preact/hooks';

import type { ComponentChildren } from 'preact';

import { clickOnEnterOrSpace } from '../../click-on-enter-or-space';
import styles from '../styles';

interface EditableHeaderProps {
  // What the lines below it are, e.g. "Linked guide pages"
  label: string;
  // The button's icon (a pencil to change, a plus to add) and what it does, as its title
  icon: ComponentChildren;
  actionTitle: string;
  // Left out, the header shows no button (e.g. while the field it opens is showing)
  onAction?: () => void;
}

// A small header over something linked (a guide site's pages, a thread's walkthrough), with one icon button at its
// right that opens a field to add or change it
export const EditableHeader = ({ label, icon, actionTitle, onAction }: EditableHeaderProps) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  // Pressed, the button goes while its field shows: once it's back (the field cancelled or saved), so is the focus
  const pressedRef = useRef(false);
  const shown = onAction !== undefined;

  useLayoutEffect(() => {
    if (shown && pressedRef.current) {
      pressedRef.current = false;
      buttonRef.current?.focus();
    }
  }, [shown]);

  return (
    <div class={styles.editableHeader}>
      <span>{label}</span>
      {onAction && (
        <a
          ref={buttonRef}
          href="#"
          role="button"
          title={actionTitle}
          // Its own handler, not linkAction: a callback passed to it that sets a ref trips lint's react(refs)
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            pressedRef.current = true;
            onAction();
          }}
          onKeyDown={clickOnEnterOrSpace}
        >
          {icon}
        </a>
      )}
    </div>
  );
};

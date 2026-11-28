import { classNames } from '@ta-x-lib';
import { useRef, useState } from 'preact/hooks';

import type { ComponentChildren } from 'preact';

import { ChevronDown } from '../../icons/ChevronDown';
import { useUniqueId } from '../../use-unique-id';
import styles from '../styles';
import { useCollapse } from '../use-collapse';

interface AccordionProps {
  title: string;
  contentClasses?: string;
  children?: ComponentChildren;
}

// A header that opens and closes the content after it, keeping its own open state. The header is a real button, for the
// keyboard; its stylesheet takes away the browser's button look, so it lays out as a plain block. The content is a group
// named by the header, so a screen reader says which section a control is in (two sections can hold alike-named rows)
export const Accordion = ({ title, contentClasses, children }: AccordionProps) => {
  const [expanded, setExpanded] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const contentId = useUniqueId('ta-x-accordion-content');
  const headerId = useUniqueId('ta-x-accordion-header');
  useCollapse(content, expanded);

  return (
    <>
      <button
        type="button"
        id={headerId}
        class={classNames(styles.accordion, expanded && 'expanded')}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((current) => !current)}
      >
        <span>{title}</span>
        <ChevronDown />
      </button>

      <div
        ref={content}
        id={contentId}
        role="group"
        aria-labelledby={headerId}
        class={classNames(styles.accordionContent, contentClasses)}
        // Closed to start with; useCollapse animates changes and removes the cap once open
        style={{ maxHeight: '0px' }}
      >
        {children}
      </div>
    </>
  );
};

import { moveInto } from '@ta-x-page';

import styles from './styles';

// A page-unique id for a wrapper, for its collapse button's aria-controls (made outside a component, so no hook's id):
// numbered from the wrappers already on the page, so a page wrapped again gets the same ids
const wrapperId = (): string => {
  let number = document.querySelectorAll(`.${styles.accordionContent}`).length + 1;
  while (document.getElementById(`ta-x-collapsible-content-${number}`)) {
    number += 1;
  }

  return `ta-x-collapsible-content-${number}`;
};

// Puts an accordion content div of ours in `parent` before `before`, and moves the site's `nodes` into it (a collapse
// button then controls it). `unwrap` puts the nodes back where they were and takes the div away
export const wrapInAccordionContent = (
  parent: Node,
  before: Node | null,
  nodes: Node[]
): { content: HTMLDivElement; unwrap: () => void } => {
  const content = document.createElement('div');
  content.className = styles.accordionContent;
  content.id = wrapperId();
  parent.insertBefore(content, before);
  const putBack = moveInto(content, nodes);

  return {
    content,
    unwrap: () => {
      putBack();
      content.remove();
    }
  };
};

import { callAll, yieldToPage } from '@ta-x-lib';
import { addClasses, mount } from '@ta-x-page';
import { CollapseButton, AccordionStyles, wrapInAccordionContent } from '@ta-x-ui';

import { dlcGroupHeader, getBaseGroupHeader, getDlcGroupHeaders, groupTitle } from './achievement-groups';
import styles from './styles';

// Mounts the group's collapse button first in the site's group header, controlling the group's wrapper
const mountCollapseButton = (header: HTMLElement, content: HTMLElement): (() => void) => {
  const options = header.querySelector('.options');
  if (!options) {
    return () => undefined;
  }

  return mount(
    <CollapseButton class={styles.collapseIcon} content={content} name={groupTitle(header)} />,
    options,
    options.firstChild
  ).unmount;
};

// Started once the list is parsed (the achievements and DLC entry points), in a task of its own, as it moves every row.
// Applied live (whileSetting): `aborted` says it was turned off meanwhile, so the groups left aren't wrapped. The
// function returned gives the site's rows back where they were, and takes our buttons and wrappers away
export const applyCollapsibleGroups = async (aborted?: AbortSignal): Promise<(() => void) | undefined> => {
  await yieldToPage();

  const body = document.querySelector('main');

  if (!body || aborted?.aborted) {
    return undefined;
  }

  // The site serves `main` with no class: taken off again, it gets no empty class="" back
  const giveClassBack = addClasses(body, styles.collapsibleGroups);

  const baseHeader = getBaseGroupHeader(body);
  const headers = [...(baseHeader ? [baseHeader] : []), ...getDlcGroupHeaders(body)];
  const cleanups: (() => void)[] = [];

  // A task of its own per group: all of a long game's groups in one go make a long task
  for (const achievementGroup of headers) {
    if (achievementGroup !== headers[0]) {
      await yieldToPage();
      if (aborted?.aborted) {
        break;
      }
    }

    const parent = achievementGroup.parentNode;
    if (!parent) {
      continue;
    }

    const rows: Element[] = [];
    const firstRow = achievementGroup.nextElementSibling;
    let currentElement = firstRow;

    while (
      currentElement &&
      !currentElement.matches(`${dlcGroupHeader}, .${AccordionStyles.accordionContent}`) &&
      currentElement.tagName !== 'SECTION'
    ) {
      rows.push(currentElement);
      currentElement = currentElement.nextElementSibling;
    }

    const { content, unwrap } = wrapInAccordionContent(parent, firstRow, rows);
    const unmount = mountCollapseButton(achievementGroup, content);

    cleanups.push(() => {
      unmount();
      unwrap();
    });
  }

  return () => {
    callAll(cleanups);
    giveClassBack();
  };
};

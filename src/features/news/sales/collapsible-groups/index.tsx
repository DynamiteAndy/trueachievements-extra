import { callAll } from '@ta-x-lib';
import { mount, moveInto } from '@ta-x-page';
import { settings, whileSetting } from '@ta-x-storage';
import { wrapInAccordionContent } from '@ta-x-ui';

import { saleTables } from '../sale-tables';

import { CollapsibleGroupsHeader } from './CollapsibleGroupsHeader';

const { collapsibleGroups } = settings.news.sales;

// The site's in-content ad slot
const adSlot = 'div.dyn-lb';

// Gives back a cleanup that puts the site's tables and headings back where they were and takes our headers away
const applyCollapsibleGroups = (): (() => void) => {
  const cleanups = [...document.querySelectorAll(saleTables)].map((saleTable) => {
    const wrapper = saleTable.parentElement;
    const container = wrapper?.parentNode;
    if (!wrapper || !container) {
      return () => undefined;
    }

    const { content, unwrap } = wrapInAccordionContent(container, wrapper, [wrapper]);
    // The table's own heading (the h3 just before it, past any ad slot), read before the headings move into ours
    let named = content.previousElementSibling;
    while (named?.matches(adSlot)) {
      named = named.previousElementSibling;
    }
    const name = named?.matches('h3') ? named.textContent.trim() : undefined;
    const header = mount(<CollapsibleGroupsHeader content={content} name={name} />, container, content);
    const headings = header.element?.firstElementChild;

    // The table's headings: an h3, after an h2 for a platform's first table. The site's in-content ad slots
    // (div.dyn-lb), which it adds between the groups once the page has loaded, are stepped over and stay where they
    // are, so turned on again later the headings are still found. Anything else before it stays where it is
    const tableHeadings: Element[] = [];
    let heading = header.element?.previousElementSibling;
    while (headings && heading?.matches(`h2, h3, ${adSlot}`)) {
      if (!heading.matches(adSlot)) {
        tableHeadings.unshift(heading);
      }
      heading = heading.previousElementSibling;
    }
    const putHeadingsBack = headings ? moveInto(headings, tableHeadings) : () => undefined;

    // The headings go back before the header is unmounted, as the last one goes back before it
    return () => {
      unwrap();
      putHeadingsBack();
      header.unmount();
    };
  });

  // Last table first: a table's next sibling can be the next table's heading, which is in our header until then
  return () => callAll(cleanups, { reverse: true });
};

// While the setting is on, live: turned off, the site's tables and headings go back as they were. sales/index.ts starts
// it once the tables are parsed. Returns the stop
export default (): (() => void) =>
  whileSetting([collapsibleGroups], () => collapsibleGroups.value, applyCollapsibleGroups);

import { addPageScript } from '@ta-x-page';
import { settings, whileSetting } from '@ta-x-storage';

import { saleTables } from '../sale-tables';

const { autoSortBy, autoSortByValue, autoSortByOrder } = settings.news.sales;

interface StupidTableHeader {
  stupidsort: (direction: string) => void;
  removeData: (key: string) => void;
}

// A page function (page/page-script.ts): sorts each sale table by its first header named in `columns`, in `order`. The
// site's tables use the stupid-table jQuery plugin, which the site binds only once its script loader is done
// (`head.ready`: `$("table.interactive").stupidtable()`), so a click before then does nothing.
// `stupidsort(order)` sets the order outright, where a click toggles it. A column is matched by its header's text as
// the setting stores it ("Sale Price" is `sale-price`)
export const sortSaleTables = (tables: string, columns: string[], order: string): void => {
  const page = window as Window & {
    $?: (header: Element) => StupidTableHeader;
    head?: { ready: (callback: () => void) => void };
  };

  // Its own script, to tell whether sorting was turned off (the script removed) before the site's loader was ready
  const script = document.currentScript;

  const sort = (): void => {
    if (script && !script.isConnected) {
      return;
    }

    for (const table of document.querySelectorAll(tables)) {
      const header = [...table.querySelectorAll<HTMLElement>('.headers [data-sort]')].find((th) =>
        columns.includes(th.textContent.trim().toLowerCase().replace(/\s+/g, '-'))
      );

      if (header && page.$) {
        // stupid-table keeps the direction it last sorted the column in (jQuery data, which the userscript's own world
        // can't reach), and doesn't sort that column the same way again: forgotten first, so sorting applied again
        // after being turned off (the rows put back) sorts
        page.$(header).removeData('sort-dir');
        page.$(header).stupidsort(order);
      }
    }
  };

  if (page.head) {
    page.head.ready(sort);
  } else if (document.readyState === 'complete') {
    // Applied again once the page has loaded (turned on, or changed, from the menu), the load has already passed
    sort();
  } else {
    page.addEventListener('load', sort, { once: true });
  }
};

// Each sale table as it is before sorting: its rows (and the whitespace between them) in order, and its headers' sort
// state (stupid-table marks the sorted header with a class and data-sort-dir), so turning sorting off puts back exactly
// the order the page had, also for a table the author ordered by hand rather than by product
type TableOrder = {
  body: HTMLTableSectionElement;
  // Every node, the whitespace between rows too, so the markup comes back exactly
  nodes: ChildNode[];
  headers: { header: HTMLElement; className: string; sortDirection: string | null }[];
};

const recordOrder = (): TableOrder[] =>
  [...document.querySelectorAll<HTMLTableElement>(saleTables)].flatMap((table) => {
    const [body] = table.tBodies;

    return body
      ? [
          {
            body,
            nodes: [...body.childNodes],
            headers: [...table.querySelectorAll<HTMLElement>('.headers [data-sort]')].map((header) => ({
              header,
              className: header.className,
              sortDirection: header.getAttribute('data-sort-dir')
            }))
          }
        ]
      : [];
  });

const restoreOrder = (tables: TableOrder[]): void => {
  for (const { body, nodes, headers } of tables) {
    // A node added since (the site's ad rows come once the page has loaded) goes back after the recorded node it now
    // follows, rather than ending up first
    const recorded = new Set<ChildNode>(nodes);
    const added = [...body.childNodes]
      .filter((node) => !recorded.has(node))
      .map((node) => {
        let after = node.previousSibling;
        while (after && !recorded.has(after)) {
          after = after.previousSibling;
        }

        return { node, after };
      });

    // Nodes another feature took out of the table since aren't put back into it
    body.append(...nodes.filter((node) => node.parentNode === body));
    for (const { node, after } of added) {
      if (after?.parentNode === body) {
        after.after(node);
      } else {
        body.prepend(node);
      }
    }
    for (const { header, className, sortDirection } of headers) {
      header.className = className;
      if (sortDirection === null) {
        header.removeAttribute('data-sort-dir');
      } else {
        header.setAttribute('data-sort-dir', sortDirection);
      }
    }
  }
};

// While sorting is on, live: changing the column or order sorts again, and turning it off puts each table back as it
// was. Products ascending is how the site serves them, so that sorts nothing. sales/index.ts starts it once the tables
// are parsed. Returns the stop
export default (): (() => void) =>
  whileSetting(
    [autoSortBy, autoSortByValue, autoSortByOrder],
    () => {
      // All three read every time: a read skipped by && isn't tracked, and a change to it wouldn't sort again
      const on = autoSortBy.value;
      const columns = autoSortByValue.value;
      const order = autoSortByOrder.value;

      return on && !(columns.includes('product') && order === 'asc');
    },
    () => {
      const before = recordOrder();
      const script = addPageScript('ta-x-sales-auto-sort-by', sortSaleTables, [
        saleTables,
        autoSortByValue.peek(),
        autoSortByOrder.peek()
      ]);

      return () => {
        script.remove();
        restoreOrder(before);
      };
    }
  );

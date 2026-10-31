import { mountDetached, type DetachedRoot } from '@ta-x-page';

import { HideableRow } from './HideableRow';
import styles from './styles';

interface HideRowOptions {
  // The row itself, or an element inside it (a forum thread's title link, a sale table's cell)
  element: HTMLElement;
  method: 'forum' | 'table';
  // What hid it, after "Hidden by" (e.g. `filter "xbox"`). With a prefix it's quoted after it: the sales features pass
  // `Hide` and `Owned Items`, and reasons sharing a prefix share the quotes ("Hide Unobtainable Items and Owned Items")
  hiddenBy: string;
  prefix?: string;
}

// The site's markup for each kind of row: the row, where our toggle goes and where the filter text goes
const findRow = ({ element, method }: HideRowOptions): HTMLElement | null =>
  method === 'forum' ? element.closest('li') : element.closest('tr');

const getParts = ({ element, method }: HideRowOptions, row: HTMLElement, toggleTarget: HTMLElement) => ({
  row,
  toggleTarget,
  filterTarget: method === 'forum' ? element.closest('div') : row.querySelector('td'),
  // The thread's title, or the sale's game (its first cell), read before our filter text goes in
  name: (method === 'forum' ? element : row.querySelector('td'))?.textContent.trim().replace(/\s+/g, ' ') ?? ''
});

// A table row's toggle goes in a wrapper with whatever the site has in its last cell (a sale's unobtainable flag), so
// the two sit side by side in a narrow column. Returns the wrapper and how to put the cell back
const wrapToggleCell = (cell: HTMLElement): { wrapper: HTMLElement; unwrap: () => void } => {
  const wrapper = document.createElement('div');
  wrapper.className = styles.toggleCell;
  wrapper.append(...cell.childNodes);
  cell.append(wrapper);

  return {
    wrapper,
    unwrap: () => {
      wrapper.replaceWith(...wrapper.childNodes);
    }
  };
};

// A row's one controller, and what hid it, per feature hiding it (several can: an owned game that's also unobtainable)
interface RowController {
  parts: ReturnType<typeof getParts>;
  // Rendered once its first reason is set
  root: DetachedRoot;
  reasons: Map<symbol, Pick<HideRowOptions, 'hiddenBy' | 'prefix'>>;
  unwrap: () => void;
}

const controllers = new WeakMap<HTMLElement, RowController>();

// "A", "A and B", "A, B and C"
const listed = (items: string[]): string =>
  items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : (items[0] ?? '');

// One phrase per prefix (in the order first given), its reasons listed inside one pair of quotes, and one per reason
// without a prefix
const phrases = (reasons: RowController['reasons']): string[] => {
  const groups: { prefix?: string; names: string[] }[] = [];

  for (const { hiddenBy, prefix } of reasons.values()) {
    const group = prefix === undefined ? undefined : groups.find((existing) => existing.prefix === prefix);
    if (group) {
      group.names.push(hiddenBy);
    } else {
      groups.push({ prefix, names: [hiddenBy] });
    }
  }

  return groups.map(({ prefix, names }) => (prefix === undefined ? names[0] : `"${prefix} ${listed(names)}"`));
};

const renderController = ({ parts, root, reasons }: RowController): void => {
  const hiddenBy = listed(phrases(reasons));

  root.render(<HideableRow {...parts} hiddenBy={hiddenBy} />);
};

const createController = (options: HideRowOptions, row: HTMLElement, toggleTarget: HTMLElement): RowController => {
  const { wrapper, unwrap } =
    options.method === 'table' ? wrapToggleCell(toggleTarget) : { wrapper: toggleTarget, unwrap: () => undefined };

  return { parts: getParts(options, row, wrapper), root: mountDetached(null), reasons: new Map(), unwrap };
};

// Hides one of the site's rows behind a toggle, saying why. The row is controlled by a HideableRow rendered into a
// root of its own that isn't on the page: everything it adds goes into the row's cells. A row another feature already
// hides keeps its one controller and toggle, which then gives every reason on one line. Returns this feature's unmount:
// the row is given back to the site as it was once every feature hiding it has unmounted
export const hideRow = (options: HideRowOptions): (() => void) => {
  const row = findRow(options);
  // The toggle goes in the row's last cell (or a thread's last part): a row without one is left as it is
  const toggleTarget = row?.lastElementChild;
  if (!row || !(toggleTarget instanceof HTMLElement)) {
    return () => undefined;
  }

  const controller = controllers.get(row) ?? createController(options, row, toggleTarget);
  const reason = Symbol(options.hiddenBy);

  controllers.set(row, controller);
  controller.reasons.set(reason, { hiddenBy: options.hiddenBy, prefix: options.prefix });
  renderController(controller);

  return () => {
    if (!controller.reasons.delete(reason)) {
      return;
    }

    if (controller.reasons.size > 0) {
      renderController(controller);
      return;
    }

    controllers.delete(row);
    controller.root.unmount();
    controller.unwrap();
  };
};

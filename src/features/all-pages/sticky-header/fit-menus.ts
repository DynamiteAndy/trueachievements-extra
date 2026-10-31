import styles from './styles';

// The site's menus in the header (Gaming, Community, My Links), each shown while its item is hovered
export const NAV_MENU_ITEMS = '.nav-primary .items > li:not(.search)';

// The site's menu width (px), the most columns a menu gets, and the gap between them (rem). Given to the stylesheet
// with the column count, so they're written only here
const COLUMN_WIDTH = 300;
const MOST_COLUMNS = 3;
const COLUMN_GAP_REM = 0.5;

// The site's desktop layout, where it shows its menus on hover; below it, its own mobile menu. The stylesheet's media
// query for the columns is the same (sticky-header.scss): a media query can't read a custom property
const DESKTOP = '(min-width: 768px)';

const px = (value: string): number => parseFloat(value) || 0;

// The narrowest a column may be: two of its longest link side by side, each on one line, in the stylesheet's equal
// halves with the gap between. A link too long for half the site's own menu wraps there already, so it doesn't hold
// the others to its width
export const narrowestColumn = (linkWidths: number[], gap: number): number => {
  const fitting = linkWidths.filter((width) => width <= (COLUMN_WIDTH - gap) / 2);
  return fitting.length > 0 ? Math.ceil(2 * Math.max(...fitting) + gap) : COLUMN_WIDTH;
};

// The width of each of `columns` columns: what the widest group needs, so no room is left over, if that many fit
// across the room there is; null when they don't
export const columnWidth = (
  columns: number,
  across: number,
  gap: number,
  padding: number,
  narrowest: number
): number | null => {
  const room = Math.floor((across - padding - (columns - 1) * gap) / columns);
  return room >= narrowest ? narrowest : null;
};

// The box of ours that holds a fitted menu's groups in their columns, so the menu around it can scroll (a box laid out
// in columns spills sideways rather than down), and in it a box of ours for each heading with its links, kept whole
const columnsBox = (menu: Element): HTMLElement | null =>
  menu.querySelector<HTMLElement>(`:scope > .${styles.fitMenuColumns}`);

const wrapGroups = (menu: Element): HTMLElement => {
  const box = document.createElement('div');
  box.className = styles.fitMenuColumns;
  let group: HTMLElement | null = null;
  // A copy: moving the nodes would shift the live list under the loop
  for (const node of Array.from(menu.childNodes)) {
    const heading = node instanceof Element && node.matches('[data-tgl]');
    // Space before the first heading stays loose in our box, in its place
    if (!group && node instanceof Text && !node.textContent.trim()) {
      box.append(node);
      continue;
    }
    if (!group || heading) {
      group = document.createElement('div');
      group.className = styles.fitMenuGroup;
      box.append(group);
    }
    group.append(node);
  }
  menu.append(box);
  return box;
};

// The site's nodes back in the menu, in order
const unwrapGroups = (menu: Element): void => {
  const box = columnsBox(menu);
  if (!box) {
    return;
  }

  // A copy: moving the nodes would shift the live list under the loop
  for (const node of Array.from(box.childNodes)) {
    if (node instanceof Element && node.classList.contains(styles.fitMenuGroup)) {
      menu.append(...node.childNodes);
    } else {
      menu.append(node);
    }
  }
  box.remove();
};

// One column is the site's own menu: its nodes go back in it, and our classes and properties come off, along with the
// attributes they leave empty
const setColumns = (item: HTMLElement, menu: Element, columns: number, width = COLUMN_WIDTH): void => {
  const { menuColumns, menuColumnWidth, menuColumnGap, menuLeft, menuMaxHeight, menuScrollbar } = styles.variables;

  if (columns > 1) {
    if (!columnsBox(menu)) {
      wrapGroups(menu);
    }
    item.classList.add(styles.fitMenu);
    item.style.setProperty(menuColumns, String(columns));
    item.style.setProperty(menuColumnWidth, `${width}px`);
    item.style.setProperty(menuColumnGap, `${COLUMN_GAP_REM}rem`);
    return;
  }

  unwrapGroups(menu);
  item.classList.remove(styles.fitMenu, styles.fitMenuMeasuring, styles.fitMenuScrolls);
  [menuColumns, menuColumnWidth, menuColumnGap, menuLeft, menuMaxHeight, menuScrollbar].forEach((property) =>
    item.style.removeProperty(property)
  );
  for (const attribute of ['class', 'style']) {
    if (item.getAttribute(attribute) === '') {
      item.removeAttribute(attribute);
    }
  }
};

// Each link's width on one line, with the side padding the stylesheet gives it in a fitted menu. Each group is given
// its own longest, which sets how many of its links share a line
const linkWidths = (item: HTMLElement, menu: Element): number[] => {
  const box = columnsBox(menu) ?? wrapGroups(menu);
  item.classList.add(styles.fitMenu, styles.fitMenuMeasuring);
  // Every width read before any is written, so the menu is laid out once
  const groups = [...box.querySelectorAll<HTMLElement>(`.${styles.fitMenuGroup}`)].map((group) => ({
    group,
    widths: [...group.querySelectorAll(':scope > div > a')].map((link) => link.getBoundingClientRect().width)
  }));
  item.classList.remove(styles.fitMenuMeasuring);
  for (const { group, widths } of groups) {
    group.style.setProperty(styles.variables.groupLinkWidth, `${Math.ceil(Math.max(0, ...widths))}px`);
  }
  return groups.flatMap(({ widths }) => widths);
};

// Fits an item's menu above the bottom of the window: the fewest columns that do it (up to MOST_COLUMNS) that fit
// across it, each only as wide as two of its longest links need. When even the most columns are too tall, it keeps
// them and scrolls. Measured as it opens, so each opening suits the window then
export const fitMenu = (item: HTMLElement): void => {
  const menu = item.querySelector(':scope > div');
  if (!menu) {
    return;
  }

  setColumns(item, menu, 1);
  if (!window.matchMedia(DESKTOP).matches) {
    return;
  }

  const tooTall = (): boolean => menu.getBoundingClientRect().bottom > window.innerHeight;
  if (!tooTall()) {
    return;
  }

  const style = getComputedStyle(menu);
  const gap = COLUMN_GAP_REM * px(getComputedStyle(document.documentElement).fontSize);
  const padding = px(style.paddingLeft) + px(style.paddingRight);
  const narrowest = narrowestColumn(linkWidths(item, menu), gap);
  const across = document.documentElement.clientWidth;
  // Centred under the menu bar, moved along as far as it takes to stay in the window. Its left is from the bar's, which
  // the stylesheet places it by
  const bar = (item.parentElement ?? item).getBoundingClientRect();
  const placeUnderBar = (columns: number, width: number, scrollbar = 0): void => {
    const menuWidth = columns * width + (columns - 1) * gap + padding + scrollbar;
    const left = Math.min(Math.max(bar.left + (bar.width - menuWidth) / 2, 0), across - menuWidth);
    item.style.setProperty(styles.variables.menuLeft, `${Math.round(left - bar.left)}px`);
  };
  let fitted: { columns: number; width: number } | null = null;
  for (let columns = 2; columns <= MOST_COLUMNS; columns++) {
    const width = columnWidth(columns, across, gap, padding, narrowest);
    if (width === null) {
      break;
    }

    fitted = { columns, width };
    setColumns(item, menu, columns, width);
    placeUnderBar(columns, width);
    if (!tooTall()) {
      return;
    }
  }

  // Not even two columns fit across: the site's own menu, as it was
  if (!fitted) {
    setColumns(item, menu, 1);
    return;
  }

  // Still too tall with the most columns it gets: as tall as the window leaves below its top, scrolling inside. Its
  // scrollbar would take its width from the columns, so the menu is widened by it (measured, as browsers differ, less
  // any border), a column fewer if that leaves it too wide for the window
  const maxHeight =
    window.innerHeight - menu.getBoundingClientRect().top - px(style.paddingTop) - px(style.paddingBottom);
  item.classList.add(styles.fitMenuScrolls);
  item.style.setProperty(styles.variables.menuMaxHeight, `${Math.max(0, Math.floor(maxHeight))}px`);
  const scrollbar =
    menu instanceof HTMLElement
      ? menu.offsetWidth - menu.clientWidth - px(style.borderLeftWidth) - px(style.borderRightWidth)
      : 0;
  item.style.setProperty(styles.variables.menuScrollbar, `${scrollbar}px`);
  let { columns } = fitted;
  while (columns > 2 && columns * fitted.width + (columns - 1) * gap + padding + scrollbar > across) {
    columns--;
  }
  if (columns !== fitted.columns) {
    setColumns(item, menu, columns, fitted.width);
  }
  placeUnderBar(columns, fitted.width, scrollbar);
};

// Puts an item's menu back as the site has it
const restore = (item: HTMLElement): void => {
  const menu = item.querySelector(':scope > div');
  if (menu) {
    setColumns(item, menu, 1);
  }
};

// Fits each of the header's menus to the window as the pointer enters its item (the site shows it on hover, so it's
// showing by then), and puts it back as a mouse or pen leaves (the menu is inside the item, so moving onto it isn't
// leaving), so the site's nodes aren't left in our boxes. A finger lifting counts as leaving too, while the tapped menu
// stays open, so touch leaves it fitted. Every menu is also put back as the window drops below the site's desktop
// layout, whose mobile menu would otherwise find our boxes. Returns a stop function, which puts every menu back
export const fitMenusToWindow = (header: HTMLElement): (() => void) => {
  const restoreAll = (): void => header.querySelectorAll<HTMLElement>(NAV_MENU_ITEMS).forEach(restore);
  const isItem = (target: EventTarget | null): target is HTMLElement =>
    target instanceof HTMLElement && target.matches(NAV_MENU_ITEMS);
  const onEnter = ({ target }: Event): void => {
    if (isItem(target)) {
      fitMenu(target);
    }
  };
  const onLeave = (event: PointerEvent): void => {
    if (event.pointerType !== 'touch' && isItem(event.target)) {
      restore(event.target);
    }
  };
  const desktop = window.matchMedia(DESKTOP);
  const onLayoutChange = ({ matches }: MediaQueryListEvent): void => {
    if (!matches) {
      restoreAll();
    }
  };

  // Entering and leaving don't bubble, so they're caught on their way down
  header.addEventListener('pointerenter', onEnter, { capture: true, passive: true });
  header.addEventListener('pointerleave', onLeave, { capture: true, passive: true });
  desktop.addEventListener('change', onLayoutChange);

  return () => {
    header.removeEventListener('pointerenter', onEnter, { capture: true });
    header.removeEventListener('pointerleave', onLeave, { capture: true });
    desktop.removeEventListener('change', onLayoutChange);
    restoreAll();
  };
};

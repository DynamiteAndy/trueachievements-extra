export default {
  stickyHeader: 'ta-x-sticky-header',
  // On a header menu's item while Fit Menus To Window gives its menu more than one column
  fitMenu: 'ta-x-sticky-header-fit-menu',
  // Also on it for a moment as the menu opens, while its groups' natural widths are read
  fitMenuMeasuring: 'ta-x-sticky-header-fit-menu-measuring',
  // Also on it while even its most columns are too tall for the window, so the menu scrolls
  fitMenuScrolls: 'ta-x-sticky-header-fit-menu-scrolls',
  // The box of ours, inside the menu, that holds its groups in columns (so the menu around it can scroll)
  fitMenuColumns: 'ta-x-sticky-header-fit-menu-columns',
  // A box of ours in it for each heading with its links, kept whole in a column
  fitMenuGroup: 'ta-x-sticky-header-fit-menu-group',
  // How many columns that menu has, their width, the gap between them, and the menu's height while it scrolls (set
  // from fit-menus.ts, the one place their sizes are written)
  variables: {
    menuColumns: '--ta-x-sticky-header-menu-columns',
    menuColumnWidth: '--ta-x-sticky-header-menu-column-width',
    menuColumnGap: '--ta-x-sticky-header-menu-column-gap',
    // Where the menu starts, from the menu bar's left: under the bar's middle, kept in the window
    menuLeft: '--ta-x-sticky-header-menu-left',
    menuMaxHeight: '--ta-x-sticky-header-menu-max-height',
    // The width of its scrollbar then, which the menu is widened by
    menuScrollbar: '--ta-x-sticky-header-menu-scrollbar',
    // On each of our group boxes: its longest link, which sets how many of its links share a line
    groupLinkWidth: '--ta-x-sticky-header-group-link-width'
  }
} as const;

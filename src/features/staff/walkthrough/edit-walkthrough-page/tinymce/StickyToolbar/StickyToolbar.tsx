import { addClasses, resizeObserver, stickUnderHeader } from '@ta-x-page';
import { useLayoutEffect } from 'preact/hooks';

import styles from '../../styles';

const { variables } = styles;

// How long after the last scroll event the menus are placed once more (a pause, so it runs once per scroll however many
// events it fires)
export const SETTLE_MS = 250;

// Where an element's top is on the page (not the window), in whole px
const pageTop = (element: HTMLElement): number => Math.round(element.getBoundingClientRect().top + window.scrollY);

// TinyMCE's floating menus (e.g. the Paragraph dropdown) open just under the toolbar, wherever it's stuck
const placeFloatingMenus = (toolbar: HTMLElement): void => {
  const top = pageTop(toolbar);
  document.documentElement.style.setProperty(
    variables.stickyTinymceToolbarFloatingMenu,
    `${toolbar.offsetHeight + top}px`
  );
};

// Whether one of the toolbar's menus is open (TinyMCE hides a closed one, kept in <body>, with display: none). Only
// then does a scroll need to move it with the toolbar: placing them sets a property every element inherits, which
// restyles the whole page
const toolbarMenuOpen = (): boolean =>
  [
    ...document.querySelectorAll<HTMLElement>('body > .mce-menu.mce-floatpanel:not(.mce-menu-sub):not(.mce-fixed)')
  ].some((menu) => menu.style.display !== 'none');

interface StickyToolbarProps {
  // TinyMCE's toolbar (in our page, not the editor's iframe)
  toolbar: HTMLElement;
  // The editor, which the toolbar sticks within
  container: HTMLElement;
  // When the editor has loaded: the menus can only be placed after that. Shared by `tinymce()`, so it isn't missed
  editorLoaded?: Promise<void>;
}

// A controller for the editor's toolbar: stuck under the site's header while the walkthrough scrolls (stickUnderHeader,
// kept above the editing area, so off the status bar), with TinyMCE's floating menus following it: an open one at once
// on a scroll and each frame of the header's slide, and all of them again once the toolbar has settled (one settled
// move per scroll, however many scroll events it fires), and when its slide ends. It renders nothing of its own, and
// gives the toolbar back on unmount. The menus' place stays where it last was: their rule doesn't depend on the toolbar
// being stuck, and its fallback would open them at the page's top
export const StickyToolbar = ({ toolbar, container, editorLoaded }: StickyToolbarProps) => {
  useLayoutEffect(() => {
    let loaded = false;
    let mounted = true;
    let settling: ReturnType<typeof setTimeout>;

    const placeMenus = (): void => {
      if (loaded) {
        placeFloatingMenus(toolbar);
      }
    };

    const stopSticking = stickUnderHeader({
      element: toolbar,
      container,
      end: container.querySelector<HTMLElement>('.mce-edit-area'),
      onMoved: (reason) => {
        if (reason === 'slide-end' || toolbarMenuOpen()) {
          placeMenus();
        }
        if (loaded && reason === 'scroll') {
          clearTimeout(settling);
          settling = setTimeout(() => placeFloatingMenus(toolbar), SETTLE_MS);
        }
      }
    });

    void editorLoaded?.then(() => {
      if (mounted) {
        loaded = true;
        placeFloatingMenus(toolbar);
      }
    });
    // TinyMCE can say its editor has loaded before its skin has laid the toolbar out, while it's many rows tall: the
    // menus are placed again as its height settles, and as a narrower window wraps it onto more rows
    const stopFollowingSize = resizeObserver.observe(toolbar, placeMenus);
    const giveClassBack = addClasses(toolbar, styles.stickyTinymceToolbar);
    // Placed again as a button is pressed, before TinyMCE opens its menu: a place worked out earlier can be stale, as
    // the page above the editor can still move without a scroll
    const onPress = (): void => placeFloatingMenus(toolbar);
    toolbar.addEventListener('mousedown', onPress, true);
    toolbar.addEventListener('keydown', onPress, true);

    return () => {
      mounted = false;
      toolbar.removeEventListener('mousedown', onPress, true);
      toolbar.removeEventListener('keydown', onPress, true);
      clearTimeout(settling);
      stopFollowingSize();
      stopSticking();
      giveClassBack();
    };
  }, [toolbar, container, editorLoaded]);

  return null;
};

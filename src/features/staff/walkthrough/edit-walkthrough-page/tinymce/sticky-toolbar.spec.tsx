import * as taxPage from '@ta-x-page';
import { find, pressKey, readFixture, required, setHtml, useFakeTimers } from '@ta-x-test';

import type { MockInstance } from 'vitest';

import styles from '../styles';

import { editorLoaded, type Editor } from './editor-loaded';
import { stickyToolbar } from './sticky-toolbar';
import { SETTLE_MS } from './StickyToolbar';

// How the toolbar sticks (and comes unstuck) is stickUnderHeader's own spec: this checks what it's given, and the menus
describe('staff/walkthrough/edit-walkthrough-page/tinymce/sticky-toolbar', () => {
  const { variables } = styles;
  const variable = (name: string): string => document.documentElement.style.getPropertyValue(name);

  const container = (): HTMLElement => find('.mce-tinymce');
  const toolbar = (): HTMLElement => find('.mce-toolbar-grp');
  const iframe = (): HTMLIFrameElement => find('#txtWalkthrough_ifr');

  // The toolbar as high as live, its top `top` px down the page
  const placeToolbarAt = (top: number): void => {
    Object.defineProperty(toolbar(), 'offsetHeight', { value: 68, configurable: true });
    toolbar().getBoundingClientRect = () => ({ top, left: 0 }) as DOMRect;
  };

  // The editor shared by tinymce(), and its iframe loading
  let editor: Editor;
  const loadEditor = async (): Promise<void> => {
    iframe().dispatchEvent(new Event('load'));
    await vi.advanceTimersByTimeAsync(0);
  };

  // Sets the toolbar up as the feature does, unmounting it when the test ends
  const setUp = async (loaded: Editor | null): Promise<(() => void) | undefined> => {
    const unmount = await stickyToolbar(container(), loaded);
    if (unmount) {
      onTestFinished(unmount);
    }

    return unmount;
  };

  const scroll = async (): Promise<void> => {
    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(0);
  };
  const slideEnds = (propertyName: string): void => {
    toolbar().dispatchEvent(Object.assign(new Event('transitionend'), { propertyName }));
  };

  let stickUnderHeader: MockInstance<typeof taxPage.stickUnderHeader>;
  let floatingMenuWrites: () => number;

  beforeEach(() => {
    useFakeTimers();
    stickUnderHeader = vi.spyOn(taxPage, 'stickUnderHeader');
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-editor.html');
    document.documentElement.removeAttribute('style');
    editor = { iframe: iframe(), loaded: editorLoaded(iframe()) };
    placeToolbarAt(399);
    const setProperty = vi.spyOn(document.documentElement.style, 'setProperty');
    floatingMenuWrites = () =>
      setProperty.mock.calls.filter(([name]) => name === variables.stickyTinymceToolbarFloatingMenu).length;
  });

  test('should do nothing without a toolbar', async () => {
    vi.spyOn(taxPage, 'waitForElement').mockResolvedValueOnce(null);

    await setUp(editor);

    expect(toolbar().classList).not.toContain(styles.stickyTinymceToolbar);
    expect(stickUnderHeader).not.toHaveBeenCalled();
  });

  test('should stick the toolbar under the header within the editor, kept above the editing area', async () => {
    await setUp(editor);

    expect(toolbar().classList).toContain(styles.stickyTinymceToolbar);
    expect(stickUnderHeader).toHaveBeenCalledExactlyOnceWith({
      element: toolbar(),
      container: container(),
      end: find('.mce-edit-area', container()),
      onMoved: expect.any(Function)
    });
  });

  test("should place the menus under the toolbar once the editor's iframe has loaded", async () => {
    await setUp(editor);
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('');

    await loadEditor();

    // Its top down the page, plus its height
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('467px');
  });

  test('should place the menus at once if the editor loaded before the toolbar was set up', async () => {
    // The iframe's load has already fired when the toolbar is set up
    await loadEditor();

    await setUp(editor);
    await vi.advanceTimersByTimeAsync(0);

    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('467px');
  });

  test('should still stick the toolbar without the editor', async () => {
    await setUp(null);
    await scroll();

    expect(toolbar().classList).toContain(styles.stickyTinymceToolbar);
    expect(stickUnderHeader).toHaveBeenCalledExactlyOnceWith({
      element: toolbar(),
      container: container(),
      end: find('.mce-edit-area', container()),
      onMoved: expect.any(Function)
    });
    expect(floatingMenuWrites()).toBe(0);
  });

  test('should not move the menus on scroll, nor once it settles, until the editor has loaded', async () => {
    await setUp(editor);

    await scroll();
    await vi.advanceTimersByTimeAsync(SETTLE_MS);

    expect(floatingMenuWrites()).toBe(0);
  });

  // TinyMCE's floating menus as it keeps them in <body>: the toolbar's Paragraph menu and a dialog's dropdown (mce-fixed),
  // each shown or hidden as TinyMCE does, with an inline display
  const floatingMenus = (): { toolbar: HTMLElement; dialog: HTMLElement } => {
    document.body.insertAdjacentHTML(
      'beforeend',
      readFixture('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-floating-menus.html')
    );
    const [toolbar, dialog] = [find('body > .mce-menu:not(.mce-fixed)'), find('body > .mce-menu.mce-fixed')];
    onTestFinished(() => [toolbar, dialog].forEach((menu) => menu.remove()));
    [toolbar, dialog].forEach((menu) => (menu.style.display = 'none'));
    return { toolbar, dialog };
  };
  const toolbarMenu = (open: boolean): HTMLElement => {
    const { toolbar } = floatingMenus();
    toolbar.style.display = open ? 'block' : 'none';
    return toolbar;
  };

  test('should move the menus only once a scroll settles while no menu is open', async () => {
    await setUp(editor);
    await loadEditor();
    toolbarMenu(false);
    const writes = floatingMenuWrites();
    placeToolbarAt(649);

    // Several events, so each one has to put the settle back, not only the first
    await scroll();
    await scroll();
    await scroll();
    expect(floatingMenuWrites()).toBe(writes);

    await vi.advanceTimersByTimeAsync(SETTLE_MS);
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('717px');
    expect(floatingMenuWrites()).toBe(writes + 1);
  });

  test("should not count a submenu or a dialog's dropdown as a toolbar menu open", async () => {
    await setUp(editor);
    await loadEditor();
    const { toolbar, dialog } = floatingMenus();
    // A submenu is a floating menu too, marked mce-menu-sub
    toolbar.classList.add('mce-menu-sub');
    toolbar.style.display = 'block';
    dialog.style.display = 'block';
    const writes = floatingMenuWrites();

    await scroll();

    expect(floatingMenuWrites()).toBe(writes);
  });

  test('should move an open menu with the toolbar on scroll, and once more after it settles', async () => {
    await setUp(editor);
    await loadEditor();
    toolbarMenu(true);
    placeToolbarAt(649);

    await scroll();

    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('717px');
    expect(floatingMenuWrites()).toBe(2);

    placeToolbarAt(637);
    await vi.advanceTimersByTimeAsync(SETTLE_MS);

    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('705px');
    expect(floatingMenuWrites()).toBe(3);
  });

  test("should move an open menu with the toolbar each frame of the header's slide, and leave closed ones be", async () => {
    await setUp(editor);
    await loadEditor();
    const [[{ onMoved }]] = stickUnderHeader.mock.calls;
    const slideFrame = (): void => required(onMoved)('slide');
    const menu = toolbarMenu(false);
    const writes = floatingMenuWrites();

    placeToolbarAt(5);
    slideFrame();
    expect(floatingMenuWrites()).toBe(writes);

    menu.style.display = 'block';
    placeToolbarAt(20);
    slideFrame();
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('88px');
    placeToolbarAt(42);
    slideFrame();
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('110px');
    expect(floatingMenuWrites()).toBe(writes + 2);
  });

  test('should place the menus again as a toolbar button is pressed, as an earlier place can be stale', async () => {
    // Placed while the page above the editor is still settling, the menus would open too low
    await setUp(editor);
    await loadEditor();
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('467px');

    // The page above has moved since, without a scroll
    // A button in the toolbar (the condensed fixture keeps its groups, not their buttons)
    const button = (): Element => toolbar().querySelector('div') ?? toolbar();
    placeToolbarAt(1124);
    button().dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('1192px');

    placeToolbarAt(399);
    pressKey(button(), 'Enter');
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('467px');
  });

  // TinyMCE can say it has loaded while its skin is still laying the toolbar out, one button to a row
  test("should place the menus again as the toolbar's height settles, once the editor has loaded", async () => {
    const observe = vi.spyOn(taxPage.resizeObserver, 'observe');
    await setUp(editor);
    const resized = required(observe.mock.calls.find(([element]) => element === toolbar()))[1];
    Object.defineProperty(toolbar(), 'offsetHeight', { value: 938, configurable: true });
    resized({} as ResizeObserverEntry);
    expect(floatingMenuWrites()).toBe(0);

    await loadEditor();
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('1337px');

    placeToolbarAt(399);
    resized({} as ResizeObserverEntry);
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('467px');
  });

  test("should stop following the toolbar's size once unmounted", async () => {
    const stopFollowing = vi.fn();
    const observe = taxPage.resizeObserver.observe.bind(taxPage.resizeObserver);
    vi.spyOn(taxPage.resizeObserver, 'observe').mockImplementation((element, callback) => {
      const stop = observe(element, callback);
      return element === toolbar() ? stopFollowing.mockImplementation(stop) : stop;
    });
    const unmount = await setUp(editor);
    expect(stopFollowing).not.toHaveBeenCalled();

    required(unmount)();

    expect(stopFollowing).toHaveBeenCalledOnce();
  });

  test("should move the menus again when the toolbar's slide ends, but not before the editor has loaded", async () => {
    await setUp(editor);

    slideEnds('transform');
    expect(floatingMenuWrites()).toBe(0);

    await loadEditor();
    // Where the slide ends, down the page
    placeToolbarAt(649);
    slideEnds('opacity');
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('467px');

    slideEnds('transform');
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('717px');
  });

  test('should give the toolbar back and stop following it once unmounted', async () => {
    const unmount = await setUp(editor);
    await loadEditor();
    await scroll();
    const writes = floatingMenuWrites();

    required(unmount)();
    await scroll();
    await vi.advanceTimersByTimeAsync(SETTLE_MS);
    slideEnds('transform');

    expect(toolbar().classList).not.toContain(styles.stickyTinymceToolbar);
    // Given back by stickUnderHeader (what that undoes is its own spec)
    expect(toolbar().classList).not.toContain(taxPage.stickyUnderHeaderStyles.stickyUnderHeader);
    expect(floatingMenuWrites()).toBe(writes);
  });

  test("should not settle the menus once more after the toolbar's slide ends, as a scroll does", async () => {
    await setUp(editor);
    await loadEditor();

    slideEnds('transform');
    const writes = floatingMenuWrites();
    placeToolbarAt(649);
    await vi.advanceTimersByTimeAsync(SETTLE_MS);

    expect(floatingMenuWrites()).toBe(writes);
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('467px');
  });

  test('should not place the menus if the editor loads after it was unmounted', async () => {
    const unmount = await setUp(editor);

    required(unmount)();
    await loadEditor();

    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('');
    expect(floatingMenuWrites()).toBe(0);
  });

  test('should stop placing the menus as a key is pressed in the toolbar once unmounted', async () => {
    const unmount = await setUp(editor);
    await loadEditor();
    const writes = floatingMenuWrites();

    required(unmount)();
    placeToolbarAt(1124);
    pressKey(toolbar(), 'Enter');

    expect(floatingMenuWrites()).toBe(writes);
    // The last place stays: the menu rule doesn't depend on the toolbar being stuck, and without the property its
    // fallback of none would open the menus at the top of the page rather than under the toolbar
    expect(variable(variables.stickyTinymceToolbarFloatingMenu)).toBe('467px');
  });
});

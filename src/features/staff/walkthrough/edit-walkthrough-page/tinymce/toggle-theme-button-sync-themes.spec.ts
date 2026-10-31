import { settings } from '@ta-x-storage';
import { find, readFixture, setHtml, tick } from '@ta-x-test';

import attributes from '../attributes';

import { syncThemes } from './toggle-theme-button';

import type { Editor } from './editor-loaded';

describe('staff/walkthrough/edit-walkthrough-page/tinymce/toggle-theme-button syncThemes', () => {
  const { tinymceTheme } = settings.staff.walkthrough.editWalkthroughPage;
  // The site's page, which carries its theme, and the editor's TA-X group with its theme toggle
  const page = (): HTMLElement => find('.page');
  const toggle = (): HTMLElement => find(`[aria-label="Toggle Theme"] [${attributes.tinymceTheme}]`);
  // Delivered by the shared mutation observer
  const observed = tick;

  let editorBody: HTMLElement;
  let stop: () => void;

  beforeEach(() => {
    setHtml('@ta-x-test-views/home-page/header-signed-in.html');
    const group = readFixture('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-our-group.html');
    document.body.insertAdjacentHTML('beforeend', group);
    // happy-dom doesn't load iframes, so a document of its own stands in for the editor's (its body is #tinymce)
    const editorDocument = document.implementation.createHTMLDocument('');
    editorDocument.body.id = 'tinymce';
    editorBody = editorDocument.body;
    const iframe = document.createElement('iframe');
    Object.defineProperty(iframe, 'contentDocument', { value: editorDocument });
    const editor: Editor = { iframe, loaded: Promise.resolve() };

    stop = syncThemes(editor, page(), toggle());
  });

  afterEach(() => stop());

  test("should set the toggle to the site's theme when it switches, and theme the editor", async () => {
    page().setAttribute('data-theme', 'normal');
    await observed();

    expect(toggle().getAttribute(attributes.tinymceTheme)).toBe('');
    expect(document.body.getAttribute(attributes.theme)).toBe('');
    // The site's light theme (`normal` after a reload) saved and given to the editor as its light, `''`, as a click
    // would
    expect(tinymceTheme.peek()).toBe('');
    expect(editorBody.getAttribute(attributes.tinymceTheme)).toBe('');

    page().setAttribute('data-theme', 'dark');
    await observed();

    expect(toggle().getAttribute(attributes.tinymceTheme)).toBe('dark');
    expect(document.body.getAttribute(attributes.theme)).toBe('dark');
    expect(tinymceTheme.peek()).toBe('dark');
    expect(editorBody.getAttribute(attributes.tinymceTheme)).toBe('dark');
  });

  // The toolbar's Paragraph menu as TinyMCE leaves it opened in the dark theme: its first preview given the dark
  // content's colours inline, as TinyMCE does (the fixture's inline styles were left out when it was condensed)
  const formatMenu = (): HTMLElement => {
    document.body.insertAdjacentHTML(
      'beforeend',
      readFixture('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-floating-menus.html')
    );
    const preview = find('body > .mce-menu:not(.mce-fixed) .mce-text');
    preview.setAttribute('style', 'font-size: 22px; color: rgb(187, 187, 187); background-color: rgb(68, 68, 68);');
    return preview;
  };

  test("should clear a format menu's preview colours when the theme changes, keeping the rest of its look", async () => {
    document.body.setAttribute(attributes.theme, 'dark');
    const preview = formatMenu();

    toggle().setAttribute(attributes.tinymceTheme, '');
    await observed();

    expect(preview.style.color).toBe('');
    expect(preview.style.backgroundColor).toBe('');
    expect(preview.style.fontSize).toBe('22px');
  });

  test("should leave a format menu's previews alone when the theme stays the same", async () => {
    document.body.setAttribute(attributes.theme, 'dark');
    const preview = formatMenu();

    toggle().setAttribute(attributes.tinymceTheme, 'dark');
    await observed();

    expect(preview.style.backgroundColor).toBe('rgb(68, 68, 68)');
  });

  test("should save the toggle's theme when it's clicked, and theme the editor", async () => {
    toggle().setAttribute(attributes.tinymceTheme, '');
    await observed();

    expect(tinymceTheme.peek()).toBe('');
    expect(editorBody.getAttribute(attributes.tinymceTheme)).toBe('');
    // The toolbar and its menus follow it, switched to light as well as to dark
    expect(document.body.getAttribute(attributes.theme)).toBe('');

    toggle().setAttribute(attributes.tinymceTheme, 'dark');
    await observed();

    expect(tinymceTheme.peek()).toBe('dark');
    expect(document.body.getAttribute(attributes.theme)).toBe('dark');
    expect(editorBody.getAttribute(attributes.tinymceTheme)).toBe('dark');
  });

  test("should apply the site's theme switch once, through the toggle", async () => {
    const themed = vi.spyOn(document.body, 'setAttribute');

    page().setAttribute('data-theme', 'dark');
    // The site's record, then the toggle's, which the site's watcher queues
    await observed();
    await observed();

    expect(themed.mock.calls.filter(([name]) => name === attributes.theme)).toEqual([[attributes.theme, 'dark']]);
  });

  // A theme picked in another tab's editor reaches this one through the saved setting
  test('should follow the saved theme when it changes elsewhere: the editor, the page and the toggle', async () => {
    tinymceTheme.value = 'dark';
    await observed();

    expect(document.body.getAttribute(attributes.theme)).toBe('dark');
    expect(editorBody.getAttribute(attributes.tinymceTheme)).toBe('dark');
    expect(toggle().getAttribute(attributes.tinymceTheme)).toBe('dark');

    tinymceTheme.value = '';
    await observed();

    expect(document.body.getAttribute(attributes.theme)).toBe('');
    expect(editorBody.getAttribute(attributes.tinymceTheme)).toBe('');
    expect(toggle().getAttribute(attributes.tinymceTheme)).toBe('');
  });

  test('should stop following either once stopped', async () => {
    stop();
    page().setAttribute('data-theme', 'normal');
    toggle().setAttribute(attributes.tinymceTheme, '');
    await observed();

    expect(editorBody.hasAttribute(attributes.tinymceTheme)).toBe(false);
    expect(tinymceTheme.peek()).toBeNull();
  });
});

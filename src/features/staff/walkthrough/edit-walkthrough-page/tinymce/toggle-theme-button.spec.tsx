import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { logger } from '@ta-x-lib';
import { find, neverFinds, setHtml, setSettings, tick } from '@ta-x-test';
import { rootClass } from '@ta-x-ui';

import staffStyles from '../../styles';
import attributes from '../attributes';
import styles from '../styles';

import content from './charcoal/content.scss';
import { addThemeToggleIcons, addToggleThemeButton } from './toggle-theme-button';

import type { Editor } from './editor-loaded';

describe('staff/walkthrough/edit-walkthrough-page/tinymce/toggle-theme-button', () => {
  const button = (): HTMLButtonElement => find(`.${styles.themeToggle}`);

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-our-group.html');
  });

  test("should replace TinyMCE's placeholder icon with the sun and moon icons", async () => {
    await addThemeToggleIcons();

    const icons = [...button().children];
    expect(icons.map((icon) => icon.tagName.toLowerCase())).toEqual(['svg', 'svg']);
    expect(icons[0].getAttribute('class')).toBe(styles.themeToggleLight);
    expect(icons[1].getAttribute('class')).toBe(styles.themeToggleDark);
    // The sun shows for light, the moon for dark
    expect(icons.map((icon) => find('path', icon).getAttribute('d'))).toEqual([faSun.icon[4], faMoon.icon[4]]);
  });

  test('should leave the toggle and its theme attribute alone', async () => {
    await addThemeToggleIcons();

    expect(button().getAttribute(attributes.tinymceTheme)).toBe('dark');
    expect(button().classList).toContain(styles.jsThemeToggle);
    expect(button().closest('[aria-label="Toggle Theme"]')).not.toBeNull();
  });
});

describe('staff/walkthrough/edit-walkthrough-page/tinymce/addToggleThemeButton', () => {
  const toggle = (): HTMLElement => find(`[aria-label="Toggle Theme"] [${attributes.tinymceTheme}]`);
  const addStyle = vi.fn();
  let iframe: HTMLIFrameElement;
  let editor: Editor;

  // The editor's own document, which TinyMCE's iframe holds (its body is #tinymce). happy-dom doesn't load iframes, so
  // a document of its own stands in (the iframe stays off the page, where happy-dom would try to load it)
  const addEditor = (): void => {
    iframe = document.createElement('iframe');
    const editorDocument = document.implementation.createHTMLDocument('');
    editorDocument.body.id = 'tinymce';
    Object.defineProperty(iframe, 'contentDocument', { value: editorDocument });
    editor = { iframe, loaded: Promise.resolve() };
  };

  beforeEach(() => {
    vi.stubGlobal('GM_addStyle', addStyle);
    addStyle.mockReset();
    // The toolbar group with its Toggle Theme button already rendered, as the site's TinyMCE draws it once our page
    // script has run (the script itself needs the page's TinyMCE)
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-our-group.html');
    // The site's theme
    document.body.setAttribute('data-theme', 'dark');
    setSettings({ 'staff.walkthrough.editWalkthroughPage.tinymceTheme': null });
    addEditor();
  });

  test('should do nothing without the editor', async () => {
    await addToggleThemeButton(null);

    expect(addStyle).not.toHaveBeenCalled();
    expect(document.querySelector('#ta-x-toggle-theme-command')).toBeNull();
  });

  test("should add the button's script and its icons, following the site's theme, leaving the skin to the page's start", async () => {
    await addToggleThemeButton(editor);

    // themeEditorEarly adds it
    expect(addStyle).not.toHaveBeenCalled();
    const script = find('#ta-x-toggle-theme-command');
    expect(script.textContent).toContain('"dark"');
    expect(document.body.getAttribute(attributes.theme)).toBe('dark');
    expect([...find(`.${styles.themeToggle}`).children].map((icon) => icon.tagName)).toEqual(['svg', 'svg']);
  });

  test("should theme the editor's own document once it has loaded", async () => {
    await addToggleThemeButton(editor);

    const editorDocument = iframe.contentDocument;
    const style = await vi.waitFor(() => find('#ta-x-dark-tinymce-style', editorDocument));
    expect(style.innerHTML).toBe(content);
    const body = find('#tinymce', editorDocument);
    expect(body.classList).toContain(rootClass);
    expect(body.classList).toContain(staffStyles.staff);
    expect(body.getAttribute(attributes.tinymceTheme)).toBe('dark');
  });

  test("should use the theme saved from the toggle over the site's", async () => {
    setSettings({ 'staff.walkthrough.editWalkthroughPage.tinymceTheme': '' });

    await addToggleThemeButton(editor);

    expect(document.body.getAttribute(attributes.theme)).toBe('');
    await vi.waitFor(() =>
      expect(find('#tinymce', iframe.contentDocument).getAttribute(attributes.tinymceTheme)).toBe('')
    );
  });

  test.each(['normal', 'light'])(
    "should take a saved '%s' (the site's light, as an older version saved it) as light",
    async (saved) => {
      setSettings({ 'staff.walkthrough.editWalkthroughPage.tinymceTheme': saved });

      await addToggleThemeButton(editor);

      expect(document.body.getAttribute(attributes.theme)).toBe('');
      expect(find('#ta-x-toggle-theme-command').textContent).not.toContain(saved);
    }
  );

  test("should keep the toggle in step with the site's theme afterwards", async () => {
    await addToggleThemeButton(editor);

    document.body.setAttribute('data-theme', 'normal');

    await vi.waitFor(() => expect(toggle().getAttribute(attributes.tinymceTheme)).toBe(''));
  });

  // TinyMCE never drawing the button: its icons' wait runs out, and there's no toggle to keep in step
  test('should finish without the button, the site switching theme afterwards causing no error', async () => {
    find('[aria-label="Toggle Theme"]').remove();
    neverFinds(`.${styles.jsThemeToggle}`);
    const error = vi.spyOn(logger, 'error');

    await expect(addToggleThemeButton(editor)).resolves.toBeUndefined();

    document.body.setAttribute('data-theme', 'normal');
    await tick();

    expect(error).not.toHaveBeenCalled();
  });
});

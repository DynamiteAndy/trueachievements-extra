import { setHtml, setSettings, tick } from '@ta-x-test';

import attributes from '../attributes';

import skin from './charcoal/skin.scss';
import { themeEditorEarly } from './editor-theme';

describe('staff/walkthrough/edit-walkthrough-page/tinymce/editor-theme', () => {
  const addStyle = vi.fn();
  const bodyTheme = (): string | null => document.body.getAttribute(attributes.theme);

  beforeEach(() => {
    vi.stubGlobal('GM_addStyle', addStyle);
    addStyle.mockReset();
    // The site's page, which carries its theme (dark here)
    setHtml('@ta-x-test-views/home-page/header-signed-in.html');
    setSettings({ 'staff.walkthrough.editWalkthroughPage.tinymceTheme': null });
  });

  test("should add the skin and follow the site's theme before the editor is there", async () => {
    await themeEditorEarly();

    expect(addStyle).toHaveBeenCalledExactlyOnceWith(skin);
    expect(document.querySelector('.mce-tinymce')).toBeNull();
    expect(bodyTheme()).toBe('dark');
  });

  test("should use the theme saved from the editor's toggle over the site's", async () => {
    setSettings({ 'staff.walkthrough.editWalkthroughPage.tinymceTheme': '' });

    await themeEditorEarly();

    expect(bodyTheme()).toBe('');
  });

  test('should leave a theme the editor has already been given alone', async () => {
    document.body.setAttribute(attributes.theme, '');

    await themeEditorEarly();
    await tick();

    expect(bodyTheme()).toBe('');
  });

  // On the buttons' and fields' #4c5761, the icons' grey would leave text under 4.5:1: the menus' #ddd is over it
  test('should give the dark theme toolbar button labels and field text the menus own light grey', () => {
    // A dark-theme rule's declarations, by the end of its selector, as lightningcss writes it
    const dark = (selector: string): string =>
      skin
        .split('}')
        .find((rule) => rule.includes(`[data-ta-x-theme=dark] ${selector}{`))
        ?.split('{')[1] ?? '';

    expect(dark('.mce-panel .mce-btn button')).toContain('color:#ddd');
    expect(dark('input')).toContain('color:#ddd');
  });
});

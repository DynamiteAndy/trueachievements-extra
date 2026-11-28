import { mutationObserver } from '@ta-x-page';
import { settings } from '@ta-x-storage';
import { useLayoutEffect } from 'preact/hooks';

import attributes from '../../attributes';
import { editorTheme } from '../editor-theme';

import type { Editor } from '../editor-loaded';

const { tinymceTheme } = settings.staff.walkthrough.editWalkthroughPage;

// A format menu's previews (Paragraph's Heading 1 and the like) are styled by TinyMCE once, from the editor's content,
// when the menu first opens, and only the dark theme gives them colours. A menu opened before the theme changes would
// keep them: without them, they take the menu's
const clearPreviewColours = (): void =>
  document.querySelectorAll<HTMLElement>('body > .mce-menu .mce-text[style]').forEach(({ style }) => {
    style.removeProperty('color');
    style.removeProperty('background-color');
  });

interface EditorThemeProps {
  editor: Editor;
  // The site's theme holder (div.page's data-theme)
  globalTheme: HTMLElement;
  // Our Toggle Theme button, whose theme attribute a click flips
  themeToggle: HTMLElement;
}

// A controller keeping the editor's theme in step with its toggle, with the site's theme and with the saved setting.
// The site's theme switching sets the toggle to match; the toggle changing (clicked, or set to follow the site) saves
// its theme. The saved theme, changed here or in another tab, is what the editor's document, the page's body (which
// themes the toolbar and its menus) and the toggle show. Renders nothing
export const EditorTheme = ({ editor, globalTheme, themeToggle }: EditorThemeProps) => {
  const theme = tinymceTheme.value;

  // Watched from the mount, as the toggle and the site can change straight away. The toggle's own watcher takes it
  // from there (setAttribute is seen even when the value stays the same)
  useLayoutEffect(
    () =>
      mutationObserver.onAttributeChange(globalTheme, ['data-theme'], () =>
        themeToggle.setAttribute(attributes.tinymceTheme, editorTheme(globalTheme.getAttribute('data-theme') ?? ''))
      ),
    [globalTheme, themeToggle]
  );

  useLayoutEffect(
    () =>
      mutationObserver.onAttributeChange(themeToggle, [attributes.tinymceTheme], () => {
        const toggled = themeToggle.getAttribute(attributes.tinymceTheme);
        if (toggled !== null) {
          tinymceTheme.value = editorTheme(toggled);
        }
      }),
    [themeToggle]
  );

  useLayoutEffect(() => {
    // Nothing saved yet: the page keeps the theme it started with (themeEditorEarly)
    if (theme === null) {
      return;
    }

    const ours = editorTheme(theme);
    if (document.body.getAttribute(attributes.theme) !== ours) {
      clearPreviewColours();
      document.body.setAttribute(attributes.theme, ours);
    }
    editor.iframe.contentDocument?.querySelector('#tinymce')?.setAttribute(attributes.tinymceTheme, ours);
    if (themeToggle.getAttribute(attributes.tinymceTheme) !== ours) {
      themeToggle.setAttribute(attributes.tinymceTheme, ours);
    }
  }, [theme, editor, themeToggle]);

  return null;
};

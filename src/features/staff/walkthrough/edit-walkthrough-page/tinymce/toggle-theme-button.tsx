import { mountDetached, pageGlobal, waitForElement } from '@ta-x-page';
import { rootClass, Moon, Sun } from '@ta-x-ui';

import staffStyles from '../../styles';
import attributes from '../attributes';
import styles from '../styles';

import { appendButtons, type AppendButtons } from './append-buttons';
import { tinymceGroupName } from './button-group';
import content from './charcoal/content.scss';
import { editorBodyReady } from './editor-loaded';
import { savedEditorTheme } from './editor-theme';
import { EditorTheme } from './EditorTheme';
import { replacePlaceholderIcon } from './placeholder-icon';
import { injectTinyMCEScript } from './tinymce-script';

import type { Editor } from './editor-loaded';
import type { TinyMCEEditor } from './tinymce-api';

// The button's name: its tooltip, and its aria-label, which finds it
const toggleThemeLabel = 'Toggle Theme';

export const addThemeToggleIcons = (): Promise<void> =>
  replacePlaceholderIcon(
    `.${styles.jsThemeToggle}`,
    <>
      <Sun class={styles.themeToggleLight} />
      <Moon class={styles.themeToggleDark} />
    </>
  );

// Keeps the editor's theme in step with its toggle, the site's theme and the saved setting (EditorTheme). Its
// controller renders into a root of its own that isn't on the page; the function returned unmounts it
export const syncThemes = (editor: Editor, globalTheme: HTMLElement, themeToggle: HTMLElement): (() => void) =>
  mountDetached(<EditorTheme editor={editor} globalTheme={globalTheme} themeToggle={themeToggle} />).unmount;

// A page function (page/page-script.ts): adds Toggle Theme to our TA-X group. Clicking it switches its own theme
// attribute between dark and light, which EditorTheme saves and passes on
export const addToggleTheme = (
  editor: TinyMCEEditor,
  append: AppendButtons,
  groupName: string,
  label: string,
  themeAttribute: string,
  theme: string,
  buttonClasses: string[]
): void => {
  editor.addButton('toggleTheme', {
    tooltip: label,
    onclick: (event) => {
      const { target } = event;
      target.setAttribute(themeAttribute, target.getAttribute(themeAttribute) === 'dark' ? '' : 'dark');
    }
  });

  append(editor, { name: groupName }, ['toggleTheme']);

  const button = document.querySelector(`[aria-label="${label}"] button`);
  if (!button) {
    return;
  }

  button.setAttribute(themeAttribute, theme);
  button.classList.add(...buttonClasses);
};

export const addToggleThemeButton = async (editor: Editor | null): Promise<void> => {
  if (!editor) {
    return;
  }

  // The site's theme, which the editor follows until its toggle is used (its skin is added as the page starts:
  // themeEditorEarly)
  const globalTheme = await waitForElement('.page, [data-theme]');

  // Themes the editor's own document as soon as it has its body, before its stylesheets have loaded (they paint it white
  // until ours is in). Not awaited: the button is added meanwhile
  void editorBodyReady(editor.iframe).then(async (bodyEl) => {
    if (!bodyEl) {
      return;
    }

    const iframeDocument = bodyEl.ownerDocument;
    bodyEl.classList.add(rootClass, staffStyles.staff);
    bodyEl.setAttribute(attributes.tinymceTheme, await savedEditorTheme());

    const style = iframeDocument.createElement('style');
    style.id = 'ta-x-dark-tinymce-style';
    style.textContent = content;
    (iframeDocument.head ?? iframeDocument.documentElement).appendChild(style);
  });

  // Our group, added if it didn't turn up; without even that there's nowhere for the button (the theme still follows
  // the site's)
  await injectTinyMCEScript({
    id: 'ta-x-toggle-theme-command',
    build: async () => {
      const theme = await savedEditorTheme();
      document.body.setAttribute(attributes.theme, theme);

      return [
        addToggleTheme,
        pageGlobal('tinymce.activeEditor'),
        appendButtons,
        tinymceGroupName,
        toggleThemeLabel,
        attributes.tinymceTheme,
        theme,
        [styles.jsThemeToggle, styles.themeToggle]
      ];
    },
    after: async () => {
      await addThemeToggleIcons();

      // Synced for as long as the edit page is open (it's set up once a page, so its stop function, which the specs
      // use, isn't kept here)
      const themeToggle = document.querySelector<HTMLElement>(
        `[aria-label="${toggleThemeLabel}"] [${attributes.tinymceTheme}]`
      );
      if (themeToggle && globalTheme) {
        syncThemes(editor, globalTheme, themeToggle);
      }
    }
  });
};

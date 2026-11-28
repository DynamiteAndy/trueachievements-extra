import { pageGlobal } from '@ta-x-page';
import { Code } from '@ta-x-ui';

import styles from '../styles';

import { appendButtons, type AppendButtons } from './append-buttons';
import { tinymceGroupName } from './button-group';
import { replacePlaceholderIcon } from './placeholder-icon';
import { injectTinyMCEScript } from './tinymce-script';

import type { TinyMCEEditor, TinyMCEGlobal } from './tinymce-api';

// A page function (page/page-script.ts): adds Source Code to our TA-X group, opening the editor's HTML in a dialog
// to edit
export const addSourceCode = (
  tinymce: TinyMCEGlobal,
  editor: TinyMCEEditor,
  append: AppendButtons,
  groupName: string,
  buttonClasses: string[]
): void => {
  editor.addButton('sourceCode', {
    tooltip: 'Source Code',
    onclick: () => {
      const dialog = editor.windowManager.open({
        title: 'Source code',
        body: {
          type: 'textbox',
          name: 'code',
          multiline: true,
          minWidth: editor.getParam('code_dialog_width', 600),
          minHeight: editor.getParam('code_dialog_height', Math.min(tinymce.DOM.getViewPort().h - 200, 500)),
          spellcheck: false,
          style: 'direction: ltr; text-align: left'
        },
        onSubmit: (submitted) => {
          editor.focus();
          editor.undoManager.transact(() => {
            editor.setContent(submitted.data.code);
          });
          editor.selection.setCursorLocation();
          editor.nodeChanged();
        }
      });

      dialog.find('#code').value(editor.getContent({ source_view: true }));
    }
  });

  append(editor, { name: groupName }, ['sourceCode']);
  document.querySelector('[aria-label="Source Code"] button')?.classList.add(...buttonClasses);
};

export const addSourceCodeButton = (): Promise<void> =>
  injectTinyMCEScript({
    id: 'ta-x-code-editor-command',
    build: () => [
      addSourceCode,
      pageGlobal('tinymce'),
      pageGlobal('tinymce.activeEditor'),
      appendButtons,
      tinymceGroupName,
      [styles.jsSourceCodeButton, styles.sourceCodeButton]
    ],
    after: () => replacePlaceholderIcon(`.${styles.jsSourceCodeButton}`, <Code />)
  });

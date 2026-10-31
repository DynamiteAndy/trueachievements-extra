import { allConcurrently } from '@ta-x-lib';
import { waitForElement } from '@ta-x-page';

import { addControllerButtonsButton } from './add-controller-buttons';
import { appendColorPicker } from './append-color-picker';
import { buttonGroupScript } from './button-group';
import { editorLoaded, type Editor } from './editor-loaded';
import { addInsertXboxImageButton } from './insert-xbox-images';
import { addSelectAllIcon } from './select-all-icon';
import { addSourceCodeButton } from './source-code-button';
import { stickyToolbar } from './sticky-toolbar';
import { addTextColorButtons } from './text-color-buttons';
import { addToggleThemeButton } from './toggle-theme-button';

export { themeEditorEarly } from './editor-theme';

const createButtonGroup = async (editor: Editor | null): Promise<void> => {
  if (!editor) {
    return;
  }

  await editor.loaded;

  document.body.appendChild(buttonGroupScript());
};

// The whole page is searched for the skin, as the head may not be parsed yet when the script starts
export const tinymce = async (): Promise<void> => {
  if (!(await waitForElement('[href*="skin.min.css"]'))) {
    return;
  }

  const container = await waitForElement('.mce-tinymce');
  if (!container) {
    return;
  }

  // One wait for the editor's document, shared, so no part misses it by finding the iframe after it has loaded
  const iframe = await waitForElement<HTMLIFrameElement>('#txtWalkthrough_ifr');
  const editor: Editor | null = iframe ? { iframe, loaded: editorLoaded(iframe) } : null;

  await Promise.all([
    // The sticky toolbar hands back its unmount, which nothing here needs
    allConcurrently<unknown>('Edit Walkthrough - TinyMCE', [
      {
        name: 'staff:walkthrough:edit-walkthrough-page:tinymce:sticky-toolbar',
        task: () => stickyToolbar(container, editor)
      },
      {
        name: 'staff:walkthrough:edit-walkthrough-page:tinymce:append-color-picker',
        task: () => appendColorPicker(editor)
      }
    ]),
    allConcurrently('Edit Walkthrough - TinyMCE Buttons', [
      {
        name: 'staff:walkthrough:edit-walkthrough-page:tinymce:create-button-group',
        task: () => createButtonGroup(editor)
      },
      {
        name: 'staff:walkthrough:edit-walkthrough-page:tinymce:add-text-color-buttons',
        task: addTextColorButtons
      },
      {
        name: 'staff:walkthrough:edit-walkthrough-page:tinymce:add-source-code-button',
        task: addSourceCodeButton
      },
      {
        name: 'staff:walkthrough:edit-walkthrough-page:tinymce:add-toggle-theme-button',
        task: () => addToggleThemeButton(editor)
      },
      {
        name: 'staff:walkthrough:edit-walkthrough-page:tinymce:add-insert-xbox-image-button',
        task: addInsertXboxImageButton
      },
      {
        name: 'staff:walkthrough:edit-walkthrough-page:tinymce:add-controller-buttons-button',
        task: addControllerButtonsButton
      },
      {
        name: 'staff:walkthrough:edit-walkthrough-page:tinymce:add-select-all-icon',
        task: addSelectAllIcon
      }
    ])
  ]);
};

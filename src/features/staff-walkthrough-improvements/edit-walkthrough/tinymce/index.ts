import { allConcurrently, waitForElement } from '@ta-x-utilities';
import { Constants } from '@ta-x-globals';
import { addToggleThemeButton } from './toggle-theme-button';
import { setFullWidthToolbar } from './set-fullwidth-toolbar';
import { fixFloatingMenus } from './fix-floating-menus';
import { addSourceCodeButton } from './source-code-button';
import html from './tinymce.hbs';

export const tinymce = async(): Promise<void> => {
  if (!await waitForElement('[href*="skin.min.css"]', document.head)) return;

  const container = await waitForElement('.mce-tinymce');
  const toolbar = await waitForElement('.mce-toolbar.mce-last .mce-container-body', container);

  if (!container || !toolbar) return;

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const addedGroup = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`);
  toolbar.appendChild(addedGroup);

  allConcurrently('Edit Walkthrough', [
    { name: 'tinymce-set-full-width-toolbar', task: async() => setFullWidthToolbar(container) },
    { name: 'tinymce-add-fix-floating-menus', task: async() => fixFloatingMenus(container) },
    { name: 'tinymce-add-source-code-button', task: async() => addSourceCodeButton() },
    { name: 'tinymce-add-toggle-theme-button', task: async() => addToggleThemeButton(toolbar) }
  ]);
};

export default { tinymce };
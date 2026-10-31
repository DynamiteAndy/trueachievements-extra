import { logger } from '@ta-x-lib';
import { createPageScript, pageGlobal, waitForElement } from '@ta-x-page';

import styles from '../styles';

import type { TinyMCEEditor, TinyMCEGlobal } from './tinymce-api';

// A page function (page/page-script.ts): adds our TA-X button group to TinyMCE's second toolbar, for our buttons.
// Safe to run again: it adds nothing once the group is there, or while there's no editor yet
export const addButtonGroup = (
  tinymce: TinyMCEGlobal,
  editor: TinyMCEEditor | undefined,
  groupName: string,
  groupClass: string
): void => {
  if (!editor?.theme) {
    return;
  }

  const toolbars = editor.theme.panel.find('toolbar');
  if (!toolbars[1]) {
    return;
  }

  // TinyMCE's find answers a Collection of its own, which has filter (and length) but not some
  if (
    editor.theme.panel.find('toolbar > buttongroup').filter((group) => group.settings.name === groupName).length > 0
  ) {
    return;
  }

  const taxGroup = tinymce.ui.Factory.create({ type: 'buttongroup', name: groupName, items: [] });
  taxGroup.addClass(groupClass);
  toolbars[1].append(taxGroup);
};

// Our button group's name in TinyMCE (a control's name, not a class)
export const tinymceGroupName = 'ta-x-group';

// The script adding our group, run in the page
export const buttonGroupScript = (id = 'ta-x-tinymce-button-group'): HTMLScriptElement =>
  createPageScript(id, addButtonGroup, [
    pageGlobal('tinymce'),
    pageGlobal('tinymce.activeEditor'),
    tinymceGroupName,
    styles.tinymceGroup
  ]);

// Our group in the toolbar, for a button script: added once the editor has loaded (index.ts), or here if it hasn't
// turned up by then (its script ran before the toolbar was there, say), so the buttons always have it
export const findOrAddButtonGroup = async (): Promise<HTMLElement | null> => {
  const selector = `.mce-${styles.tinymceGroup}`;
  const group = await waitForElement(selector);
  if (group) {
    return group;
  }

  logger.debug('tinymce', "our button group didn't turn up, so it's added again");
  document.body.appendChild(buttonGroupScript('ta-x-tinymce-button-group-again'));

  return waitForElement(selector);
};

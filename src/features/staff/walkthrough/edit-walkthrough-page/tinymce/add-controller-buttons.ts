import { pageGlobal } from '@ta-x-page';
import { controllerButtons, controllerButtonStaticFolder } from '@ta-x-site';

import { appendButtons, type AppendButtons } from './append-buttons';
import { injectTinyMCEScript } from './tinymce-script';

import type { TinyMCEEditor } from './tinymce-api';

// A page function (page/page-script.ts): adds the Controller Buttons menu to the site's group with its Table button.
// It lists the site's controller buttons (passed in, as a page function can't import them) in rows, each
// inserting `[<code>]`, shown by the site's image for it
export const addControllerButtons = (
  editor: TinyMCEEditor,
  append: AppendButtons,
  codes: string[],
  imageFolder: string
): void => {
  editor.addButton('btnControllerIcons', {
    type: 'menubutton',
    title: 'Controller Buttons',
    image: '/images/icons/game.png',
    menu: codes.map((code, index) => ({
      image: `${imageFolder}${code}.png`,
      classes: index % 4 === 0 ? 'tiny_button firsticon controller-icon' : 'tiny_button controller-icon',
      onclick: () => editor.insertContent(`[${code}]`)
    }))
  });

  append(editor, { buttonTitle: 'Table' }, ['btnControllerIcons']);
};

export const addControllerButtonsButton = (): Promise<void> =>
  injectTinyMCEScript({
    id: 'ta-x-controller-buttons-command',
    siteButton: '.mce-btn[aria-label="Controller Buttons"]',
    build: () => [
      addControllerButtons,
      pageGlobal('tinymce.activeEditor'),
      appendButtons,
      controllerButtons,
      controllerButtonStaticFolder
    ]
  });

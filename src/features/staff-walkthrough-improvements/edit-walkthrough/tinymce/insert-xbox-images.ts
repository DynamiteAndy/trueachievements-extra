import { TinyMCEScript } from '@ta-x-models';
import { waitForElement } from '@ta-x-utilities';

class InsertXboxImageScript extends TinyMCEScript {
  constructor() {
    super('ta-x-staff-walkthrough-improvements-insert-xbox-image-command');
  }

  buildScript = (): HTMLScriptElement => {
    const script = `
    ((editor) => {
      console.debug('Adding Insert Xbox Image Button');

      var addImageElement = document.querySelector('a[title="Add images"]');
      var gameId = parseInt(new URLSearchParams(addImageElement.href).get('relatedid'));

      editor.addButton('btnAddGamerMedia', {
        title: 'Insert Xbox captures',
        image: '/images/icons/game-screenshots.png',
        onclick: function (event) {
          ShowGamerScreenshots(gameId, 'txtWalkthrough', 'False', true, event);
          return false;
        }
      });

      var btnAddGamerMedia = editor.buttons['btnAddGamerMedia'];
      var group = editor.theme.panel.find('toolbar > buttongroup').filter(function(bg) {
        return bg._items.filter(item => item._title === "Add Achievement").length === 1
      })[0];

      group._lastRepaintRect = group._layoutRect;
      group.append(btnAddGamerMedia);

      console.debug('Added Insert Xbox Image Button');
    })(tinymce.activeEditor);
  `;

    return this.createScript(script);
  };

  injectScript = async (): Promise<void> => {
    if (await waitForElement('.mce-btn[aria-label="Insert Xbox captures"]', undefined, 250)) {
      return;
    }

    document.body.appendChild(this.buildScript());
  };
}

export const addInsertXboxImageButton = new InsertXboxImageScript().injectScript;

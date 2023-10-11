import { TinyMCEScript } from '@ta-x-models';
import { waitForElement } from '@ta-x-utilities';

class AddControllerButtonsScript extends TinyMCEScript {
  constructor() {
    super('ta-x-staff-walkthrough-improvements-add-controller-buttons-command');
  }

  buildScript = (): HTMLScriptElement => {
    const script = `
    ((editor) => {
      console.debug('Adding Add Controller Buttons Button');

      editor.addButton('btnControllerIcons', {
        type: 'menubutton',
        title: 'Controller Buttons',
        image: '/images/icons/game.png',
        menu: [{
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_A.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_A]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_B.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_B]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_X.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_X]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_Y.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_Y]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LB.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LB]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RB.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RB]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LT.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LT]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RT.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RT]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_up.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_up]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_down.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_down]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_left.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_left]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_right.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_right]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_upleft.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_upleft]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_upright.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_upright]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_downleft.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_downleft]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_downright.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_downright]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSu.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSu]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSd.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSd]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSl.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSl]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSr.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSr]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSul.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSul]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSur.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSur]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSdl.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSdl]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSdr.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSdr]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSu.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSu]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSd.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSd]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSl.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSl]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSr.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSr]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSul.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSul]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSur.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSur]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSdl.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSdl]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSdr.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSdr]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_dpad.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_dpad]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSc.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSc]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSc.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSc]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LS.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LS]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RS.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RS]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_back.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_back]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_start.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_start]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_guide.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_guide]');
          }
        }]
      });

      var btnControllerIcons = editor.buttons['btnControllerIcons'];
      var group = editor.theme.panel.find('toolbar > buttongroup').filter(function(bg) {
        return bg._items.filter(item => item._title === "Table").length === 1
      })[0];

      group._lastRepaintRect = group._layoutRect;
      group.append(btnControllerIcons);

      console.debug('Added Add Controller Buttons Button');
    })(tinymce.activeEditor);
  `;

    return this.createScript(script);
  };

  injectScript = async (): Promise<void> => {
    if (await waitForElement('.mce-btn[aria-label="Controller Buttons"]', undefined, 250)) {
      return;
    }

    document.body.appendChild(this.buildScript());
  };
}

export const addControllerButtonsButton = new AddControllerButtonsScript().injectScript;

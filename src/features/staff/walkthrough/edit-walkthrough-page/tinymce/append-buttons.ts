import type { TinyMCEEditor } from './tinymce-api';

// Which of the toolbar's button groups: ours, by its name, or one of the site's, by the title of a button already in it
interface ButtonGroupMatch {
  name?: string;
  buttonTitle?: string;
}

// A page function (page/page-script.ts) the button scripts are handed: appends the named buttons to a group
export const appendButtons = (editor: TinyMCEEditor, group: ButtonGroupMatch, buttonNames: string[]): void => {
  const target = editor.theme.panel
    .find('toolbar > buttongroup')
    .filter((buttonGroup) =>
      group.name
        ? buttonGroup.settings.name === group.name
        : buttonGroup._items.filter((item) => item._title === group.buttonTitle).length === 1
    )[0];

  // A group the toolbar doesn't have (the site changed it): the buttons go without, rather than the script throwing
  if (!target) {
    return;
  }

  // TinyMCE only lays a group out again when its size changed since it last did, so it's made to think it has
  target._lastRepaintRect = target._layoutRect;
  buttonNames.forEach((name) => target.append(editor.buttons[name]));
};

export type AppendButtons = typeof appendButtons;

import { pageGlobal } from '@ta-x-page';

import styles from '../styles';

import { appendButtons, type AppendButtons } from './append-buttons';
import { tinymceGroupName } from './button-group';
import { injectTinyMCEScript } from './tinymce-script';

import type {
  TinyMCEButtonSettings,
  TinyMCEColorButton,
  TinyMCEControlEvent,
  TinyMCEEditor,
  TinyMCEPanelEvent
} from './tinymce-api';

// The site's colours on offer, in the grid's order (a row at a time), each with the name TinyMCE's own grid gave it:
// the swatch's tooltip and its name for a screen reader
export const namedTextColors: { color: string; name: string }[] = [
  { color: '#000000', name: 'Black' },
  { color: '#993300', name: 'Burnt orange' },
  { color: '#333300', name: 'Dark olive' },
  { color: '#003300', name: 'Dark green' },
  { color: '#003366', name: 'Dark azure' },
  { color: '#000080', name: 'Navy Blue' },
  { color: '#333399', name: 'Indigo' },
  { color: '#333333', name: 'Very dark gray' },
  { color: '#800000', name: 'Maroon' },
  { color: '#FF6600', name: 'Orange' },
  { color: '#808000', name: 'Olive' },
  { color: '#008000', name: 'Green' },
  { color: '#008080', name: 'Teal' },
  { color: '#0000FF', name: 'Blue' },
  { color: '#666699', name: 'Grayish blue' },
  { color: '#808080', name: 'Gray' },
  { color: '#FF0000', name: 'Red' },
  { color: '#FF9900', name: 'Amber' },
  { color: '#99CC00', name: 'Yellow green' },
  { color: '#339966', name: 'Sea green' },
  { color: '#33CCCC', name: 'Turquoise' },
  { color: '#3366FF', name: 'Royal blue' },
  { color: '#800080', name: 'Purple' },
  { color: '#999999', name: 'Medium gray' },
  { color: '#FF00FF', name: 'Magenta' },
  { color: '#FFCC00', name: 'Gold' },
  { color: '#FFFF00', name: 'Yellow' },
  { color: '#00FF00', name: 'Lime' },
  { color: '#00FFFF', name: 'Aqua' },
  { color: '#00CCFF', name: 'Sky blue' },
  { color: '#993366', name: 'Red violet' },
  { color: '#FFFFFF', name: 'White' },
  { color: '#FF99CC', name: 'Pink' },
  { color: '#FFCC99', name: 'Peach' },
  { color: '#FFFF99', name: 'Light yellow' },
  { color: '#CCFFCC', name: 'Pale green' },
  { color: '#CCFFFF', name: 'Pale cyan' },
  { color: '#99CCFF', name: 'Light sky blue' },
  { color: '#CC99FF', name: 'Plum' }
];

export const textColors: string[] = namedTextColors.map(({ color }) => color);

// The classes of a colour button panel's parts, for the page function and our script to find them by: the panel's
// picker (its field, which our script draws a jscolor picker beside) and the picker's last swatch, No color
type TextColorClasses = {
  picker: string;
  field: string;
  noColor: string;
};

// A page function (page/page-script.ts): adds Text color and Background color to our TA-X group, each a TinyMCE
// colour button whose panel holds a field our script gives a colour picker (append-color-picker.ts): the grid's colours
// as its swatches, No color last. A colour picked, there or on its pad and sliders, is written into the field
export const addTextColors = (
  editor: TinyMCEEditor,
  append: AppendButtons,
  groupName: string,
  classes: TextColorClasses
): void => {
  const applyColor = (format: string, value: string): void => {
    editor.undoManager.transact(() => {
      editor.focus();
      editor.formatter.apply(format, { value });
      editor.nodeChanged();
    });
  };

  const removeColor = (format: string): void => {
    editor.undoManager.transact(() => {
      editor.focus();
      editor.formatter.remove(format, { value: null }, null, true);
      editor.nodeChanged();
    });
  };

  // The colour button applying `format` (TinyMCE's own Collection: filter, not find)
  const buttonFor = (format: string): TinyMCEColorButton | undefined =>
    editor.theme.panel.find('colorbutton').filter((control) => control.settings.format === format)[0] as
      | TinyMCEColorButton
      | undefined;

  // The colour also goes on the button, for its swatch and its button half
  const setColor = (format: string, color: string): void => {
    buttonFor(format)?.color(color);

    if (color === 'transparent') {
      editor.execCommand('mceRemoveTextcolor', format);
    } else {
      applyColor(format, color);
    }
  };

  // The button half applies the colour last picked with it, or removes the colour (none picked yet, or No color)
  const onButtonClick = (event: TinyMCEControlEvent): void => {
    const { control } = event;
    const { format } = control.settings;
    if (!format) {
      return;
    }

    if (control._color && control._color !== 'transparent') {
      editor.execCommand('mceApplyTextcolor', format, control._color);
    } else {
      editor.execCommand('mceRemoveTextcolor', format);
    }
  };

  // The format of the panel `element` is in
  const formatOf = (element: Element): string | null =>
    element.closest(`.${classes.picker}`)?.querySelector(`.${classes.field}`)?.getAttribute('data-format') ?? null;

  // A colour picked, written into a panel's field
  document.addEventListener('change', (event) => {
    const field = event.target as HTMLInputElement | null;
    if (!field?.classList?.contains(classes.field) || !field.value) {
      return;
    }

    const format = field.getAttribute('data-format');
    if (format) {
      setColor(format, field.value);
    }
  });

  // No color, caught on its way down, before the picker's own click on the swatch would pick a colour from it
  document.addEventListener(
    'click',
    (event) => {
      const noColor = (event.target as Element | null)?.closest?.(`.${classes.noColor}`) ?? null;
      const format = noColor && formatOf(noColor);
      if (!format) {
        return;
      }

      event.stopPropagation();
      setColor(format, 'transparent');
      buttonFor(format)?.hidePanel();
    },
    true
  );

  // A swatch closes the panel, as a cell of the grid did; the pad and sliders leave it open, to keep adjusting
  const onPanelClick = (event: TinyMCEPanelEvent): void => {
    if (event.target.closest('.jscolor-palette-sw')) {
      event.control.parent().hidePanel();
    }
  };

  // A menu, as TinyMCE's other toolbar menus are: their look in each skin, and opened under the sticky toolbar
  const panel = (format: string, label: string): NonNullable<TinyMCEButtonSettings['panel']> => ({
    role: 'application',
    ariaRemember: true,
    classes: 'menu',
    html:
      `<div class="${classes.picker}">` +
      `<input type="text" class="${classes.field}" data-format="${format}" aria-label="${label}" tabindex="-1" readonly>` +
      '</div>',
    onclick: onPanelClick
  });

  editor.addCommand('mceApplyTextcolor', (format, value) => {
    if (value) {
      applyColor(format, value);
    }
  });
  editor.addCommand('mceRemoveTextcolor', (format) => removeColor(format));

  editor.addButton('forecolor', {
    type: 'colorbutton',
    tooltip: 'Text color',
    format: 'forecolor',
    panel: panel('forecolor', 'Text color'),
    onclick: onButtonClick
  });

  editor.addButton('backcolor', {
    type: 'colorbutton',
    tooltip: 'Background color',
    format: 'hilitecolor',
    panel: panel('hilitecolor', 'Background color'),
    onclick: onButtonClick
  });

  append(editor, { name: groupName }, ['forecolor', 'backcolor']);
};

export const textColorClasses: TextColorClasses = {
  picker: styles.textColorPicker,
  field: styles.textColorField,
  noColor: styles.textColorNoColor
};

export const addTextColorButtons = (): Promise<void> =>
  injectTinyMCEScript({
    id: 'ta-x-text-color-command',
    build: () => [addTextColors, pageGlobal('tinymce.activeEditor'), appendButtons, tinymceGroupName, textColorClasses]
  });

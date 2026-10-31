import { mutationObserver } from '@ta-x-page';

import type JsColor from '@eastdesire/jscolor';
import type { JsColorOptions } from '@eastdesire/jscolor';

import { namedTextColors, textColorClasses, textColors } from './text-color-buttons';

import type { Editor } from './editor-loaded';

// The text colour grid's colours, as swatches in the same rows as the grid
const palette = textColors;

// Gives TinyMCE's Table properties dialog a colour picker for its Border color (with alpha) and Background color inputs
const addColorPickers = (Picker: typeof JsColor, dialog: HTMLElement): void => {
  [...dialog.querySelectorAll<HTMLInputElement>('.mce-colorbox input:not([data-current-color])')].forEach((el) => {
    // Moved to make room for the picker's swatch
    if (el.parentElement) {
      el.parentElement.style.left = '201px';
    }

    const label = el.closest('.mce-container-body')?.querySelector('label');
    const colorPickerOpts: JsColorOptions = {
      zIndex: 65536,
      format: label?.innerText === 'Border color' ? 'hexa' : 'auto',
      palette,
      paletteCols: 8
    };

    new Picker(el, colorPickerOpts);
  });

  // A picker open as the dialog closes (Escape, which clicks nothing) would stay on screen without its input
  mutationObserver.onElementRemoved(dialog, () => Picker.hide());
};

// The grid's last cell, No color, as a clear swatch in the same place: the page catches its click (text-color-buttons.ts)
const textColorPalette = [...palette, 'rgba(0,0,0,0)'];

// A swatch's click picks it (jscolor's own listener); Enter and Space do the same, as on a button
const pickOnEnterOrSpace = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).click();
  }
};

// The picker draws its swatches afresh each time it shows, as plain divs a mouse can click. Each is made a button again,
// named as TinyMCE's own grid named its cells (also the tooltip), so the keyboard can reach and pick one; the last is
// No color. Returns the first, to take the focus
const markSwatches = (container: HTMLElement): HTMLElement | undefined => {
  const swatches = [...container.querySelectorAll<HTMLElement>('.jscolor-palette-sw')];

  swatches.forEach((swatch, index) => {
    const name = index === swatches.length - 1 ? 'No color' : namedTextColors[index]?.name;
    if (index === swatches.length - 1) {
      swatch.classList.add(textColorClasses.noColor);
    }
    if (name) {
      swatch.title = name;
      swatch.setAttribute('aria-label', name);
    }
    swatch.setAttribute('role', 'button');
    swatch.tabIndex = 0;
    swatch.addEventListener('keydown', pickOnEnterOrSpace);
  });

  return swatches[0];
};

// Gives Text color's or Background color's panel field its picker, drawn inside the panel (so a click in it is the
// panel's, which stays open) each time the panel shows. TinyMCE makes the panel once and hides and shows it after
const addTextColorPicker = (Picker: typeof JsColor, field: HTMLInputElement): void => {
  const container = field.parentElement;
  const panel = field.closest<HTMLElement>('.mce-floatpanel');
  if (!container || !panel) {
    return;
  }

  const picker = new Picker(field, {
    container,
    palette: textColorPalette,
    paletteCols: 8,
    format: 'hex',
    required: false,
    showOnClick: false,
    hideOnLeave: false,
    // TinyMCE's panel is the menu: the picker draws no box of its own in it
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    borderRadius: 0,
    shadow: false
  });

  // Focus goes into the panel, onto its first swatch, as it did to the grid: the keyboard can pick from there, and
  // Escape reaches the panel and closes it
  const show = (): void => {
    if (panel.style.display !== 'none') {
      picker.show();
      (markSwatches(container) ?? field).focus({ preventScroll: true });
    }
  };

  show();
  mutationObserver.onAttributeChange(panel, ['style'], show);
};

// The table properties dialog and the colour buttons' panels open only once the editor has loaded
export const appendColorPicker = async (editor: Editor | null): Promise<void> => {
  if (!editor) {
    return;
  }

  await editor.loaded;
  // Loaded only here, as the library sets itself up on whatever page loads it
  const { default: Picker } = await import('@eastdesire/jscolor');
  // Through the shared observer, for as long as the page is open (the dialog is made anew each time it opens)
  mutationObserver.onElementAdded('[aria-label="Table properties"]', (dialog) => addColorPickers(Picker, dialog));
  mutationObserver.onElementAdded(`.${textColorClasses.field}`, (field) =>
    addTextColorPicker(Picker, field as HTMLInputElement)
  );
};

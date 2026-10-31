import JsColor from '@eastdesire/jscolor';
import { find, pressKey, readFixture, required, tick } from '@ta-x-test';

import { appendColorPicker } from './append-color-picker';
import { namedTextColors, textColorClasses, textColors } from './text-color-buttons';

import type { Editor } from './editor-loaded';

vi.mock('@eastdesire/jscolor', () => ({ default: Object.assign(vi.fn(), { hide: vi.fn() }) }));

describe('staff/walkthrough/edit-walkthrough-page/tinymce/append-color-picker', () => {
  const dialog = readFixture('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-table-properties.html').replace(
    /^<!--[\s\S]*?-->\s*/,
    ''
  );
  // The dialog as TinyMCE adds it to the page
  const openDialog = (): HTMLElement => {
    const template = document.createElement('template');
    template.innerHTML = dialog;
    const element = template.content.firstElementChild as HTMLElement;
    document.body.append(element);
    return element;
  };
  const input = (id: string): HTMLInputElement => find(`#${id}-inp`);
  // Delivered by the mutation observer
  const observed = tick;

  let editor: Editor;

  beforeEach(() => {
    editor = { iframe: document.createElement('iframe'), loaded: Promise.resolve() };
  });

  test("should give the table dialog's border and background colours a colour picker", async () => {
    await appendColorPicker(editor);

    openDialog();
    await observed();

    // The text colour grid's colours as swatches, in its rows of 8
    const swatches = { palette: textColors, paletteCols: 8 };
    expect(vi.mocked(JsColor).mock.calls).toEqual([
      // The border colour takes alpha
      [input('mceu_112'), { zIndex: 65536, format: 'hexa', ...swatches }],
      [input('mceu_113'), { zIndex: 65536, format: 'auto', ...swatches }]
    ]);
    expect(swatches.palette).toHaveLength(39);
    // Moved to make room for the picker's swatch
    expect(required(input('mceu_112').parentElement).style.left).toBe('201px');
    expect(required(input('mceu_113').parentElement).style.left).toBe('201px');
  });

  test('should hide an open picker once the dialog closes, as Escape clicks nothing that would', async () => {
    await appendColorPicker(editor);
    const element = openDialog();
    await observed();
    expect(JsColor.hide).not.toHaveBeenCalled();

    element.remove();
    await observed();

    expect(JsColor.hide).toHaveBeenCalledTimes(1);
  });

  test('should wait for the editor to load before watching for the dialog', async () => {
    let load: () => void = () => undefined;
    editor.loaded = new Promise((resolve) => {
      load = resolve;
    });
    const started = appendColorPicker(editor);

    openDialog();
    await observed();
    expect(JsColor).not.toHaveBeenCalled();

    load();
    await started;
    openDialog();
    await observed();

    expect(JsColor).toHaveBeenCalledTimes(2);
  });

  test('should leave inputs that already have a picker alone', async () => {
    await appendColorPicker(editor);

    const element = openDialog();
    element.querySelectorAll('.mce-colorbox input').forEach((el) => el.setAttribute('data-current-color', '#000'));
    await observed();

    expect(JsColor).not.toHaveBeenCalled();
  });

  test('should do nothing without the editor', async () => {
    await appendColorPicker(null);

    openDialog();
    await observed();

    expect(JsColor).not.toHaveBeenCalled();
  });

  describe("Text color's and Background color's panels", () => {
    const swatches = (panel: HTMLElement): HTMLElement[] => [
      ...panel.querySelectorAll<HTMLElement>('.jscolor-palette-sw')
    ];
    let show: () => void;

    // TinyMCE's panel, with the field its html holds (text-color-buttons.ts), as it adds it to the page when the button
    // first opens it
    const openPanel = (): { panel: HTMLElement; field: HTMLInputElement } => {
      const captured = new DOMParser().parseFromString(
        readFixture('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-text-color-panel.html'),
        'text/html'
      );
      const panel = required(captured.body.firstElementChild as HTMLElement | null);
      panel.insertAdjacentHTML(
        'beforeend',
        `<div class="${textColorClasses.picker}">` +
          `<input type="text" class="${textColorClasses.field}" data-format="forecolor" readonly></div>`
      );
      document.body.append(panel);

      return { panel, field: find(`.${textColorClasses.field}`, panel) };
    };

    beforeEach(() => {
      // The picker draws its swatches afresh in its container each time it shows, as jscolor does
      vi.mocked(JsColor).mockImplementation(function picker(_target, options) {
        show = vi.fn(() => {
          const container = required(options?.container);
          container.querySelector('.jscolor-palette')?.remove();
          container.insertAdjacentHTML(
            'beforeend',
            `<div class="jscolor-palette">${'<div class="jscolor-palette-sw"><div></div></div>'.repeat(40)}</div>`
          );
        });
        return { show };
      });
    });

    test("should give the field a picker drawn in the panel, with the grid's colours, No color last", async () => {
      await appendColorPicker(editor);

      const { panel, field } = openPanel();
      await observed();

      expect(vi.mocked(JsColor).mock.calls).toEqual([
        [
          field,
          {
            container: field.parentElement,
            palette: [...textColors, 'rgba(0,0,0,0)'],
            paletteCols: 8,
            format: 'hex',
            required: false,
            showOnClick: false,
            hideOnLeave: false,
            backgroundColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            borderRadius: 0,
            shadow: false
          }
        ]
      ]);
      expect(show).toHaveBeenCalledOnce();
      expect(swatches(panel).map((swatch) => swatch.classList.contains(textColorClasses.noColor))).toEqual([
        ...Array<boolean>(39).fill(false),
        true
      ]);
      expect(swatches(panel)[39].title).toBe('No color');
      // Into the panel, on its first swatch: the keyboard picks from there, and Escape reaches the panel
      expect(document.activeElement).toBe(swatches(panel)[0]);
    });

    // As TinyMCE's own grid was: each colour named (its tooltip too), and reached and picked from the keyboard
    test('should name every swatch and make it a button Enter or Space picks', async () => {
      await appendColorPicker(editor);
      const { panel } = openPanel();
      await observed();

      expect(swatches(panel).map((swatch) => swatch.getAttribute('aria-label'))).toEqual([
        ...namedTextColors.map(({ name }) => name),
        'No color'
      ]);
      expect(
        swatches(panel)
          .slice(0, 2)
          .map((swatch) => swatch.title)
      ).toEqual(['Black', 'Burnt orange']);
      expect(swatches(panel).every((swatch) => swatch.getAttribute('role') === 'button' && swatch.tabIndex === 0)).toBe(
        true
      );

      const navy = swatches(panel)[5];
      const clicked = vi.fn();
      navy.addEventListener('click', clicked);
      expect(pressKey(navy, 'Enter').defaultPrevented).toBe(true);
      expect(pressKey(navy, ' ').defaultPrevented).toBe(true);
      expect(pressKey(navy, 'a').defaultPrevented).toBe(false);
      expect(clicked).toHaveBeenCalledTimes(2);
    });

    test('should show the picker each time the panel shows, with No color marked again, and not while hidden', async () => {
      await appendColorPicker(editor);
      const { panel } = openPanel();
      await observed();

      panel.style.display = 'none';
      await observed();
      expect(show).toHaveBeenCalledOnce();

      panel.style.display = '';
      await observed();

      expect(show).toHaveBeenCalledTimes(2);
      expect(swatches(panel).at(-1)?.classList.contains(textColorClasses.noColor)).toBe(true);
    });
  });
});

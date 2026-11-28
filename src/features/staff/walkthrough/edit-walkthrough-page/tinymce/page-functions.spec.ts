import vm from 'node:vm';

import { pageGlobal, pageScript, type PageArgument, type PageFunction } from '@ta-x-page';
import { controllerButtons } from '@ta-x-site';
import { click, find, readFixtureDocument, required, setHtml } from '@ta-x-test';

import attributes from '../attributes';
import styles from '../styles';

import { addControllerButtons } from './add-controller-buttons';
import { appendButtons } from './append-buttons';
import { addButtonGroup, tinymceGroupName } from './button-group';
import { addInsertXboxImage } from './insert-xbox-images';
import { addSourceCode } from './source-code-button';
import { addTextColors, textColorClasses } from './text-color-buttons';
import { addToggleTheme } from './toggle-theme-button';

// Each script runs from its own source in a context holding only what the page has, as it does in the page: anything
// it reached for from our modules would be a ReferenceError
describe('staff/walkthrough/edit-walkthrough-page/tinymce page functions', () => {
  interface FakeControl {
    settings: { name?: string };
    _items: { _title: string }[];
    _layoutRect: string;
    _lastRepaintRect?: string;
    appended: (string | undefined)[];
    classes: string[];
    addClass: (className: string) => void;
    // Records a button by its name, a control (a group) by its settings' name
    append: (control: { name?: string; settings?: { name?: string } }) => void;
  }

  const control = (settings: { name?: string } = {}, items: { _title: string }[] = []): FakeControl => ({
    settings,
    _items: items,
    _layoutRect: 'its layout',
    appended: [],
    classes: [],
    addClass(className) {
      this.classes.push(className);
    },
    append(added) {
      this.appended.push(added.name ?? added.settings?.name);
    }
  });

  let ours: FakeControl;
  let tableGroup: FakeControl;
  let achievementGroup: FakeControl;
  let toolbars: FakeControl[];
  let created: FakeControl;
  // The toolbar's colour buttons, as its panel's find('colorbutton') gives them
  let colorButtons: unknown[];
  let editor: ReturnType<typeof makeEditor>;

  const makeEditor = () => {
    const added: Record<string, Record<string, unknown>> = {};

    return {
      added,
      buttons: {} as Record<string, { name: string }>,
      theme: {
        panel: {
          find: (selector: string) => {
            if (selector === 'colorbutton') {
              return colorButtons;
            }

            return selector === 'toolbar > buttongroup' ? [ours, tableGroup, achievementGroup] : toolbars;
          }
        }
      },
      addButton(name: string, settings: Record<string, unknown>) {
        added[name] = settings;
        this.buttons[name] = { name };
      },
      addCommand: vi.fn(),
      execCommand: vi.fn(),
      insertContent: vi.fn(),
      undoManager: { transact: (action: () => void) => action() },
      formatter: { apply: vi.fn(), remove: vi.fn() },
      focus: vi.fn(),
      nodeChanged: vi.fn()
    };
  };

  // Runs the script as the page would, with the page's tinymce (and its editor), document and window
  const run = (fn: PageFunction, ...args: PageArgument[]): void => {
    const tinymce = {
      activeEditor: editor,
      ui: {
        Factory: {
          create: (settings: { name: string }) => {
            created = control({ name: settings.name });
            return created;
          }
        }
      },
      DOM: {
        getViewPort: () => ({ h: 900 })
      }
    };

    vm.runInNewContext(pageScript(fn, ...args), { tinymce, document, window, console, URLSearchParams });
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-our-group.html');
    ours = control({ name: tinymceGroupName });
    tableGroup = control({}, [{ _title: 'Bold' }, { _title: 'Table' }]);
    achievementGroup = control({}, [{ _title: 'Add Achievement' }]);
    toolbars = [control(), control()];
    colorButtons = [];
    editor = makeEditor();
  });

  test('addButtonGroup should add our named, classed group to the second toolbar', () => {
    // The fake toolbar has a group by our name already (for the other page functions), so one by another name
    run(
      addButtonGroup,
      pageGlobal('tinymce'),
      pageGlobal('tinymce.activeEditor'),
      'ta-x-new-group',
      'ta-x-tinymce-group'
    );

    expect(created.settings.name).toBe('ta-x-new-group');
    expect(created.classes).toEqual(['ta-x-tinymce-group']);
    expect([toolbars[0].appended, toolbars[1].appended]).toEqual([[], ['ta-x-new-group']]);
  });

  test('addButtonGroup should add nothing when the group is there already, so it can run again', () => {
    run(
      addButtonGroup,
      pageGlobal('tinymce'),
      pageGlobal('tinymce.activeEditor'),
      ours.settings.name ?? '',
      'ta-x-tinymce-group'
    );

    expect([toolbars[0].appended, toolbars[1].appended]).toEqual([[], []]);
  });

  test('addButtonGroup should add nothing while there is no editor yet', () => {
    expect(() =>
      run(
        addButtonGroup,
        pageGlobal('tinymce'),
        pageGlobal('tinymce.notAnEditor'),
        'ta-x-new-group',
        'ta-x-tinymce-group'
      )
    ).not.toThrow();
    expect([toolbars[0].appended, toolbars[1].appended]).toEqual([[], []]);
  });

  test('addControllerButtons should add the 40-button menu to the site group with the Table button', () => {
    run(
      addControllerButtons,
      pageGlobal('tinymce.activeEditor'),
      appendButtons,
      controllerButtons,
      '//static.trueachievements.com/images/controllerbuttons/Xbox One/'
    );

    const menu = editor.added.btnControllerIcons.menu as { image: string; classes: string; onclick: () => void }[];
    expect(menu).toHaveLength(40);
    expect(menu[0]).toMatchObject({
      image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_A.png',
      classes: 'tiny_button firsticon controller-icon'
    });
    expect(menu[1].classes).toBe('tiny_button controller-icon');
    // Every fourth starts a row
    expect(menu.flatMap((item, index) => (item.classes.includes('firsticon') ? [index] : []))).toEqual([
      0, 4, 8, 12, 16, 20, 24, 28, 32, 36
    ]);
    menu[39].onclick();
    expect(editor.insertContent).toHaveBeenCalledExactlyOnceWith('[cn_guide]');
    expect(editor.added.btnControllerIcons).toMatchObject({ type: 'menubutton', title: 'Controller Buttons' });
    expect(editor.added.btnControllerIcons.onclick).toBeUndefined();
    expect(tableGroup.appended).toEqual(['btnControllerIcons']);
    // Laid out again
    expect(tableGroup._lastRepaintRect).toBe('its layout');
  });

  // The edit page's Add images link, as the site serves it (its game id second in its address), its href changed
  // by `href` when given
  const addAddImagesLink = (href?: (real: string) => string): void => {
    const link = find(
      '.addimages a',
      readFixtureDocument('@ta-x-test-views/staff-edit-walkthrough-page/image-viewer.html').body
    );
    if (href) {
      link.setAttribute('href', href(link.getAttribute('href') ?? ''));
    }
    document.body.append(link);
  };

  test("addInsertXboxImage should open the site's captures picker for the game in the Add images link", () => {
    addAddImagesLink();
    const showGamerScreenshots = vi.fn();
    Object.assign(window, { ShowGamerScreenshots: showGamerScreenshots });
    onTestFinished(() => {
      delete (window as Window & { ShowGamerScreenshots?: unknown }).ShowGamerScreenshots;
    });

    run(addInsertXboxImage, pageGlobal('tinymce.activeEditor'), appendButtons);
    const onclick = editor.added.btnAddGamerMedia.onclick as (event: unknown) => boolean;

    expect(onclick('the click')).toBe(false);
    expect(showGamerScreenshots).toHaveBeenCalledExactlyOnceWith(7744, 'txtWalkthrough', 'False', true, 'the click');
    expect(achievementGroup.appended).toEqual(['btnAddGamerMedia']);
  });

  // The real link with only its game id moved or taken out
  test.each([
    [
      'first in the link',
      (real: string) => real.replace('relatedtype=Game&relatedid=7744', 'relatedid=7744&relatedtype=Game'),
      ['btnAddGamerMedia']
    ],
    ['missing from the link', (real: string) => real.replace('relatedid=7744&', ''), []]
  ])('addInsertXboxImage should read the game id %s', (_, href, appended) => {
    addAddImagesLink(href);

    run(addInsertXboxImage, pageGlobal('tinymce.activeEditor'), appendButtons);

    expect(achievementGroup.appended).toEqual(appended);
  });

  test('addSourceCode should add the button to our group and mark its element', () => {
    run(addSourceCode, pageGlobal('tinymce'), pageGlobal('tinymce.activeEditor'), appendButtons, tinymceGroupName, [
      styles.jsSourceCodeButton,
      styles.sourceCodeButton
    ]);

    expect(ours.appended).toEqual(['sourceCode']);
    expect(find('[aria-label="Source Code"] button').classList).toContain(styles.sourceCodeButton);
    expect(editor.added.sourceCode.tooltip).toBe('Source Code');
  });

  test("addSourceCode's button should open the editor's HTML in a dialog, and put the edited HTML back", () => {
    interface Dialog {
      title: string;
      body: Record<string, unknown>;
      onSubmit: (submitted: { data: { code: string } }) => void;
    }
    const opened: Dialog[] = [];
    const code = { value: vi.fn() };
    const setContent = vi.fn();
    const setCursorLocation = vi.fn();
    Object.assign(editor, {
      windowManager: {
        open: (dialog: Dialog) => {
          opened.push(dialog);
          return { find: (selector: string) => (selector === '#code' ? code : undefined) };
        }
      },
      getParam: (_: string, fallback: number) => fallback,
      getContent: (options: unknown) => (JSON.stringify(options) === '{"source_view":true}' ? '<p>its html</p>' : ''),
      setContent,
      selection: { setCursorLocation }
    });
    run(addSourceCode, pageGlobal('tinymce'), pageGlobal('tinymce.activeEditor'), appendButtons, tinymceGroupName, [
      styles.jsSourceCodeButton,
      styles.sourceCodeButton
    ]);

    (editor.added.sourceCode.onclick as () => void)();

    expect(opened).toHaveLength(1);
    expect(opened[0].title).toBe('Source code');
    // The view port's height less the dialog's margin is over the cap
    expect(opened[0].body).toEqual({
      type: 'textbox',
      name: 'code',
      multiline: true,
      minWidth: 600,
      minHeight: 500,
      spellcheck: false,
      style: 'direction: ltr; text-align: left'
    });
    expect(code.value).toHaveBeenCalledExactlyOnceWith('<p>its html</p>');
    expect(setContent).not.toHaveBeenCalled();

    opened[0].onSubmit({ data: { code: '<p>edited</p>' } });
    expect(editor.focus).toHaveBeenCalledOnce();
    expect(setContent).toHaveBeenCalledExactlyOnceWith('<p>edited</p>');
    expect(setCursorLocation).toHaveBeenCalledExactlyOnceWith();
    expect(editor.nodeChanged).toHaveBeenCalledExactlyOnceWith();
  });

  describe('addTextColors', () => {
    interface ColorButton {
      settings: { format: string };
      _color?: string;
      color: (value: string) => void;
      hidePanel: () => void;
    }

    let button: ColorButton;
    let buttonClick: (event: { control: ColorButton }) => void;
    let panelClick: (event: { control: { parent: () => ColorButton }; target: HTMLElement }) => void;

    // Background color's panel, as TinyMCE adds it, with its picker's swatches as jscolor draws them
    const openPanel = (): HTMLElement => {
      const panel = document.createElement('div');
      panel.innerHTML = (editor.added.backcolor.panel as { html: string }).html;
      const picker = required(panel.firstElementChild as HTMLElement | null);
      picker.insertAdjacentHTML(
        'beforeend',
        '<div class="jscolor-palette"><div class="jscolor-palette-sw" id="red"></div>' +
          `<div class="jscolor-palette-sw ${textColorClasses.noColor}" id="no-color"></div></div>`
      );
      document.body.append(panel);
      return panel;
    };
    const field = (panel: HTMLElement): HTMLInputElement => find(`.${textColorClasses.field}`, panel);
    // The picker writing a colour into the field
    const pickColor = (panel: HTMLElement, color: string): void => {
      field(panel).value = color;
      field(panel).dispatchEvent(new Event('change', { bubbles: true }));
    };

    beforeEach(() => {
      // The script's listeners on the page's document, taken off again, as each test runs it afresh
      const listening = new AbortController();
      const addEventListener = document.addEventListener.bind(document);
      const listen = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener, options) =>
        addEventListener(type, listener, {
          ...(typeof options === 'boolean' ? { capture: options } : options),
          signal: listening.signal
        })
      );
      onTestFinished(() => listening.abort());

      // TinyMCE's colour button: color sets what its button half applies
      button = {
        settings: { format: 'hilitecolor' },
        color: vi.fn((value: string) => {
          button._color = value;
        }),
        hidePanel: vi.fn()
      };
      colorButtons = [button];
      run(addTextColors, pageGlobal('tinymce.activeEditor'), appendButtons, tinymceGroupName, textColorClasses);
      listen.mockRestore();

      const settings = editor.added.backcolor as {
        panel: { onclick: typeof panelClick };
        onclick: typeof buttonClick;
      };
      panelClick = settings.panel.onclick;
      buttonClick = settings.onclick;
    });

    test('should add both colour buttons to our group, each panel holding its picker field', () => {
      expect(ours.appended).toEqual(['forecolor', 'backcolor']);
      expect(
        ['forecolor', 'backcolor'].map((name) => {
          const panel = new DOMParser().parseFromString(
            (editor.added[name].panel as { html: string }).html,
            'text/html'
          );
          const input = find<HTMLInputElement>(`.${textColorClasses.picker} > .${textColorClasses.field}`, panel);
          return [input.getAttribute('data-format'), input.getAttribute('aria-label'), input.readOnly];
        })
      ).toEqual([
        ['forecolor', 'Text color', true],
        ['hilitecolor', 'Background color', true]
      ]);
      expect(editor.addCommand.mock.calls.map(([name]) => name)).toEqual(['mceApplyTextcolor', 'mceRemoveTextcolor']);
    });

    test('a colour picked should be applied and set on the button', () => {
      pickColor(openPanel(), '#FF0000');

      expect(editor.formatter.apply).toHaveBeenCalledExactlyOnceWith('hilitecolor', { value: '#FF0000' });
      expect(button.color).toHaveBeenCalledExactlyOnceWith('#FF0000');
    });

    test('an empty field, or another field changing, should apply nothing', () => {
      const panel = openPanel();
      pickColor(panel, '');
      const other = document.createElement('input');
      other.value = '#FF0000';
      document.body.append(other);
      other.dispatchEvent(new Event('change', { bubbles: true }));

      expect(editor.formatter.apply).not.toHaveBeenCalled();
      expect(button.color).not.toHaveBeenCalled();
    });

    test("No color should remove the colour and close the panel, before the picker's own click picks from it", () => {
      const panel = openPanel();
      const pickerClick = vi.fn();
      find('#no-color', panel).addEventListener('click', pickerClick);

      click(find('#no-color', panel));

      expect(editor.execCommand).toHaveBeenCalledExactlyOnceWith('mceRemoveTextcolor', 'hilitecolor');
      expect(button.color).toHaveBeenCalledExactlyOnceWith('transparent');
      expect(button.hidePanel).toHaveBeenCalledOnce();
      expect(pickerClick).not.toHaveBeenCalled();
    });

    test('a swatch should close the panel, as a cell of the grid did, and the pad and sliders should leave it open', () => {
      const panel = openPanel();
      panelClick({ control: { parent: () => button }, target: find(`.${textColorClasses.picker}`, panel) });
      expect(button.hidePanel).not.toHaveBeenCalled();

      panelClick({ control: { parent: () => button }, target: find('#red', panel) });

      expect(button.hidePanel).toHaveBeenCalledOnce();
    });

    test('the button half should apply the colour last picked', () => {
      pickColor(openPanel(), '#FF0000');
      vi.mocked(editor.execCommand).mockClear();
      buttonClick({ control: button });

      expect(editor.execCommand).toHaveBeenCalledExactlyOnceWith('mceApplyTextcolor', 'hilitecolor', '#FF0000');
    });

    test.each([
      { name: 'before any pick', noColorFirst: false },
      { name: 'after No color', noColorFirst: true }
    ])('the button half should remove the colour $name', ({ noColorFirst }) => {
      if (noColorFirst) {
        click(find('#no-color', openPanel()));
        vi.mocked(editor.execCommand).mockClear();
      }

      buttonClick({ control: button });

      expect(editor.execCommand).toHaveBeenCalledExactlyOnceWith('mceRemoveTextcolor', 'hilitecolor');
    });
  });

  test('addToggleTheme should add the toggle to our group, which switches its theme attribute', () => {
    // The fixture was captured with ours already on the button: TinyMCE draws it without them
    const drawn = find('[aria-label="Toggle Theme"] button');
    drawn.removeAttribute(attributes.tinymceTheme);
    drawn.removeAttribute('class');

    run(
      addToggleTheme,
      pageGlobal('tinymce.activeEditor'),
      appendButtons,
      tinymceGroupName,
      'Toggle Theme',
      attributes.tinymceTheme,
      'dark',
      [styles.jsThemeToggle, styles.themeToggle]
    );
    const button = find('[aria-label="Toggle Theme"] button');
    const onclick = editor.added.toggleTheme.onclick as (event: { target: Element }) => void;

    expect(ours.appended).toEqual(['toggleTheme']);
    expect(button.getAttribute(attributes.tinymceTheme)).toBe('dark');
    expect(button.classList).toContain(styles.jsThemeToggle);
    expect(button.classList).toContain(styles.themeToggle);

    onclick({ target: button });
    expect(button.getAttribute(attributes.tinymceTheme)).toBe('');
    onclick({ target: button });
    expect(button.getAttribute(attributes.tinymceTheme)).toBe('dark');
  });
});

import * as taxLib from '@ta-x-lib';
import * as taxPage from '@ta-x-page';
import { find, neverFinds, outcome, required, setHtml, useFakeTimers } from '@ta-x-test';

import { addControllerButtonsButton } from './add-controller-buttons';
import { appendColorPicker } from './append-color-picker';
import { editorLoaded } from './editor-loaded';
import { addInsertXboxImageButton } from './insert-xbox-images';
import { addSelectAllIcon } from './select-all-icon';
import { addSourceCodeButton } from './source-code-button';
import { stickyToolbar } from './sticky-toolbar';
import { addTextColorButtons } from './text-color-buttons';
import { addToggleThemeButton } from './toggle-theme-button';

import { tinymce } from '.';

// happy-dom doesn't load iframes, so the editor's document is taken as loaded at once
vi.mock('./editor-loaded', () => ({ editorLoaded: vi.fn(async () => undefined) }));
// The parts that need the editor have their own specs; here only what they're given
vi.mock('./sticky-toolbar', () => ({ stickyToolbar: vi.fn(async () => undefined) }));
vi.mock('./append-color-picker', () => ({ appendColorPicker: vi.fn(async () => undefined) }));
vi.mock('./toggle-theme-button', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./toggle-theme-button')>()),
  addToggleThemeButton: vi.fn(async () => undefined)
}));

// The editor page's entry for TinyMCE (each part has its own spec): what it waits for, and what it starts
describe('staff/walkthrough/edit-walkthrough-page/tinymce', () => {
  type Task = { name: string; task: () => unknown };
  const batches = (): [string, Task[]][] =>
    vi.mocked(taxLib.allConcurrently).mock.calls.map(([name, tasks]) => [name, tasks as Task[]]);
  const buttonGroupScript = (): HTMLScriptElement | null => document.querySelector('#ta-x-tinymce-button-group');

  // The editor as the site renders it, with TinyMCE's skin stylesheet, which the site adds once the editor loads
  const openEditor = (): void => {
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-editor.html');
    const skin = document.createElement('link');
    // No rel: only its address is looked for, and happy-dom would try to load a stylesheet
    skin.href = '/scripts/tinymce/skins/lightgray/skin.min.css';
    document.head.append(skin);
  };

  beforeEach(() => {
    document.head.querySelectorAll('[href*="skin.min.css"]').forEach((link) => link.remove());
    vi.spyOn(taxLib, 'allConcurrently').mockResolvedValue([]);
    openEditor();
  });

  test('should start nothing before the TinyMCE skin is added (no editor on the page)', async () => {
    find('[href*="skin.min.css"]', document.head).remove();
    vi.spyOn(taxPage, 'waitForElement').mockResolvedValueOnce(null);

    await tinymce();

    expect(batches()).toEqual([]);
  });

  // Depending on the userscript manager, the script can start before the parser reaches <head>
  test('should start the parts when the head was not parsed yet as the script started', async () => {
    const skin = find('[href*="skin.min.css"]', document.head);
    skin.remove();
    vi.spyOn(document, 'head', 'get').mockReturnValueOnce(null as unknown as HTMLHeadElement);

    const starting = tinymce();
    document.documentElement.firstElementChild?.append(skin);
    await starting;

    expect(batches().map(([name]) => name)).toEqual([
      'Edit Walkthrough - TinyMCE',
      'Edit Walkthrough - TinyMCE Buttons'
    ]);
  });

  test("should start nothing without the editor's container", async () => {
    find('.mce-tinymce').remove();
    neverFinds('.mce-tinymce');

    await tinymce();

    expect(batches()).toEqual([]);
  });

  test('should start the toolbar parts and the buttons, each once', async () => {
    await tinymce();

    expect(batches().map(([name, tasks]) => [name, tasks.map((task) => task.name)])).toEqual([
      [
        'Edit Walkthrough - TinyMCE',
        [
          'staff:walkthrough:edit-walkthrough-page:tinymce:sticky-toolbar',
          'staff:walkthrough:edit-walkthrough-page:tinymce:append-color-picker'
        ]
      ],
      [
        'Edit Walkthrough - TinyMCE Buttons',
        [
          'staff:walkthrough:edit-walkthrough-page:tinymce:create-button-group',
          'staff:walkthrough:edit-walkthrough-page:tinymce:add-text-color-buttons',
          'staff:walkthrough:edit-walkthrough-page:tinymce:add-source-code-button',
          'staff:walkthrough:edit-walkthrough-page:tinymce:add-toggle-theme-button',
          'staff:walkthrough:edit-walkthrough-page:tinymce:add-insert-xbox-image-button',
          'staff:walkthrough:edit-walkthrough-page:tinymce:add-controller-buttons-button',
          'staff:walkthrough:edit-walkthrough-page:tinymce:add-select-all-icon'
        ]
      ]
    ]);
    // The buttons that don't need the editor are started as they are
    const buttons = batches()[1][1];
    expect(buttons[1].task).toBe(addTextColorButtons);
    expect(buttons[2].task).toBe(addSourceCodeButton);
    expect(buttons[4].task).toBe(addInsertXboxImageButton);
    expect(buttons[5].task).toBe(addControllerButtonsButton);
    expect(buttons[6].task).toBe(addSelectAllIcon);
    // One wait for the editor's document, shared by every part
    expect(editorLoaded).toHaveBeenCalledExactlyOnceWith(document.querySelector('#txtWalkthrough_ifr'));
  });

  // Both batches start at once; the entry resolves only once both have finished, so the batch above it times its work
  test('should start both batches at once and resolve only once both have finished', async () => {
    useFakeTimers();
    const finishers: ((results: unknown[]) => void)[] = [];
    vi.mocked(taxLib.allConcurrently).mockImplementation(
      () =>
        new Promise<unknown[]>((resolve) => {
          finishers.push(resolve);
        })
    );

    const running = tinymce();
    await vi.waitFor(() => expect(finishers).toHaveLength(2));

    finishers[0]([]);
    expect(await outcome(running)).toEqual({ settled: false });

    finishers[1]([]);
    expect(await outcome(running)).toEqual({ settled: true, value: undefined });
  });

  test("should give the parts that need them the editor's container and the one shared editor", async () => {
    await tinymce();
    const tasks = batches().flatMap(([, batch]) => batch);
    const run = async (name: string): Promise<unknown> => tasks.find((task) => task.name === name)?.task();

    await run('staff:walkthrough:edit-walkthrough-page:tinymce:sticky-toolbar');
    await run('staff:walkthrough:edit-walkthrough-page:tinymce:append-color-picker');
    await run('staff:walkthrough:edit-walkthrough-page:tinymce:add-toggle-theme-button');

    const editor = { iframe: document.querySelector('#txtWalkthrough_ifr'), loaded: expect.any(Promise) };
    expect(stickyToolbar).toHaveBeenCalledExactlyOnceWith(document.querySelector('.mce-tinymce'), editor);
    expect(appendColorPicker).toHaveBeenCalledExactlyOnceWith(editor);
    expect(addToggleThemeButton).toHaveBeenCalledExactlyOnceWith(editor);
    const shared = vi.mocked(stickyToolbar).mock.calls[0][1];
    expect(vi.mocked(appendColorPicker).mock.calls[0][0]).toBe(shared);
    expect(vi.mocked(addToggleThemeButton).mock.calls[0][0]).toBe(shared);
  });

  test("should add our TA-X button group once the editor's document has loaded", async () => {
    await tinymce();
    const createButtonGroup = batches()[1][1][0];

    await createButtonGroup.task();

    expect(required(buttonGroupScript()).textContent).toContain('"ta-x-group"');
    expect(required(buttonGroupScript()).textContent).toContain('"ta-x-tinymce-group"');
  });

  test('should add no button group without the editing iframe', async () => {
    find('#txtWalkthrough_ifr').remove();
    neverFinds('#txtWalkthrough_ifr');
    await tinymce();

    await batches()[1][1][0].task();

    expect(buttonGroupScript()).toBeNull();
  });
});

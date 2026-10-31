import { find, outcome, setHtml, useFakeTimers } from '@ta-x-test';

import { editorBodyReady, editorLoaded } from './editor-loaded';

describe('staff/walkthrough/edit-walkthrough-page/tinymce/editor-loaded', () => {
  const iframe = (): HTMLIFrameElement => find('#txtWalkthrough_ifr');

  const settled = async (promise: Promise<void>): Promise<boolean> => (await outcome(promise)).settled;

  // The editor's document as TinyMCE leaves it (happy-dom doesn't load iframes, so it's stood in for)
  const giveIframeEditorDocument = (): void => {
    const editorDocument = document.implementation.createHTMLDocument();
    editorDocument.body.id = 'tinymce';
    Object.defineProperty(iframe(), 'contentDocument', { value: editorDocument, configurable: true });
  };

  beforeEach(() => {
    useFakeTimers();
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-editor.html');
    Object.defineProperty(iframe(), 'contentDocument', { value: null, configurable: true });
  });

  test("should wait for the iframe's load while the editor hasn't loaded", async () => {
    const loaded = editorLoaded(iframe());

    expect(await settled(loaded)).toBe(false);

    iframe().dispatchEvent(new Event('load'));

    expect(await settled(loaded)).toBe(true);
  });

  test('should resolve at once if the editor has already loaded, as its load event has gone', async () => {
    giveIframeEditorDocument();

    expect(await settled(editorLoaded(iframe()))).toBe(true);
  });

  describe('editorBodyReady', () => {
    test("should give TinyMCE's body at once when it's there", async () => {
      giveIframeEditorDocument();

      expect((await outcome(editorBodyReady(iframe()))).value?.id).toBe('tinymce');
    });

    test('should give the body on the frame it turns up, before the iframe has loaded', async () => {
      const ready = editorBodyReady(iframe());
      expect(await settled(ready.then(() => undefined))).toBe(false);

      // TinyMCE has written its document, its stylesheets still loading (no load event yet)
      giveIframeEditorDocument();
      vi.advanceTimersToNextFrame();

      expect((await outcome(ready)).value?.id).toBe('tinymce');
    });

    test("should give the body on the iframe's load when frames don't run (a hidden tab)", async () => {
      const ready = editorBodyReady(iframe());

      giveIframeEditorDocument();
      iframe().dispatchEvent(new Event('load'));

      expect((await outcome(ready)).value?.id).toBe('tinymce');
    });

    test("should give up on the iframe's load if the editor never gets a body", async () => {
      const ready = editorBodyReady(iframe());

      iframe().dispatchEvent(new Event('load'));

      expect(await outcome(ready)).toEqual({ settled: true, value: null });
    });
  });
});

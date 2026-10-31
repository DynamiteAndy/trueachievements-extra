// The editor's iframe, and when TinyMCE has loaded its document into it. Made once by `tinymce()` and handed to every
// part that needs the editor's document: a part waiting for the iframe's `load` event on its own misses it whenever
// the iframe has already loaded by the time that part finds it
export interface Editor {
  iframe: HTMLIFrameElement;
  loaded: Promise<void>;
}

// TinyMCE's document has its body as #tinymce. Checked through the DOM, since the page's `tinymce` global isn't ours to
// read
const isLoaded = (iframe: HTMLIFrameElement): boolean => Boolean(iframe.contentDocument?.querySelector('#tinymce'));

// Resolves at once if the editor has already loaded, or on the iframe's next `load` otherwise
export const editorLoaded = (iframe: HTMLIFrameElement): Promise<void> =>
  new Promise((resolve) => {
    if (isLoaded(iframe)) {
      resolve();
      return;
    }

    iframe.addEventListener('load', () => resolve(), { once: true });
  });

// TinyMCE's body in the editor's iframe (#tinymce), as soon as it's there: before the iframe's `load`, which waits for
// the editor's own stylesheets and so leaves their white showing meanwhile. Looked for each frame until it is, or until
// the `load` (when the page is hidden and frames don't run); null if the editor never gets one
export const editorBodyReady = (iframe: HTMLIFrameElement): Promise<HTMLElement | null> =>
  new Promise((resolve) => {
    const body = (): HTMLElement | null => iframe.contentDocument?.querySelector<HTMLElement>('#tinymce') ?? null;
    let done = false;
    const finish = (found: HTMLElement | null): void => {
      if (!done) {
        done = true;
        resolve(found);
      }
    };
    const look = (): void => {
      const found = body();
      if (found) {
        finish(found);
      } else if (!done) {
        requestAnimationFrame(look);
      }
    };

    iframe.addEventListener('load', () => finish(body()), { once: true });
    look();
  });

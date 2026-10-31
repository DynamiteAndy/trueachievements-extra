import { mountDetached, waitForElement } from '@ta-x-page';

import { StickyToolbar } from './StickyToolbar';

import type { Editor } from './editor-loaded';

// Keeps the editor's toolbar stuck while the walkthrough scrolls. Its controller renders into a root of its own that
// isn't on the page; the function returned unmounts it, giving the toolbar back
export const stickyToolbar = async (
  container: HTMLElement,
  editor: Editor | null
): Promise<(() => void) | undefined> => {
  const toolbar = await waitForElement('.mce-container-body .mce-toolbar-grp', { root: container });

  if (!toolbar) {
    return undefined;
  }

  return mountDetached(<StickyToolbar toolbar={toolbar} container={container} editorLoaded={editor?.loaded} />).unmount;
};

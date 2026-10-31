import { mount, waitForElement } from '@ta-x-page';

import type { VNode } from 'preact';

// TinyMCE draws a button of ours with its placeholder icon: once the button (`selector`) is there, ours replaces it
export const replacePlaceholderIcon = async (selector: string, icon: VNode): Promise<void> => {
  const button = await waitForElement(selector);

  if (!button) {
    return;
  }

  button.replaceChildren();
  mount(icon, button);
};

import { bodyReady, waitForElement } from '@ta-x-page';
import { settings } from '@ta-x-storage';

import attributes from '../attributes';

import skin from './charcoal/skin.scss';

const { tinymceTheme } = settings.staff.walkthrough.editWalkthroughPage;

// The editor's theme from the site's or the toggle's: `dark`, or `''` for light. The site's own light theme is `''`
// once switched and `normal` after a reload, so both read as light
export const editorTheme = (theme: string): string => (theme === 'dark' ? 'dark' : '');

// The editor's theme as the page loads: the one saved from its toggle, otherwise the site's
export const savedEditorTheme = async (): Promise<string> => {
  const saved = tinymceTheme.peek();
  if (saved !== null) {
    return editorTheme(saved);
  }

  const globalTheme = await waitForElement('.page, [data-theme]');
  return editorTheme(globalTheme?.getAttribute('data-theme') ?? '');
};

// The editor's skin and its theme on <body>, from the start of the page rather than once the editor is there: TinyMCE
// draws its toolbar and frame in its own white, which would otherwise show until our theme caught up
export const themeEditorEarly = async (): Promise<void> => {
  GM_addStyle(skin);
  const [body, theme] = await Promise.all([bodyReady(), savedEditorTheme()]);

  if (!body.hasAttribute(attributes.theme)) {
    body.setAttribute(attributes.theme, theme);
  }
};

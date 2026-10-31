import { pageGlobal } from '@ta-x-page';

import { appendButtons, type AppendButtons } from './append-buttons';
import { injectTinyMCEScript } from './tinymce-script';

import type { TinyMCEEditor } from './tinymce-api';

// The site's function behind its own Insert Xbox captures button (a page global)
type ShowGamerScreenshots = (
  gameId: number,
  textareaId: string,
  isPrivate: string,
  isEditor: boolean,
  event: unknown
) => void;

// A page function (page/page-script.ts): adds Insert Xbox captures to the site's group with its Add Achievement
// button, opening the site's own captures picker for the walkthrough's game
export const addInsertXboxImage = (editor: TinyMCEEditor, append: AppendButtons): void => {
  // The game id is in the site's Add images link: javascript:LaunchChild('…&relatedid=<game id>…')
  const addImageElement = document.querySelector<HTMLAnchorElement>('a[title="Add images"]');
  // Matched in the href itself: it's a javascript: href, not an address, so it can't be read as one
  const gameId = parseInt(addImageElement?.href.match(/[?&]relatedid=(\d+)/)?.[1] ?? '');
  if (Number.isNaN(gameId)) {
    return;
  }

  editor.addButton('btnAddGamerMedia', {
    title: 'Insert Xbox captures',
    image: '/images/icons/game-screenshots.png',
    onclick: (event) => {
      // The site's function, looked up when clicked
      (window as Window & { ShowGamerScreenshots?: ShowGamerScreenshots }).ShowGamerScreenshots?.(
        gameId,
        'txtWalkthrough',
        'False',
        true,
        event
      );
      return false;
    }
  });

  append(editor, { buttonTitle: 'Add Achievement' }, ['btnAddGamerMedia']);
};

export const addInsertXboxImageButton = (): Promise<void> =>
  injectTinyMCEScript({
    id: 'ta-x-insert-xbox-image-command',
    siteButton: '.mce-btn[aria-label="Insert Xbox captures"]',
    build: () => [addInsertXboxImage, pageGlobal('tinymce.activeEditor'), appendButtons]
  });

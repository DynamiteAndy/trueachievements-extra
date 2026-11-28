import { fetchOk, memoizeFetchDocument } from '@ta-x-fetch';
import { waitForElement } from '@ta-x-page';
import { GamesRegex, onThisSite, pageParam, readWalkthroughThanks, SentencesRegex } from '@ta-x-site';

import { getOwnerProgressUrl, rememberOwnerProgressUrl } from './owner-progress-urls';
import { walkthroughHub } from './remember-walkthrough-thread';

import type { OwnerProgress } from './ShowOwnerProgress';
import type { WalkthroughEditorRow } from './WalkthroughEditors';

// Walkthrough links are /game/<name>/walkthrough now, but older posts link to /<name>-walkthrough.htm, which redirects
// there, so follow those to the walkthrough's current address. A typed link may be a path, read against the page, and
// must lead into this site, as the checks read the path alone
export const resolveWalkthroughUrl = async (url: string): Promise<string | null> => {
  const { href, pathname } = new URL(url, window.location.href);
  if (!onThisSite(href)) {
    return null;
  }

  if (GamesRegex.Test.walkthroughUrl(href)) {
    return href;
  }

  if (!/-walkthrough\.htm$/i.test(pathname)) {
    return null;
  }

  const response = await fetchOk(href, { method: 'HEAD' }).catch(() => null);

  return response && GamesRegex.Test.walkthroughUrl(response.url) ? response.url : null;
};

// What the section found: the walkthrough's address and what it shows
export interface Found {
  url: string;
  ownerProgress: OwnerProgress;
}

// The thread's walkthrough, remembered for the thread or linked in its first posts; null when it can't be found
export const findThreadsOwnerProgress = async (): Promise<Found | null> => {
  const threadId = pageParam('tid');
  let url = threadId ? await getOwnerProgressUrl(threadId) : null;

  if (!url) {
    const posts = await waitForElement('.posts');
    if (!posts) {
      return null;
    }

    for (const el of posts.querySelectorAll<HTMLElement>('li .body')) {
      const text = el.innerText;
      if (!SentencesRegex.discussWalkthrough.test(text) && !SentencesRegex.walkthroughPublished.test(text)) {
        continue;
      }

      const anchor = el.querySelector('a');

      // Only a link into this site: the checks below read the path alone
      if (!anchor || !onThisSite(anchor.href)) {
        continue;
      }

      // A walkthrough's own link (a page of it too, /walkthrough/2) as it is; any other link into a game (its hub, its
      // /achievements…) to that game's walkthrough
      if (GamesRegex.Test.walkthroughUrl(anchor.href)) {
        url = anchor.href;
        break;
      }
      if (GamesRegex.Test.gameUrl(anchor.href) && GamesRegex.Extract.gameName(anchor.href)) {
        url = walkthroughHub(anchor.href);
        break;
      }

      url = await resolveWalkthroughUrl(anchor.href);

      if (url) {
        break;
      }
    }

    if (!url) {
      return null;
    }
  }

  const ownerProgress = await getOwnerProgress(url);
  return ownerProgress && { url, ownerProgress };
};

// A walkthrough's owner and progress, remembering the link for the thread when it has them. A walkthrough page that
// doesn't load (e.g. a mistyped link's 404) throws
export const getOwnerProgress = async (url: string): Promise<OwnerProgress | null> => {
  const ownerProgress = await findOwnerProgress(url);

  if (!ownerProgress) {
    return null;
  }

  const threadId = pageParam('tid');

  // Remembers the link that worked, also over one the thread had that no longer does
  if (threadId) {
    await rememberOwnerProgressUrl(threadId, url);
  }

  return ownerProgress;
};

// A published walkthrough lists its gamers involved; an unpublished one has nothing to show, so the section asks for a
// link. Only a page of this site is read: a link remembered by an older version may lead anywhere, and its page's links
// are shown as they are
const findOwnerProgress = async (url: string): Promise<OwnerProgress | null> => {
  if (!onThisSite(url)) {
    return null;
  }

  const walkthroughDocument = await memoizeFetchDocument(url);
  const walkthroughEditors = walkthroughDocument.querySelector('.editors dl');

  return walkthroughEditors
    ? { editors: getEditorRows(walkthroughEditors), thanks: readWalkthroughThanks(walkthroughDocument) }
    : null;
};

// Each <dt> holds a gamer's avatar (linked to them on most walkthroughs, a bare picture on some), followed by a <dd>
// for each of their roles: "<a>name</a> (Owner)"
const getEditorRows = (walkthroughEditors: Element): WalkthroughEditorRow[] =>
  [...walkthroughEditors.children].reduce<WalkthroughEditorRow[]>((rows, current) => {
    if (current.tagName === 'DT') {
      const link = current.querySelector('a');
      const image = current.querySelector('img');

      rows.push({
        avatar: image
          ? {
              src: image.getAttribute('src') ?? '',
              alt: image.alt,
              link: link ? { href: link.getAttribute('href') ?? '', iml: link.classList.contains('iml') } : null
            }
          : null,
        editors: []
      });
    } else if (current.tagName === 'DD' && rows.length > 0) {
      const link = current.querySelector('a');
      if (!link) {
        return rows;
      }

      rows[rows.length - 1].editors.push({
        name: link.textContent.trim(),
        href: link.getAttribute('href') ?? '',
        rel: link.getAttribute('rel'),
        role: current.textContent
          .replace(link.textContent, '')
          .trim()
          .replace(/^\((.*)\)$/, '$1')
      });
    }

    return rows;
  }, []);

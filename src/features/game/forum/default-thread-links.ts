import { mutationObserver, bodyReady } from '@ta-x-page';
import { GamesRegex, onThisSite } from '@ta-x-site';
import { settings } from '@ta-x-storage';

const { forum } = settings.game;

// The address of a link to a game's forum that doesn't name a tab (/game/<name>/forum, e.g. the game's Forum tab), or
// null for any other link
const plainForumUrl = (anchor: HTMLAnchorElement): URL | null => {
  // An href the browser can't parse comes back as written, which is no address
  const url = URL.parse(anchor.href, window.location.href);

  return url && onThisSite(url.href) && GamesRegex.Test.forumUrl(url.href) && !url.searchParams.has('type')
    ? url
    : null;
};

const linkToDefaultThread = (anchor: HTMLAnchorElement, type: string): void => {
  const url = plainForumUrl(anchor);
  if (!url) {
    return;
  }

  url.searchParams.set('type', type);
  // Relative, as the site writes them
  anchor.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
};

// Points every link to a game's forum at the user's default tab (?type=community / gameinfo), on every page, so the
// forum opens on it at once. The site honours ?type=, so this saves loading All Threads and then clicking the tab
// (changeToDefaultThread still does that for a forum reached some other way, e.g. a bookmark). Returns the stop for
// watching new links, while it watches
export const linkForumsToDefaultThread = async (): Promise<(() => void) | undefined> => {
  const type = forum.defaultThreadValue.peek();

  // All Threads is the forum's own default
  if (!forum.defaultThread.peek() || type === 'all') {
    return undefined;
  }

  await bodyReady();

  document
    .querySelectorAll<HTMLAnchorElement>('a[href*="/forum"]')
    .forEach((anchor) => linkToDefaultThread(anchor, type));

  return mutationObserver.onElementAdded('a[href*="/forum"]', (anchor) => {
    if (anchor instanceof HTMLAnchorElement) {
      linkToDefaultThread(anchor, type);
    }
  });
};

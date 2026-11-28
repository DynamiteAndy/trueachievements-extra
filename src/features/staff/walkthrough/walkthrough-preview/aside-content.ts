import { fetchOk, MemoizeFetch, memoizedFetches, memoizeFetchDocument } from '@ta-x-fetch';
import { timed, toInt } from '@ta-x-lib';
import {
  GamesRegex,
  pageParam,
  parsePostback,
  postbackBody,
  readWalkthroughThanks,
  siteUrl,
  StaffRegex
} from '@ta-x-site';

import {
  forgetWalkthroughPreview,
  getGameAchievements,
  keptFor4Hours,
  nameKey,
  readWalkthroughPreview,
  walkthroughMarkup
} from '../shared';

import type { GameAchievement, GameAchievementIcon } from '../shared';

import { walkthroughPagePreviewPath } from './page-preview-path';
import { getPageWalkthrough, rememberPages } from './preview-page-walkthroughs';
import { isPreviewStatus } from './preview-statuses';

import type { WalkthroughPreview } from './WalkthroughPreviewAside';

// What the preview's side column shows, read from the walkthrough's pages and the game's achievements
export type AsideContentPreviewPage = {
  index: string;
  title: string;
  id: string;
};

export type AsideContentPreviewAchievement = {
  title: string;
  description: string;
  /** The page it's on, when known */
  page?: AsideContentPreviewPage;
  /** Where its link goes (null when its page isn't known, so it isn't linked) */
  href: string | null;
  id: string;
  /** Placeholder image, used when the icon isn't known */
  src: string;
  icon?: GameAchievementIcon;
};

// The image each achievement read from the manage page gets, as that page has no pictures (a published walkthrough's
// achievements take theirs from its public page)
const achievementPlaceholderImage = `${siteUrl}/imagestore/m/0004101700/4101796.jpg`;

// An element the side column needs from a fetched page; missing (the site changed its markup), the lookup fails with
// what was missing, which the aside logs before asking for the walkthrough
const needed = <T extends Element>(page: Document, selector: string): T => {
  const element = page.querySelector<T>(selector);
  if (!element) {
    throw new Error(`The walkthrough's pages have no "${selector}"`);
  }

  return element;
};

// What a lookup found: the walkthrough to show, null to ask for it, or 'remove' when there's nothing to show (a
// walkthrough in a status it doesn't cover, one the gamer can't open, or a published one whose public page can't be
// read), so the preview goes without its aside, as it does with the setting off
export type Found = WalkthroughPreview | null | 'remove';

// The preview's walkthrough: its own on the walkthrough's preview, or remembered for a page preview's page
export const findPreviewsWalkthrough = async (): Promise<Found> => {
  let walkthroughId: string | null = null;

  if (StaffRegex.Walkthroughs.Test.walkthroughPreviewUrlWithWalkthroughId()) {
    walkthroughId = pageParam('walkthroughid');
  } else if (StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()) {
    const pageId = pageParam('pageid');
    walkthroughId = pageId ? await getPageWalkthrough(pageId) : null;
  }

  return walkthroughId ? getAsideContent(walkthroughId) : null;
};

const manageWalkthroughUrl = (walkthroughId: string): string =>
  `${siteUrl}/staff/walkthrough/managewalkthrough.aspx?walkthroughid=${walkthroughId}`;

// The "View public page" post goes to the manage page's address, whose GET the preview caches too, so its answer is
// cached under that address with this hash
const viewPublicPageHash = '#view-public-page';

// Drops the cached copies of a walkthrough's manage page, preview and public page, so its next preview reads its pages,
// games, thanks and achievements afresh rather than waiting out keptFor4Hours. A cache that can't be written just means
// the copies stay until then
export const forgetWalkthroughCopies = async (walkthroughId: string): Promise<void> => {
  await Promise.all([
    memoizedFetches.delete(manageWalkthroughUrl(walkthroughId)).catch(() => undefined),
    memoizedFetches.delete(`${manageWalkthroughUrl(walkthroughId)}${viewPublicPageHash}`).catch(() => undefined),
    forgetWalkthroughPreview(walkthroughId)
  ]);
};

export const getAsideContent = async (walkthroughId: string): Promise<Found> => {
  const manageWalkthroughDocument = await memoizeFetchDocument(manageWalkthroughUrl(walkthroughId), {}, keptFor4Hours);
  const status = manageWalkthroughDocument.querySelector<HTMLInputElement>('#txtStatusReadOnly, #txtStatus')?.value;

  // A walkthrough the gamer can't open (access denied): the site answers with its walkthrough list instead, which has
  // no status. There's nothing to show, so the preview goes without its aside.
  if (status === undefined) {
    return 'remove';
  }

  if (status === 'Published') {
    return getPublishedAsideContent(walkthroughId, manageWalkthroughDocument);
  }

  if (!isPreviewStatus(status)) {
    return 'remove';
  }

  // The walkthrough's preview has its game and its forum thread
  const walkthroughPreviewDocument = await getWalkthroughPreviewDocument(walkthroughId);
  const gameAchievements = await getGameAchievements(
    needed<HTMLAnchorElement>(walkthroughPreviewDocument, walkthroughMarkup.previewGameLinks).href
  );
  const pages = getPages(manageWalkthroughDocument);

  return rememberAndBuildPreview(walkthroughId, manageWalkthroughDocument, walkthroughPreviewDocument, pages, {
    total: '0',
    achievements: timed('Walkthrough preview: achievements by page', () =>
      getAchievementsInWalkthrough(manageWalkthroughDocument, gameAchievements, pages)
    )
  });
};

// The side column for either kind of walkthrough: its pages (on a page preview) and its thanks thread are read the same
// way, its thanks count and achievements are what differ. Remembers the pages for its other page previews
const rememberAndBuildPreview = async (
  walkthroughId: string,
  manageWalkthroughDocument: Document,
  walkthroughPreviewDocument: Document,
  pages: AsideContentPreviewPage[],
  { total, achievements }: { total: string; achievements: WalkthroughPreview['achievements'] }
): Promise<WalkthroughPreview> => {
  // So its page previews find it without asking. A page whose link can't be read is still listed, but has no id
  await rememberPages(walkthroughId, pages.map((page) => page.id).filter(Boolean));

  return {
    pages: StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()
      ? {
          walkthroughId,
          walkthroughName: needed<HTMLInputElement>(manageWalkthroughDocument, '#txtWalkthroughName').value,
          pages,
          currentPageId: pageParam('pageid') ?? ''
        }
      : null,
    thanks: {
      thread: needed<HTMLAnchorElement>(walkthroughPreviewDocument, '.summary dd a').href,
      total
    },
    achievements
  };
};

// A published walkthrough's manage page doesn't link its pages, and its thanks and achievements are on its public page:
// the pages come from its preview, the thanks count and achievements (as the site lists them, linking to the public
// page) from the public page
const getPublishedAsideContent = async (walkthroughId: string, manageWalkthroughDocument: Document): Promise<Found> => {
  const publicPage = await getPublicWalkthroughPage(walkthroughId, manageWalkthroughDocument);

  if (!publicPage) {
    return 'remove';
  }

  const walkthroughPreviewDocument = await getWalkthroughPreviewDocument(walkthroughId);
  const pages = getPreviewPages(walkthroughPreviewDocument);

  return rememberAndBuildPreview(walkthroughId, manageWalkthroughDocument, walkthroughPreviewDocument, pages, {
    total: readWalkthroughThanks(publicPage)?.count ?? '0',
    achievements: getPublicAchievements(publicPage)
  });
};

// Only a public walkthrough page is let through to be cached (fetchOk throws one that isn't a success)
const publicWalkthroughPages = new MemoizeFetch(async (url, options) => {
  const response = await fetchOk(url, options);

  if (!GamesRegex.Test.walkthroughUrl(response.url)) {
    throw response;
  }

  return response;
});

// The manage page's "View public page" button posts the page's form back (the site's Postback, with its Command), and
// the site answers with the public page. The form is sent as the page has it, so nothing on it changes. The page is
// kept as long as the manage page (keptFor4Hours). Null if the answer isn't a public walkthrough page.
const getPublicWalkthroughPage = async (
  walkthroughId: string,
  manageWalkthroughDocument: Document
): Promise<Document | null> => {
  const form = manageWalkthroughDocument.querySelector<HTMLFormElement>('#frm');
  if (!form) {
    return null;
  }

  const body = postbackBody(form, { command: 'btnViewWalkthrough', argument: '' });

  const url = new URL(form.getAttribute('action') ?? '', manageWalkthroughUrl(walkthroughId)).href;

  try {
    return await publicWalkthroughPages.memoizeFetchDocument(
      url,
      { method: 'POST', body },
      { ...keptFor4Hours, cacheKey: url + viewPublicPageHash }
    );
  } catch {
    return null;
  }
};

// On the walkthrough's own preview that's this page; on a page's preview, or another walkthrough's, it's fetched
const getWalkthroughPreviewDocument = async (walkthroughId: string): Promise<Document> =>
  StaffRegex.Walkthroughs.Test.walkthroughPreviewUrlWithWalkthroughId() && pageParam('walkthroughid') === walkthroughId
    ? document
    : readWalkthroughPreview(walkthroughId);

// The walkthrough's pages as its preview lists them (a number, then a link to the page's preview)
const getPreviewPages = (walkthroughPreviewDocument: Document): AsideContentPreviewPage[] =>
  [...walkthroughPreviewDocument.querySelectorAll<HTMLAnchorElement>('.pages dd a[href*="pageid="]')].flatMap(
    (page) => {
      const index = page.closest('dd')?.previousElementSibling?.textContent.trim();
      const id = new URL(page.href, siteUrl).searchParams.get('pageid');

      return index && id ? [{ index, title: page.textContent.trim(), id }] : [];
    }
  );

// The achievements the public page lists, linking to them on it
const getPublicAchievements = (publicPage: Document): AsideContentPreviewAchievement[] =>
  [...publicPage.querySelectorAll('section.walkthrough-right ul.il li')].flatMap((item) => {
    const link = item.querySelector('a');
    if (!link) {
      return [];
    }

    return [
      {
        title: link.textContent.trim(),
        description: item.querySelector('p')?.textContent.trim() ?? '',
        href: new URL(link.getAttribute('href') ?? '', siteUrl).href,
        id: item.getAttribute('data-i') ?? '',
        src: new URL(item.querySelector('img')?.getAttribute('src') ?? '', siteUrl).href
      }
    ];
  });

const getPages = (manageWalkthroughDocument: Document): AsideContentPreviewPage[] => {
  return [
    ...manageWalkthroughDocument.querySelectorAll<HTMLAnchorElement>('#scrolllstWalkthroughPages tbody .c2 a')
  ].map((page, index) => ({
    index: (index + 1).toString(),
    title: page.textContent.trim(),
    id: toInt(parsePostback(page.href)?.argument)?.toString() ?? ''
  }));
};

// The game's achievements that the walkthrough covers, each with the page it's on, in page order
const getAchievementsInWalkthrough = (
  manageWalkthroughDocument: Document,
  gameAchievements: GameAchievement[],
  pages: AsideContentPreviewPage[]
): AsideContentPreviewAchievement[] => {
  // Each row's name read once, not once per achievement, as a long walkthrough lists many. A name the table lists twice
  // takes its first row
  const rowsByName = new Map<string, HTMLElement>();
  manageWalkthroughDocument
    .querySelectorAll<HTMLElement>(`${walkthroughMarkup.achievementsTable} tbody tr`)
    .forEach((row) => {
      const key = nameKey(row.querySelector<HTMLElement>('.c1')?.innerText ?? '');
      if (!rowsByName.has(key)) {
        rowsByName.set(key, row);
      }
    });
  const achievementsMerged: AsideContentPreviewAchievement[] = [];

  gameAchievements.forEach(({ title: achievementName, description, id, icon }) => {
    const walkthroughAchievement = rowsByName.get(nameKey(achievementName));

    if (!walkthroughAchievement) {
      return;
    }

    const pageIndex = walkthroughAchievement.querySelector('.c2')?.textContent.trim();
    const page = pages.find(({ index }) => index === pageIndex);

    achievementsMerged.push({
      title: achievementName,
      description,
      page,
      // Not linked if its page isn't one of the walkthrough's (e.g. not given one yet)
      href: page ? `${walkthroughPagePreviewPath(page.id)}#ap${id}` : null,
      id,
      src: achievementPlaceholderImage,
      icon
    });
  });

  // In page order, any without a page last
  const pageOrder = (achievement: AsideContentPreviewAchievement): number =>
    (achievement.page ? toInt(achievement.page.index) : null) ?? Number.MAX_SAFE_INTEGER;
  return achievementsMerged.sort((a, b) => pageOrder(a) - pageOrder(b));
};

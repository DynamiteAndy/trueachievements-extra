// Upkeep of what the script stores, started with the features rather than after them (src/index.ts): the storage
// migrations, the daily sweep of expired data and unlinked guide pages, refreshing the cached copy of the page the
// user is on, the guides handed over from the guide sites, and carrying the two lists once kept in Tampermonkey storage
// over to IndexedDB. Only the refresh needs the page. Forgetting the last gamer's pages runs before the rest of
// start-up, and only when the signed-in gamer has changed.

import {
  carryOverOwnerProgressUrls,
  carryOverPreviewPageWalkthroughs,
  forgetGiveawayTries,
  forgetUnlinkedGuidePages,
  ownerProgressUrls,
  previewPageWalkthroughs,
  takeAllHandedOverGuides
} from '@ta-x-features';
import { memoizedFetches, refreshMemoizedExtracts, refreshMemoizedFetch } from '@ta-x-fetch';
import { allConcurrently, durationMs } from '@ta-x-lib';
import { whenParsed } from '@ta-x-page';
import { allAchievementsShown, signedInGamerId, StaffRegex } from '@ta-x-site';
import { runMigrations } from '@ta-x-storage';

// The gamer the cached pages were fetched for ('' signed out). In the site's localStorage, beside the cache it's about:
// the stores are the site's IndexedDB, which the dev and release scripts share
export const cacheGamerKey = 'ta-x:cache-gamer';

// Pages are cached by address, and some show the signed-in gamer's own state (the staff pages, the giveaway page): on
// a shared computer, the next account would read the last one's. So when the gamer signed in isn't the one the cache was
// filled for (signing out counts), the cache is emptied and what the giveaway tried forgotten. Null when it's the same
// gamer, so start-up waits for nothing then. A cache that can't be cleared just means its copies expire as before
export const forgetLastGamer = (): Promise<void> | null => {
  const gamer = signedInGamerId() ?? '';

  if (gamer === (localStorage.getItem(cacheGamerKey) ?? '')) {
    return null;
  }

  return (async () => {
    await memoizedFetches.clear().catch(() => undefined);
    forgetGiveawayTries();
    localStorage.setItem(cacheGamerKey, gamer);
  })();
};

// When expired data was last swept. In the site's localStorage, as the stores are the site's IndexedDB: losing it only
// means one extra sweep
export const sweptKey = 'ta-x:expired-data-swept';
const day = durationMs({ value: 1, period: 'days' });

// The IndexedDB stores whose entries expire: fetched pages, and the remembered walkthrough links and preview pages
export const expiringStores = [memoizedFetches, ownerProgressUrls, previewPageWalkthroughs];

// Each entry already expires itself when read, and an unlinked guide page's guides are never shown, so the sweep only
// reclaims space: once a day is plenty
export const sweepExpired = async (): Promise<void> => {
  const swept = Number(localStorage.getItem(sweptKey));

  if (Date.now() - swept < day) {
    return;
  }

  await Promise.all([...expiringStores.map((store) => store.clearExpired()), forgetUnlinkedGuidePages()]);
  localStorage.setItem(sweptKey, String(Date.now()));
};

// A fetch never caches an error page, so neither does the refresh. Browsers that don't report the status (0, or no
// entry) are taken as fine, as the page is all there is to go on
const answeredOk = (): boolean => {
  const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  const status = navigation?.responseStatus ?? 0;

  return status === 0 || (status >= 200 && status < 300);
};

// Whether the page shows what a fetch of its address gets. An achievements or DLC page set to Won or Not won (by the
// user or the default status) keeps its address, as the status posts back, yet lists only some achievements, and
// individual progress reads the full list from the cache. The manage walkthrough page posts back to the same address
// too, so what it shows depends on what was clicked rather than on its address
const showsFetchedView = (): boolean =>
  answeredOk() && allAchievementsShown() !== false && !StaffRegex.Walkthroughs.Test.manageWalkthroughUrl();

// A cached page the user visits is already loaded, so its copy is brought up to date for free (counts won, a list of
// games), at its address (every page is cached by its full address), and only while it's cached. The page is read as
// soon as it's parsed, before the features change what they read from it, even when the writes finish later, e.g.
// queued behind the daily sweep
export const refreshVisitedPage = async (): Promise<void> => {
  await whenParsed();

  if (!showsFetchedView()) {
    return;
  }

  const page = document.documentElement.outerHTML;
  // What a feature keeps from this page instead of the page (the wishlist's on-sale lists), read now with the page
  await Promise.all([
    refreshMemoizedFetch(window.location.href, page),
    refreshMemoizedExtracts(window.location.href, document)
  ]);
};

// The migrations come first: they're synchronous, so they've finished before any feature starts
export const maintenance = async (): Promise<void> => {
  await allConcurrently('Maintenance', [
    { name: 'maintenance:migrations', task: runMigrations },
    { name: 'maintenance:sweep-expired', task: sweepExpired },
    { name: 'maintenance:refresh-visited-page', task: refreshVisitedPage },
    { name: 'maintenance:handed-over-guides', task: takeAllHandedOverGuides },
    { name: 'maintenance:carry-over-owner-progress-urls', task: carryOverOwnerProgressUrls },
    { name: 'maintenance:carry-over-preview-pages', task: carryOverPreviewPageWalkthroughs }
  ]);
};

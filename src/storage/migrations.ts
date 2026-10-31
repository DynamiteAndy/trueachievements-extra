// Changes to what the script keeps in Tampermonkey storage, in order. `ta-x:storage-version` holds the version of the
// last one run, and at start-up every migration above it runs, bumping it after each. A migration that throws stops the
// list without bumping, so it runs again on the next page.
//
// Every migration must be safe to run twice: tabs starting together can each read the old version and run it, so a
// second run must leave storage as the first left it (migrations.spec.ts runs each twice over its old storage).
//
// - Removing a setting or stored value: delete its code, and add a migration deleting its key.
// - Renaming a key: a migration copying the value to the new key while the old key is still there, then deleting the
//   old one (copied unconditionally, a second run would write nothing over the moved value).
// - Changing a stored format: a migration converting only what's still in the old format, so reading needn't cope with
//   it.
//
// A migration describes storage as it was when it was written, so it names its keys as literals rather than
// importing today's names. Every key still in use is declared in stored-values.spec.ts. The dev and release scripts
// each have their own storage, so each runs the list once.

import { reloadSettings } from './setting';
import { readEntries } from './stored-json';

export const storageVersionKey = 'ta-x:storage-version';

// A guide link in the form the guides read from its page are kept under (https://www., no query, ending in a slash).
// One that isn't an address is kept as it was. `keepQueried` keeps a link with a query as it was too
const tidyGuideLink = (link: unknown, { keepQueried }: { keepQueried: boolean }): unknown => {
  if (typeof link !== 'string' || !URL.canParse(link)) {
    return link;
  }

  const { hostname, pathname, search } = new URL(link);

  if (search && keepQueried) {
    return link;
  }

  const host = hostname.split('.').length === 2 ? `www.${hostname}` : hostname;

  return `https://${host}${pathname.endsWith('/') ? pathname : `${pathname}/`}`;
};

// Tidies every game's guide links on each guide site, dropping a link that tidies to one the game already has. Safe to
// run again: a tidy link tidies to itself
const tidyGuideLinks = ({ keepQueried }: { keepQueried: boolean }): void => {
  [
    'gameAchievementsXboxAchievementsGuideUrl',
    'gameAchievementsPlaystationTrophiesGuideUrl',
    'gameAchievementsGamertagNationGuideUrl'
  ].forEach((key) => {
    const entries = readEntries(key, GM_getValue(key, ''));

    if (!entries) {
      return;
    }

    const tidied = entries.map(([game, links]) => [
      game,
      Array.isArray(links) ? [...new Set(links.map((link) => tidyGuideLink(link, { keepQueried })))] : links
    ]);

    if (JSON.stringify(tidied) !== JSON.stringify(entries)) {
      GM_setValue(key, JSON.stringify(tidied));
    }
  });
};

// The settings' keys before they followed src/features' folders (version 5), each with its new key
export const settingKeysBeforeFolders: [from: string, to: string][] = [
  ['stickyHeader-enabled', 'allPages.stickyHeader.enabled'],
  ['stickyHeader-remainStuck', 'allPages.stickyHeader.remainStuck'],
  ['stickyHeader-fitMenus', 'allPages.stickyHeader.fitMenus'],
  ['emojis-enabled', 'allPages.emojis'],
  ['giveawayAutoOptIn-enabled', 'allPages.giveawayAutoOptIn'],
  ['improvedImageSelector', 'staff.walkthrough.editWalkthroughPage.improvedImageSelector'],
  ['autoSaveNotification', 'staff.walkthrough.editWalkthroughPage.autoSaveNotification'],
  ['tinymceTheme', 'staff.walkthrough.editWalkthroughPage.tinymceTheme'],
  ['manageWalkthroughDefaultStatus', 'staff.walkthrough.manageWalkthrough.defaultStatus'],
  ['clickableTableLinks', 'staff.walkthrough.manageWalkthrough.clickableTableLinks'],
  ['addMissingButtons', 'staff.walkthrough.manageWalkthrough.addMissingButtons'],
  ['autoSelectFirst', 'staff.walkthrough.manageWalkthrough.autoSelectFirst'],
  ['manageWalkthroughDefaultStatusValue', 'staff.walkthrough.manageWalkthrough.defaultStatusValue'],
  ['stickyPageHistory', 'staff.walkthrough.walkthroughPage.stickyPageHistory'],
  ['moveButtonsToLeft', 'staff.walkthrough.walkthroughPage.moveButtonsToLeft'],
  ['walkthroughTeamButton', 'staff.walkthrough.walkthroughPage.walkthroughTeamButton'],
  ['highlightPageLocked', 'staff.walkthrough.walkthroughPage.highlightPageLocked'],
  ['populateAsideContent', 'staff.walkthrough.walkthroughPreview.populateAsideContent'],
  ['forumImprovementsThreadFilter', 'forum.threadFilter'],
  ['forumImprovementsThreadFilterKeywords', 'forum.threadFilterKeywords'],
  ['showOwnerProgress', 'forum.viewThread.showOwnerProgress'],
  ['myThreadsForumOverride', 'forum.myThreads.overrideForumThreadFilter'],
  ['myThreadsThreadFilter', 'forum.myThreads.threadFilter'],
  ['myThreadsThreadFilterKeywords', 'forum.myThreads.threadFilterKeywords'],
  ['autoSortBy', 'news.sales.autoSortBy'],
  ['autoSortByValue', 'news.sales.autoSortByValue'],
  ['autoSortByOrder', 'news.sales.autoSortByOrder'],
  ['hideOwnedItems', 'news.sales.hideOwnedItems'],
  ['hideUnobtainableItems', 'news.sales.hideUnobtainableItems'],
  ['highlightWishlistItems', 'news.sales.highlightWishlistItems'],
  ['highlightBundlesContainingWishlistItems', 'news.sales.highlightBundlesContainingWishlistItems'],
  ['collapsibleGroups', 'news.sales.collapsibleGroups'],
  ['addHighlightGamesNotInCollectionButton-enabled', 'gamesList.addHighlightGamesNotInCollectionButton'],
  ['gameAchievementsDefaultStatus', 'game.achievements.defaultStatus'],
  ['gameAchievementsDefaultStatusValue', 'game.achievements.defaultStatusValue'],
  ['gameAchievementsIndividualProgress', 'game.achievements.individualProgress'],
  ['gameAchievementsShowXboxAchievementGuides', 'game.extraGuides.showXboxAchievementGuides'],
  ['gameAchievementsShowPlaystationTrophyGuides', 'game.extraGuides.showPlaystationTrophyGuides'],
  ['gameAchievementsShowGamertagNationGuides', 'game.extraGuides.showGamertagNationGuides'],
  ['gameAchievementsCollapsibleGroups', 'game.achievements.collapsibleGroups'],
  ['gameChallengesOverride', 'game.challenges.overrideAchievementsIndividualProgress'],
  ['gameChallengesDefaultStatus', 'game.challenges.defaultStatus'],
  ['gameChallengesDefaultStatusValue', 'game.challenges.defaultStatusValue'],
  ['gameChallengesIndividualProgress', 'game.challenges.individualProgress'],
  ['gameClipsDefaultStatus', 'game.clips.defaultStatus'],
  ['gameClipsDefaultRecordedByValue', 'game.clips.defaultRecordedByValue'],
  ['gameClipsDefaultSavedByValue', 'game.clips.defaultSavedByValue'],
  ['gameClipsDefaultRecordedValue', 'game.clips.defaultRecordedValue'],
  ['gameClipsDefaultSortByValue', 'game.clips.defaultSortByValue'],
  ['gameDLCOverride', 'game.dlc.overrideAchievementsPageSettings'],
  ['gameDLCDefaultStatus', 'game.dlc.defaultStatus'],
  ['gameDLCDefaultStatusValue', 'game.dlc.defaultStatusValue'],
  ['gameDLCIndividualProgress', 'game.dlc.individualProgress'],
  ['gameDLCCollapsibleGroups', 'game.dlc.collapsibleGroups'],
  ['gameForumsForumOverride', 'game.forum.overrideForumThreadFilter'],
  ['gameForumsThreadFilter', 'game.forum.threadFilter'],
  ['gameForumsThreadFilterKeywords', 'game.forum.threadFilterKeywords'],
  ['gameForumsDefaultThread', 'game.forum.defaultThread'],
  ['gameForumsDefaultThreadValue', 'game.forum.defaultThreadValue'],
  ['gameWalkthroughHoverableParagraphs', 'game.walkthrough.hoverableParagraphs'],
  ['addGroupByGameButton-enabled', 'gamer.achievements.addGroupByGameButton']
];

// The keys 2.0.1 and earlier used, each with the key 2.1.1 to 3.1.2 moved it to as they read it, for anyone whose
// storage still holds one
const keysBeforeV3: [from: string, to: string][] = [
  ['trueachievements-extra-stickyHeader-enabled', 'stickyHeader-enabled'],
  ['trueachievements-extra-staffWalkthroughImprovements-tinymceTheme', 'tinymceTheme'],
  ['trueachievements-extra-staffWalkthroughImprovements-editPageLeft', 'moveButtonsToLeft'],
  ['trueachievements-extra-staffWalkthroughImprovements-improvedImageSelector', 'improvedImageSelector'],
  [
    'trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatus',
    'manageWalkthroughDefaultStatus'
  ],
  ['trueachievements-extra-staffWalkthroughImprovements-clickableTableLinks', 'clickableTableLinks'],
  [
    'trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatusValue',
    'manageWalkthroughDefaultStatusValue'
  ],
  ['trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory', 'stickyPageHistory'],
  ['trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton', 'walkthroughTeamButton']
];

const stored = (key: string): boolean => GM_listValues().includes(key);

// Moves each key's value to its new key and deletes the old one. Safe to run again, and alongside another tab running
// it: each key is read as it's moved, so one already moved is skipped rather than written as nothing. With keepNewer,
// a value already under the new key stays (the old key is still deleted)
const moveKeys = (keys: [from: string, to: string][], { keepNewer }: { keepNewer: boolean }): void => {
  keys.forEach(([from, to]) => {
    const value: unknown = GM_getValue(from);

    if (value === undefined) {
      return;
    }

    if (!keepNewer || !stored(to)) {
      GM_setValue(to, value);
    }
    GM_deleteValue(from);
  });
};

export interface Migration {
  version: number;
  note: string;
  run: () => void;
}

export const migrations: Migration[] = [
  {
    version: 1,
    note: 'Delete the keys nothing reads any more (deleted on every page before there were migrations)',
    run: () => {
      [
        // Fetched pages, once one value, then trueachievements-extra-memoized, before they moved to IndexedDB
        'trueachievements-extra-memoized',
        'memoized',
        // The per-visit markers the defaults kept before they checked how the page was arrived at
        'gameAchievementsDefaultStatusPathName',
        'gameDLCDefaultStatusPathName',
        'gameChallengesDefaultStatusPathName',
        'gameClipsDefaultStatusSelectors',
        'gameForumsDefaultThreadPathName',
        // The on/off switch each feature group used to have
        'forumImprovements-enabled',
        'gamerImprovements-enabled',
        'gamesImprovements-enabled',
        'newsImprovements-enabled',
        'staffWalkthroughImprovements-enabled'
      ].forEach((key) => GM_deleteValue(key));
    }
  },
  {
    version: 2,
    note: "A game's guide link saved before a game could have several is a single address: make it a list of one",
    run: () => {
      [
        'gameAchievementsXboxAchievementsGuideUrl',
        'gameAchievementsPlaystationTrophiesGuideUrl',
        'gameAchievementsGamertagNationGuideUrl'
      ].forEach((key) => {
        const entries = readEntries(key, GM_getValue(key, ''));

        if (entries?.some(([, links]) => typeof links === 'string')) {
          GM_setValue(
            key,
            JSON.stringify(entries.map(([game, links]) => [game, typeof links === 'string' ? [links] : links]))
          );
        }
      });
    }
  },
  {
    version: 3,
    note: 'Guide links saved before links were tidied are as typed: tidy them, so they match the guides read from their pages',
    run: () => tidyGuideLinks({ keepQueried: true })
  },
  {
    version: 4,
    note: 'Guide links saved with a query (an XboxAchievements guide page with ?page=) were kept as typed: tidy them too',
    run: () => tidyGuideLinks({ keepQueried: false })
  },
  {
    version: 5,
    note: "The settings' keys become their paths in the settings tree, which follows src/features' folders",
    run: () => {
      // A 2.0.1 key not moved yet goes to its 3.x key first, unless a newer value is there or already moved
      moveKeys(
        keysBeforeV3.filter(([, to]) => {
          const moved = settingKeysBeforeFolders.find(([from]) => from === to)?.[1];
          return !moved || !stored(moved);
        }),
        { keepNewer: true }
      );
      keysBeforeV3.forEach(([from]) => GM_deleteValue(from));
      // The staff on/off switch and Recent Winners' settings, which nothing reads
      [
        'trueachievements-extra-staffWalkthroughImprovements-enabled',
        'trueachievements-extra-recentWinners-enabled',
        'trueachievements-extra-recentWinners-onlineUnlocksOnly',
        'trueachievements-extra-recentWinners-baseGameOnly'
      ].forEach((key) => GM_deleteValue(key));
      moveKeys(settingKeysBeforeFolders, { keepNewer: false });
    }
  },
  {
    version: 6,
    note: "The guide sites' settings move to their own group, Extra Guides, beside the game's achievements",
    run: () =>
      moveKeys(
        [
          ['game.achievements.showXboxAchievementGuides', 'game.extraGuides.showXboxAchievementGuides'],
          ['game.achievements.showPlaystationTrophyGuides', 'game.extraGuides.showPlaystationTrophyGuides'],
          ['game.achievements.showGamertagNationGuides', 'game.extraGuides.showGamertagNationGuides']
        ],
        { keepNewer: false }
      )
  }
];

// Runs each migration not run yet, in order. The settings have read storage by then (the settings tree is built on
// import), so once any ran they read it again, a renamed or converted setting's key included
export const runMigrations = (list: Migration[] = migrations): void => {
  const done = GM_getValue(storageVersionKey, 0) as number;
  let ran = false;

  try {
    list
      .filter(({ version }) => version > done)
      .forEach(({ version, run }) => {
        ran = true;
        run();
        GM_setValue(storageVersionKey, version);
      });
  } finally {
    if (ran) {
      reloadSettings();
    }
  }
};

import { migrations, runMigrations, settingKeysBeforeFolders, storageVersionKey, type Migration } from './migrations';
import { setting } from './setting';
import { settingsList } from './settings-tree';

// Each migration gets old storage in and checks the storage it leaves; runMigrations is checked with stand-in lists
const migration = (version: number): Migration => {
  const found = migrations.find((entry) => entry.version === version);

  if (!found) {
    throw new Error(`no migration ${version}`);
  }

  return found;
};

// Each migration's old storage, as a user could have it, for running it twice. A new migration adds its own
const oldStorage: Record<number, Record<string, Tampermonkey.StorageValue>> = {
  1: { memoized: 'old', gameForumsDefaultThreadPathName: 'old', 'stickyHeader-enabled': 'true' },
  2: {
    gameAchievementsPlaystationTrophiesGuideUrl: JSON.stringify([
      ['Metal-Gear-Solid-HD-Collection', 'https://www.playstationtrophies.org/game/metal-gear-solid-2-hd/guide/'],
      ['Mass-Effect', ['https://www.playstationtrophies.org/game/metal-gear-solid-3-snake-eater-hd/guide/']]
    ])
  },
  3: {
    gameAchievementsXboxAchievementsGuideUrl: JSON.stringify([
      [
        'Mass-Effect',
        [
          'https://xboxachievements.com/game/mass-effect/guide',
          'https://www.xboxachievements.com/game/mass-effect/guide/'
        ]
      ],
      ['BLUD', ['http://www.xboxachievements.com/game/blud/guide?page=']]
    ])
  },
  4: {
    gameAchievementsXboxAchievementsGuideUrl: JSON.stringify([
      [
        'BLUD',
        ['http://www.xboxachievements.com/game/blud/guide?page=', 'https://www.xboxachievements.com/game/blud/guide/']
      ],
      ['Mass-Effect', ['https://xboxachievements.com/game/mass-effect/guide/?page=2#top', 'blud guide']]
    ])
  },
  5: {
    'stickyHeader-enabled': true,
    forumImprovementsThreadFilterKeywords: JSON.stringify(['unobtainables']),
    'trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory': true,
    'trueachievements-extra-stickyHeader-enabled': false,
    'trueachievements-extra-staffWalkthroughImprovements-enabled': true
  },
  6: { 'game.achievements.showXboxAchievementGuides': true, 'game.achievements.showGamertagNationGuides': false }
};

// Migration 5's moves, written out here so a swapped or mistyped pair in the migration fails: each setting's key before
// it, with its key after
const keysBeforeFolders: [from: string, to: string][] = [
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

// The keys 2.0.1 and earlier used, with the key each ends under after migration 5
const keysBefore21: [from: string, to: string][] = [
  ['trueachievements-extra-stickyHeader-enabled', 'allPages.stickyHeader.enabled'],
  [
    'trueachievements-extra-staffWalkthroughImprovements-tinymceTheme',
    'staff.walkthrough.editWalkthroughPage.tinymceTheme'
  ],
  [
    'trueachievements-extra-staffWalkthroughImprovements-editPageLeft',
    'staff.walkthrough.walkthroughPage.moveButtonsToLeft'
  ],
  [
    'trueachievements-extra-staffWalkthroughImprovements-improvedImageSelector',
    'staff.walkthrough.editWalkthroughPage.improvedImageSelector'
  ],
  [
    'trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatus',
    'staff.walkthrough.manageWalkthrough.defaultStatus'
  ],
  [
    'trueachievements-extra-staffWalkthroughImprovements-clickableTableLinks',
    'staff.walkthrough.manageWalkthrough.clickableTableLinks'
  ],
  [
    'trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatusValue',
    'staff.walkthrough.manageWalkthrough.defaultStatusValue'
  ],
  [
    'trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory',
    'staff.walkthrough.walkthroughPage.stickyPageHistory'
  ],
  [
    'trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton',
    'staff.walkthrough.walkthroughPage.walkthroughTeamButton'
  ]
];

// Every stored value, by key
const storage = (): Record<string, unknown> =>
  Object.fromEntries(
    GM_listValues()
      .toSorted()
      .map((key) => [key, GM_getValue(key)])
  );

describe('storage/migrations', () => {
  test('are numbered 1, 2, 3… in order, each with a note', () => {
    expect(migrations.map(({ version }) => version)).toEqual(migrations.map((_, index) => index + 1));
    migrations.forEach(({ note }) => expect(note.length).toBeGreaterThan(0));
  });

  // Tabs starting together can each run the same migration
  test.each(migrations.map(({ version }) => version))(
    'migration %i leaves storage as it was when run again',
    (version) => {
      const old = oldStorage[version];
      expect(old, `migration ${version} has no old storage in this spec`).toBeDefined();
      Object.entries(old).forEach(([key, value]) => GM_setValue(key, value));

      migration(version).run();
      const once = storage();
      migration(version).run();

      expect(storage()).toEqual(once);
    }
  );

  describe('runMigrations', () => {
    const recording = (runs: number[], versions: number[]): Migration[] =>
      versions.map((version) => ({ version, note: `${version}`, run: () => runs.push(version) }));

    test('runs every migration, in order, the first time, and records the last', () => {
      const runs: number[] = [];

      runMigrations(recording(runs, [1, 2, 3]));

      expect(runs).toEqual([1, 2, 3]);
      expect(GM_getValue(storageVersionKey)).toBe(3);
    });

    test('runs only the migrations above the recorded version', () => {
      const runs: number[] = [];
      GM_setValue(storageVersionKey, 2);

      runMigrations(recording(runs, [1, 2, 3, 4]));

      expect(runs).toEqual([3, 4]);
      expect(GM_getValue(storageVersionKey)).toBe(4);
    });

    test('stops at a migration that throws, keeping the version before it, so it runs again next time', () => {
      const runs: number[] = [];
      const list = recording(runs, [1, 2, 3]);
      const second = list[1];
      second.run = () => {
        throw new Error('migration 2 failed');
      };

      expect(() => runMigrations(list)).toThrow('migration 2 failed');

      expect(runs).toEqual([1]);
      expect(GM_getValue(storageVersionKey)).toBe(1);
    });

    // Written straight to localStorage (the mock's Tampermonkey storage), as the settings aren't told of it
    const renamingInto = (key: string): Migration => ({
      version: 1,
      note: 'rename',
      run: () => localStorage.setItem(key, JSON.stringify('moved'))
    });

    test('has the settings read storage again once a migration ran, as they read it before', () => {
      const renamed = setting('ta-x-spec-migrated-setting', 'default', 'string');

      runMigrations([renamingInto(renamed.key)]);

      expect(renamed.peek()).toBe('moved');
    });

    test('leaves the settings as they are when no migration ran', () => {
      const kept = setting('ta-x-spec-migrated-setting', 'default', 'string');
      GM_setValue(storageVersionKey, 1);

      runMigrations([renamingInto(kept.key)]);

      expect(kept.peek()).toBe('default');
    });
  });

  describe('1: deletes the keys nothing reads any more', () => {
    const oldKeys = [
      'trueachievements-extra-memoized',
      'memoized',
      'gameAchievementsDefaultStatusPathName',
      'gameDLCDefaultStatusPathName',
      'gameChallengesDefaultStatusPathName',
      'gameClipsDefaultStatusSelectors',
      'gameForumsDefaultThreadPathName',
      'forumImprovements-enabled',
      'gamerImprovements-enabled',
      'gamesImprovements-enabled',
      'newsImprovements-enabled',
      'staffWalkthroughImprovements-enabled'
    ];

    test('deletes the old fetched pages, the per-visit markers and the groups’ on/off switches, and nothing else', () => {
      oldKeys.forEach((key) => GM_setValue(key, 'old'));
      GM_setValue('stickyHeader-enabled', true);

      migration(1).run();

      expect(GM_listValues()).toEqual(['stickyHeader-enabled']);
    });
  });

  describe("2: makes a game's single guide link a list of one", () => {
    const key = 'gameAchievementsPlaystationTrophiesGuideUrl';
    const mgs2 = 'https://www.playstationtrophies.org/game/metal-gear-solid-2-hd/guide/';
    const mgs3 = 'https://www.playstationtrophies.org/game/metal-gear-solid-3-snake-eater-hd/guide/';

    test.each([
      'gameAchievementsXboxAchievementsGuideUrl',
      'gameAchievementsPlaystationTrophiesGuideUrl',
      'gameAchievementsGamertagNationGuideUrl'
    ])('converts %s, keeping games already saved as lists', (site) => {
      GM_setValue(
        site,
        JSON.stringify([
          ['Metal-Gear-Solid-HD-Collection', mgs2],
          ['Mass-Effect', [mgs2, mgs3]]
        ])
      );

      migration(2).run();

      expect(JSON.parse(GM_getValue(site, '') as string)).toEqual([
        ['Metal-Gear-Solid-HD-Collection', [mgs2]],
        ['Mass-Effect', [mgs2, mgs3]]
      ]);
    });

    test("leaves a site's links alone when they're all lists already, and adds nothing for a site with none", () => {
      const saved = JSON.stringify([['Mass-Effect', [mgs2]]]);
      GM_setValue(key, saved);
      const setValue = vi.spyOn(globalThis, 'GM_setValue');

      migration(2).run();

      expect(setValue).not.toHaveBeenCalled();
      expect(GM_listValues()).toEqual([key]);
      expect(GM_getValue(key)).toBe(saved);
    });
  });

  describe('3: tidies guide links saved as typed', () => {
    const key = 'gameAchievementsXboxAchievementsGuideUrl';
    const massEffect = 'https://www.xboxachievements.com/game/mass-effect/guide/';
    const blud = 'https://www.xboxachievements.com/game/blud/guide/';

    test.each([
      'gameAchievementsXboxAchievementsGuideUrl',
      'gameAchievementsPlaystationTrophiesGuideUrl',
      'gameAchievementsGamertagNationGuideUrl'
    ])("tidies %s, and drops a game's link that was there twice in two spellings", (site) => {
      GM_setValue(
        site,
        JSON.stringify([
          ['Mass-Effect', ['https://xboxachievements.com/game/mass-effect/guide', massEffect]],
          ['BLUD', ['http://www.xboxachievements.com/game/blud/guide?page=']]
        ])
      );

      migration(3).run();

      expect(JSON.parse(GM_getValue(site, '') as string)).toEqual([
        ['Mass-Effect', [massEffect]],
        ['BLUD', ['http://www.xboxachievements.com/game/blud/guide?page=']]
      ]);
    });

    test('keeps a link with a query, and leaves tidy links alone', () => {
      const queried = 'https://www.xboxachievements.com/game/blud/guide?page=2';
      const saved = JSON.stringify([
        ['Mass-Effect', [massEffect]],
        ['BLUD', [blud, queried]]
      ]);
      GM_setValue(key, saved);
      const setValue = vi.spyOn(globalThis, 'GM_setValue');

      migration(3).run();

      expect(setValue).not.toHaveBeenCalled();
      expect(GM_getValue(key)).toBe(saved);
    });
  });

  describe('4: tidies guide links saved with a query', () => {
    const key = 'gameAchievementsXboxAchievementsGuideUrl';
    const blud = 'https://www.xboxachievements.com/game/blud/guide/';

    test.each([
      'gameAchievementsXboxAchievementsGuideUrl',
      'gameAchievementsPlaystationTrophiesGuideUrl',
      'gameAchievementsGamertagNationGuideUrl'
    ])("tidies %s's queried links, and drops one the game already has tidy", (site) => {
      GM_setValue(
        site,
        JSON.stringify([
          ['BLUD', ['http://www.xboxachievements.com/game/blud/guide?page=', blud]],
          ['Mass-Effect', ['https://xboxachievements.com/game/mass-effect/guide/?page=2#top']]
        ])
      );

      migration(4).run();

      expect(JSON.parse(GM_getValue(site, '') as string)).toEqual([
        ['BLUD', [blud]],
        ['Mass-Effect', ['https://www.xboxachievements.com/game/mass-effect/guide/']]
      ]);
    });

    // Several tabs opening at once can each run it
    test('leaves storage as it is when run again, and keeps a link that is not an address', () => {
      GM_setValue(
        key,
        JSON.stringify([['BLUD', ['blud guide', 'https://www.xboxachievements.com/game/blud/guide?x=1']]])
      );

      migration(4).run();
      const once = GM_getValue(key);
      const setValue = vi.spyOn(globalThis, 'GM_setValue');
      migration(4).run();

      expect(setValue).not.toHaveBeenCalled();
      expect(JSON.parse(once as string)).toEqual([['BLUD', ['blud guide', blud]]]);
    });
  });

  describe("5: moves the settings' keys to their paths in the settings tree", () => {
    test('moves every setting the tree has, and only those', () => {
      expect(settingKeysBeforeFolders.map(([, to]) => to).toSorted()).toEqual(
        settingsList()
          .map(({ setting: { key } }) => key)
          .toSorted()
      );
    });

    test('moves every setting to its own new key, each keeping its own value', () => {
      keysBeforeFolders.forEach(([from]) => GM_setValue(from, from));

      migration(5).run();

      expect(storage()).toEqual(Object.fromEntries(keysBeforeFolders.map(([from, to]) => [to, from])));
    });

    test.each(keysBefore21)('moves %s, a 2.0.1 key, to %s', (from, to) => {
      GM_setValue(from, from);

      migration(5).run();

      expect(storage()).toEqual({ [to]: from });
    });

    test('moves each value to its new key as it was stored, and deletes the old key', () => {
      GM_setValue('stickyHeader-enabled', true);
      GM_setValue('forumImprovementsThreadFilterKeywords', JSON.stringify(['unobtainables']));
      GM_setValue('manageWalkthroughDefaultStatusValue', 'Published');
      GM_setValue('tinymceTheme', null);
      GM_setValue('gameAchievementsXboxAchievementsGuideUrl', '[]');

      migration(5).run();

      expect(storage()).toEqual({
        'allPages.stickyHeader.enabled': true,
        'forum.threadFilterKeywords': JSON.stringify(['unobtainables']),
        gameAchievementsXboxAchievementsGuideUrl: '[]',
        'staff.walkthrough.editWalkthroughPage.tinymceTheme': null,
        'staff.walkthrough.manageWalkthrough.defaultStatusValue': 'Published'
      });
    });

    test('moves a 2.0.1 key to its new key, and deletes the 2.0.1 keys nothing reads', () => {
      GM_setValue('trueachievements-extra-staffWalkthroughImprovements-editPageLeft', true);
      GM_setValue('trueachievements-extra-staffWalkthroughImprovements-enabled', true);
      GM_setValue('trueachievements-extra-recentWinners-enabled', true);
      GM_setValue('trueachievements-extra-recentWinners-onlineUnlocksOnly', false);
      GM_setValue('trueachievements-extra-recentWinners-baseGameOnly', true);

      migration(5).run();

      expect(storage()).toEqual({ 'staff.walkthrough.walkthroughPage.moveButtonsToLeft': true });
    });

    test.each([
      { newer: 'its v3 key', stored: { 'stickyHeader-enabled': true } },
      { newer: 'its new key', stored: { 'allPages.stickyHeader.enabled': true } }
    ])('keeps the value under $newer over a 2.0.1 key', ({ stored }) => {
      GM_setValue('trueachievements-extra-stickyHeader-enabled', false);
      Object.entries(stored).forEach(([key, value]) => GM_setValue(key, value));

      migration(5).run();

      expect(storage()).toEqual({ 'allPages.stickyHeader.enabled': true });
    });
  });

  describe("6: moves the guide sites' settings to Extra Guides", () => {
    test('moves each to its new key with its value, and leaves the others alone', () => {
      // Each its own value, so a swapped pair fails
      GM_setValue('game.achievements.showXboxAchievementGuides', 'xbox');
      GM_setValue('game.achievements.showPlaystationTrophyGuides', 'playstation');
      GM_setValue('game.achievements.showGamertagNationGuides', 'gamertag nation');
      GM_setValue('game.achievements.individualProgress', true);

      migration(6).run();

      expect(storage()).toEqual({
        'game.achievements.individualProgress': true,
        'game.extraGuides.showGamertagNationGuides': 'gamertag nation',
        'game.extraGuides.showPlaystationTrophyGuides': 'playstation',
        'game.extraGuides.showXboxAchievementGuides': 'xbox'
      });
    });
  });
});

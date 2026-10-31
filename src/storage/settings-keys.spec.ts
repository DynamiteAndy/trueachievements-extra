import { settingsList } from './settings-tree';

// Every setting's path, which is its storage key, with its default and type. Users' settings live under these keys: a
// renamed or moved setting, or a changed default, loses them, so this list only changes with a migration.
const expected: [path: string, defaultValue: unknown, type: 'boolean' | 'string' | 'list' | 'nullable'][] = [
  ['allPages.stickyHeader.enabled', false, 'boolean'],
  ['allPages.stickyHeader.remainStuck', false, 'boolean'],
  ['allPages.stickyHeader.fitMenus', false, 'boolean'],
  ['allPages.emojis', false, 'boolean'],
  ['allPages.giveawayAutoOptIn', false, 'boolean'],
  ['staff.walkthrough.editWalkthroughPage.improvedImageSelector', false, 'boolean'],
  ['staff.walkthrough.editWalkthroughPage.autoSaveNotification', false, 'boolean'],
  ['staff.walkthrough.editWalkthroughPage.tinymceTheme', null, 'nullable'],
  ['staff.walkthrough.manageWalkthrough.defaultStatus', false, 'boolean'],
  ['staff.walkthrough.manageWalkthrough.clickableTableLinks', false, 'boolean'],
  ['staff.walkthrough.manageWalkthrough.addMissingButtons', false, 'boolean'],
  ['staff.walkthrough.manageWalkthrough.autoSelectFirst', false, 'boolean'],
  ['staff.walkthrough.manageWalkthrough.defaultStatusValue', '-1', 'string'],
  ['staff.walkthrough.walkthroughPage.stickyPageHistory', false, 'boolean'],
  ['staff.walkthrough.walkthroughPage.moveButtonsToLeft', false, 'boolean'],
  ['staff.walkthrough.walkthroughPage.walkthroughTeamButton', false, 'boolean'],
  ['staff.walkthrough.walkthroughPage.highlightPageLocked', false, 'boolean'],
  ['staff.walkthrough.walkthroughPreview.populateAsideContent', false, 'boolean'],
  ['forum.threadFilter', false, 'boolean'],
  ['forum.threadFilterKeywords', [], 'list'],
  ['forum.viewThread.showOwnerProgress', false, 'boolean'],
  ['forum.myThreads.overrideForumThreadFilter', false, 'boolean'],
  ['forum.myThreads.threadFilter', false, 'boolean'],
  ['forum.myThreads.threadFilterKeywords', [], 'list'],
  ['news.sales.autoSortBy', false, 'boolean'],
  ['news.sales.autoSortByValue', ['product', 'game'], 'list'],
  ['news.sales.autoSortByOrder', 'asc', 'string'],
  ['news.sales.hideOwnedItems', false, 'boolean'],
  ['news.sales.hideUnobtainableItems', false, 'boolean'],
  ['news.sales.highlightWishlistItems', false, 'boolean'],
  ['news.sales.highlightBundlesContainingWishlistItems', false, 'boolean'],
  ['news.sales.collapsibleGroups', false, 'boolean'],
  ['gamesList.addHighlightGamesNotInCollectionButton', false, 'boolean'],
  ['game.achievements.defaultStatus', false, 'boolean'],
  ['game.achievements.defaultStatusValue', 'rdoAllAchievements', 'string'],
  ['game.achievements.individualProgress', false, 'boolean'],
  ['game.achievements.collapsibleGroups', false, 'boolean'],
  ['game.extraGuides.showXboxAchievementGuides', false, 'boolean'],
  ['game.extraGuides.showPlaystationTrophyGuides', false, 'boolean'],
  ['game.extraGuides.showGamertagNationGuides', false, 'boolean'],
  ['game.challenges.overrideAchievementsIndividualProgress', false, 'boolean'],
  ['game.challenges.defaultStatus', false, 'boolean'],
  ['game.challenges.defaultStatusValue', 'rdoAllChallenges', 'string'],
  ['game.challenges.individualProgress', false, 'boolean'],
  ['game.clips.defaultStatus', false, 'boolean'],
  ['game.clips.defaultRecordedByValue', '', 'string'],
  ['game.clips.defaultSavedByValue', 'Gamer', 'string'],
  ['game.clips.defaultRecordedValue', '7', 'string'],
  ['game.clips.defaultSortByValue', 'Most viewed', 'string'],
  ['game.dlc.overrideAchievementsPageSettings', false, 'boolean'],
  ['game.dlc.defaultStatus', false, 'boolean'],
  ['game.dlc.defaultStatusValue', 'rdoAllAchievements', 'string'],
  ['game.dlc.individualProgress', false, 'boolean'],
  ['game.dlc.collapsibleGroups', false, 'boolean'],
  ['game.forum.overrideForumThreadFilter', false, 'boolean'],
  ['game.forum.threadFilter', false, 'boolean'],
  ['game.forum.threadFilterKeywords', [], 'list'],
  ['game.forum.defaultThread', false, 'boolean'],
  ['game.forum.defaultThreadValue', 'all', 'string'],
  ['game.walkthrough.hoverableParagraphs', false, 'boolean'],
  ['gamer.achievements.addGroupByGameButton', false, 'boolean']
];

describe('storage/settings-tree: storage keys', () => {
  test("has exactly the keys users' settings are stored under, with their defaults and types", () => {
    expect(settingsList().map(({ path, setting }) => [path, setting.defaultValue, setting.storedAs])).toEqual(expected);
  });

  test('stores each setting under its path in the tree', () => {
    settingsList().forEach(({ path, setting }) => expect(setting.key, path).toBe(path));
  });
});

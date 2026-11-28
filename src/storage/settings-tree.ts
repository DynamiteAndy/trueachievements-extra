import { setting, type Setting } from './setting';

// Every user setting, as a persisted signal, shaped like src/features' folders. Each setting's storage key is its path
// here, and never changes without a migration: settings-keys.spec.ts holds the full list
export const settings = {
  allPages: {
    stickyHeader: {
      enabled: setting('allPages.stickyHeader.enabled', false, 'boolean'),
      remainStuck: setting('allPages.stickyHeader.remainStuck', false, 'boolean'),
      fitMenus: setting('allPages.stickyHeader.fitMenus', false, 'boolean')
    },
    emojis: setting('allPages.emojis', false, 'boolean'),
    giveawayAutoOptIn: setting('allPages.giveawayAutoOptIn', false, 'boolean')
  },
  staff: {
    walkthrough: {
      editWalkthroughPage: {
        improvedImageSelector: setting('staff.walkthrough.editWalkthroughPage.improvedImageSelector', false, 'boolean'),
        autoSaveNotification: setting('staff.walkthrough.editWalkthroughPage.autoSaveNotification', false, 'boolean'),
        tinymceTheme: setting('staff.walkthrough.editWalkthroughPage.tinymceTheme', null, 'nullable')
      },
      manageWalkthrough: {
        defaultStatus: setting('staff.walkthrough.manageWalkthrough.defaultStatus', false, 'boolean'),
        clickableTableLinks: setting('staff.walkthrough.manageWalkthrough.clickableTableLinks', false, 'boolean'),
        addMissingButtons: setting('staff.walkthrough.manageWalkthrough.addMissingButtons', false, 'boolean'),
        autoSelectFirst: setting('staff.walkthrough.manageWalkthrough.autoSelectFirst', false, 'boolean'),
        defaultStatusValue: setting('staff.walkthrough.manageWalkthrough.defaultStatusValue', '-1', 'string')
      },
      walkthroughPage: {
        stickyPageHistory: setting('staff.walkthrough.walkthroughPage.stickyPageHistory', false, 'boolean'),
        moveButtonsToLeft: setting('staff.walkthrough.walkthroughPage.moveButtonsToLeft', false, 'boolean'),
        walkthroughTeamButton: setting('staff.walkthrough.walkthroughPage.walkthroughTeamButton', false, 'boolean'),
        highlightPageLocked: setting('staff.walkthrough.walkthroughPage.highlightPageLocked', false, 'boolean')
      },
      walkthroughPreview: {
        populateAsideContent: setting('staff.walkthrough.walkthroughPreview.populateAsideContent', false, 'boolean')
      }
    }
  },
  forum: {
    threadFilter: setting('forum.threadFilter', false, 'boolean'),
    threadFilterKeywords: setting('forum.threadFilterKeywords', [], 'list'),
    viewThread: {
      showOwnerProgress: setting('forum.viewThread.showOwnerProgress', false, 'boolean')
    },
    myThreads: {
      overrideForumThreadFilter: setting('forum.myThreads.overrideForumThreadFilter', false, 'boolean'),
      threadFilter: setting('forum.myThreads.threadFilter', false, 'boolean'),
      threadFilterKeywords: setting('forum.myThreads.threadFilterKeywords', [], 'list')
    }
  },
  news: {
    sales: {
      autoSortBy: setting('news.sales.autoSortBy', false, 'boolean'),
      autoSortByValue: setting('news.sales.autoSortByValue', ['product', 'game'], 'list'),
      autoSortByOrder: setting('news.sales.autoSortByOrder', 'asc', 'string'),
      hideOwnedItems: setting('news.sales.hideOwnedItems', false, 'boolean'),
      hideUnobtainableItems: setting('news.sales.hideUnobtainableItems', false, 'boolean'),
      highlightWishlistItems: setting('news.sales.highlightWishlistItems', false, 'boolean'),
      highlightBundlesContainingWishlistItems: setting(
        'news.sales.highlightBundlesContainingWishlistItems',
        false,
        'boolean'
      ),
      collapsibleGroups: setting('news.sales.collapsibleGroups', false, 'boolean')
    }
  },
  gamesList: {
    addHighlightGamesNotInCollectionButton: setting(
      'gamesList.addHighlightGamesNotInCollectionButton',
      false,
      'boolean'
    )
  },
  game: {
    achievements: {
      defaultStatus: setting('game.achievements.defaultStatus', false, 'boolean'),
      defaultStatusValue: setting('game.achievements.defaultStatusValue', 'rdoAllAchievements', 'string'),
      individualProgress: setting('game.achievements.individualProgress', false, 'boolean'),
      collapsibleGroups: setting('game.achievements.collapsibleGroups', false, 'boolean')
    },
    extraGuides: {
      showXboxAchievementGuides: setting('game.extraGuides.showXboxAchievementGuides', false, 'boolean'),
      showPlaystationTrophyGuides: setting('game.extraGuides.showPlaystationTrophyGuides', false, 'boolean'),
      showGamertagNationGuides: setting('game.extraGuides.showGamertagNationGuides', false, 'boolean')
    },
    challenges: {
      overrideAchievementsIndividualProgress: setting(
        'game.challenges.overrideAchievementsIndividualProgress',
        false,
        'boolean'
      ),
      defaultStatus: setting('game.challenges.defaultStatus', false, 'boolean'),
      defaultStatusValue: setting('game.challenges.defaultStatusValue', 'rdoAllChallenges', 'string'),
      individualProgress: setting('game.challenges.individualProgress', false, 'boolean')
    },
    clips: {
      defaultStatus: setting('game.clips.defaultStatus', false, 'boolean'),
      defaultRecordedByValue: setting('game.clips.defaultRecordedByValue', '', 'string'),
      defaultSavedByValue: setting('game.clips.defaultSavedByValue', 'Gamer', 'string'),
      defaultRecordedValue: setting('game.clips.defaultRecordedValue', '7', 'string'),
      defaultSortByValue: setting('game.clips.defaultSortByValue', 'Most viewed', 'string')
    },
    dlc: {
      // On: DLC uses its own default status (and which), individual progress and collapsible groups below, not the game
      // achievements page's (effective-settings.ts)
      overrideAchievementsPageSettings: setting('game.dlc.overrideAchievementsPageSettings', false, 'boolean'),
      defaultStatus: setting('game.dlc.defaultStatus', false, 'boolean'),
      defaultStatusValue: setting('game.dlc.defaultStatusValue', 'rdoAllAchievements', 'string'),
      individualProgress: setting('game.dlc.individualProgress', false, 'boolean'),
      collapsibleGroups: setting('game.dlc.collapsibleGroups', false, 'boolean')
    },
    forum: {
      overrideForumThreadFilter: setting('game.forum.overrideForumThreadFilter', false, 'boolean'),
      threadFilter: setting('game.forum.threadFilter', false, 'boolean'),
      threadFilterKeywords: setting('game.forum.threadFilterKeywords', [], 'list'),
      defaultThread: setting('game.forum.defaultThread', false, 'boolean'),
      defaultThreadValue: setting('game.forum.defaultThreadValue', 'all', 'string')
    },
    walkthrough: {
      hoverableParagraphs: setting('game.walkthrough.hoverableParagraphs', false, 'boolean')
    }
  },
  gamer: {
    achievements: {
      addGroupByGameButton: setting('gamer.achievements.addGroupByGameButton', false, 'boolean')
    }
  }
};

type SettingsTree = { [name: string]: Setting | SettingsTree };

const isSetting = (node: Setting | SettingsTree): node is Setting => 'key' in node && 'storedAs' in node;

// Every setting with its dotted path (e.g. 'news.sales.autoSortBy'), in the tree's order
export const settingsList = (tree: SettingsTree = settings, prefix = ''): { path: string; setting: Setting }[] =>
  Object.entries(tree).flatMap(([name, node]) => {
    const path = prefix ? `${prefix}.${name}` : name;
    return isSetting(node) ? [{ path, setting: node }] : settingsList(node, path);
  });

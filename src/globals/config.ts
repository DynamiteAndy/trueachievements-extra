const migrateGet = <T>(oldSetting: string, newSetting: string, defaultValue: T): T => {
  const newValue = GM_getValue(newSetting);

  if (newValue !== undefined) {
    return newValue as T;
  }

  const oldValue = GM_getValue(oldSetting, defaultValue);
  GM_setValue(newSetting, oldValue);
  GM_deleteValue(oldSetting);

  return oldValue;
};

const arrayGet = <T>(setting: string, defaultValue: T[]): T[] => {
  const value = GM_getValue(setting, '') as string;
  return value.length !== 0 ? JSON.parse(value) : defaultValue;
};

export const stickyHeader = {
  get enabled(): boolean {
    return migrateGet('trueachievements-extra-stickyHeader-enabled', 'stickyHeader-enabled', false);
  },
  set enabled(value: boolean) {
    GM_setValue('stickyHeader-enabled', value);
  },
  get remainStuck(): boolean {
    return GM_getValue('stickyHeader-remainStuck', false);
  },
  set remainStuck(value: boolean) {
    GM_setValue('stickyHeader-remainStuck', value);
  }
};

export const emojis = {
  get enabled(): boolean {
    return GM_getValue('emojis-enabled', false);
  },
  set enabled(value: boolean) {
    GM_setValue('emojis-enabled', value);
  }
};

export const editWalkthrough = {
  get improvedImageSelector(): boolean {
    return migrateGet(
      'trueachievements-extra-staffWalkthroughImprovements-improvedImageSelector',
      'improvedImageSelector',
      false
    );
  },
  set improvedImageSelector(value: boolean) {
    GM_setValue('improvedImageSelector', value);
  },
  get autoSaveNotification(): boolean {
    return GM_getValue('autoSaveNotification', false);
  },
  set autoSaveNotification(value: boolean) {
    GM_setValue('autoSaveNotification', value);
  },
  get tinymceTheme(): string {
    return migrateGet('trueachievements-extra-staffWalkthroughImprovements-tinymceTheme', 'tinymceTheme', null);
  },
  set tinymceTheme(value: string) {
    GM_setValue('tinymceTheme', value);
  }
};

export const manageWalkthrough = {
  get manageWalkthroughDefaultStatus(): boolean {
    return migrateGet(
      'trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatus',
      'manageWalkthroughDefaultStatus',
      false
    );
  },
  set manageWalkthroughDefaultStatus(value: boolean) {
    GM_setValue('manageWalkthroughDefaultStatus', value);
  },
  get clickableTableLinks(): boolean {
    return migrateGet(
      'trueachievements-extra-staffWalkthroughImprovements-clickableTableLinks',
      'clickableTableLinks',
      false
    );
  },
  set clickableTableLinks(value: boolean) {
    GM_setValue('clickableTableLinks', value);
  },
  get addMissingButtons(): boolean {
    return GM_getValue('addMissingButtons', false);
  },
  set addMissingButtons(value: boolean) {
    GM_setValue('addMissingButtons', value);
  },
  get autoSelectFirst(): boolean {
    return GM_getValue('autoSelectFirst', false);
  },
  set autoSelectFirst(value: boolean) {
    GM_setValue('autoSelectFirst', value);
  },
  get manageWalkthroughDefaultStatusValue(): string {
    return migrateGet(
      'trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatusValue',
      'manageWalkthroughDefaultStatusValue',
      '-1'
    );
  },
  set manageWalkthroughDefaultStatusValue(value: string) {
    GM_setValue('manageWalkthroughDefaultStatusValue', value);
  }
};

export const walkthroughPage = {
  get stickyPageHistory(): boolean {
    return migrateGet(
      'trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory',
      'stickyPageHistory',
      false
    );
  },
  set stickyPageHistory(value: boolean) {
    GM_setValue('stickyPageHistory', value);
  },
  get moveButtonsToLeft(): boolean {
    return migrateGet('trueachievements-extra-staffWalkthroughImprovements-editPageLeft', 'moveButtonsToLeft', false);
  },
  set moveButtonsToLeft(value: boolean) {
    GM_setValue('moveButtonsToLeft', value);
  },
  get walkthroughTeamButton(): boolean {
    return migrateGet(
      'trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton',
      'walkthroughTeamButton',
      false
    );
  },
  set walkthroughTeamButton(value: boolean) {
    GM_setValue('walkthroughTeamButton', value);
  },
  get highlightPageLocked(): boolean {
    return GM_getValue('highlightPageLocked', false);
  },
  set highlightPageLocked(value: boolean) {
    GM_setValue('highlightPageLocked', value);
  }
};

export const walkthroughPreview = {
  get populateAsideContent(): boolean {
    return GM_getValue('populateAsideContent', false);
  },
  set populateAsideContent(value: boolean) {
    GM_setValue('populateAsideContent', value);
  }
};

export const staffWalkthroughImprovements = {
  get enabled(): boolean {
    return migrateGet(
      'trueachievements-extra-staffWalkthroughImprovements-enabled',
      'staffWalkthroughImprovements-enabled',
      false
    );
  },
  set enabled(value: boolean) {
    GM_setValue('staffWalkthroughImprovements-enabled', value);
  },
  editWalkthrough,
  manageWalkthrough,
  walkthroughPage,
  walkthroughPreview
};

export const myThreads = {
  get myThreadsForumOverride(): boolean {
    return GM_getValue('myThreadsForumOverride', false);
  },
  set myThreadsForumOverride(value: boolean) {
    GM_setValue('myThreadsForumOverride', value);
  },
  get myThreadsThreadFilter(): boolean {
    return myThreads.myThreadsForumOverride
      ? GM_getValue('myThreadsThreadFilter', false)
      : forumImprovements.forumImprovementsThreadFilter;
  },
  set myThreadsThreadFilter(value: boolean) {
    myThreads.myThreadsForumOverride ? GM_setValue('myThreadsThreadFilter', value) : null;
  },
  get threadFilterKeywords(): string[] {
    return myThreads.myThreadsForumOverride
      ? arrayGet<string>('myThreadsThreadFilterKeywords', [])
      : forumImprovements.threadFilterKeywords;
  },
  set threadFilterKeywords(value: string[]) {
    myThreads.myThreadsForumOverride ? GM_setValue('myThreadsThreadFilterKeywords', JSON.stringify(value)) : null;
  }
};

export const walkthroughsForum = {
  get showOwnerProgress(): boolean {
    return GM_getValue('showOwnerProgress', false);
  },
  set showOwnerProgress(value: boolean) {
    GM_setValue('showOwnerProgress', value);
  }
};

export const forumImprovements = {
  get enabled(): boolean {
    return GM_getValue('forumImprovements-enabled', false);
  },
  set enabled(value: boolean) {
    GM_setValue('forumImprovements-enabled', value);
  },
  get forumImprovementsThreadFilter(): boolean {
    return GM_getValue('forumImprovementsThreadFilter', false);
  },
  set forumImprovementsThreadFilter(value: boolean) {
    GM_setValue('forumImprovementsThreadFilter', value);
  },
  get threadFilterKeywords(): string[] {
    return arrayGet<string>('forumImprovementsThreadFilterKeywords', []);
  },
  set threadFilterKeywords(value: string[]) {
    GM_setValue('forumImprovementsThreadFilterKeywords', JSON.stringify(value));
  },
  walkthroughs: walkthroughsForum,
  myThreads
};

export const sales = {
  get autoSortBy(): boolean {
    return GM_getValue('autoSortBy', false);
  },
  set autoSortBy(value: boolean) {
    GM_setValue('autoSortBy', value);
  },
  get autoSortByValue(): string[] {
    return arrayGet<string>('autoSortByValue', ['product', 'game']);
  },
  set autoSortByValue(value: string[]) {
    GM_setValue('autoSortByValue', JSON.stringify(value));
  },
  get autoSortByOrder(): string {
    return GM_getValue('autoSortByOrder', 'asc');
  },
  set autoSortByOrder(value: string) {
    GM_setValue('autoSortByOrder', value);
  }
};

export const newsImprovements = {
  get enabled(): boolean {
    return GM_getValue('newsImprovements-enabled', false);
  },
  set enabled(value: boolean) {
    GM_setValue('newsImprovements-enabled', value);
  },
  sales
};

export const games = {
  get addHighlightGamesNotInCollectionButton(): boolean {
    return GM_getValue('addHighlightGamesNotInCollectionButton-enabled', false);
  },
  set addHighlightGamesNotInCollectionButton(value: boolean) {
    GM_setValue('addHighlightGamesNotInCollectionButton-enabled', value);
  }
};

export const gameAchievements = {
  get gameAchievementsDefaultStatus(): boolean {
    return GM_getValue('gameAchievementsDefaultStatus', false);
  },
  set gameAchievementsDefaultStatus(value: boolean) {
    GM_setValue('gameAchievementsDefaultStatus', value);
  },
  get gameAchievementsDefaultStatusValue(): string {
    return GM_getValue('gameAchievementsDefaultStatusValue', 'rdoAllAchievements');
  },
  set gameAchievementsDefaultStatusValue(value: string) {
    GM_setValue('gameAchievementsDefaultStatusValue', value);
  },
  get gameAchievementsIndividualProgress(): boolean {
    return GM_getValue('gameAchievementsIndividualProgress', false);
  },
  set gameAchievementsIndividualProgress(value: boolean) {
    GM_setValue('gameAchievementsIndividualProgress', value);
  },
  get gameAchievementsShowXboxAchievementGuides(): boolean {
    return GM_getValue('gameAchievementsShowXboxAchievementGuides', false);
  },
  set gameAchievementsShowXboxAchievementGuides(value: boolean) {
    GM_setValue('gameAchievementsShowXboxAchievementGuides', value);
  }
};

export const gameClips = {
  get gameClipsDefaultStatus(): boolean {
    return GM_getValue('gameClipsDefaultStatus', false);
  },
  set gameClipsDefaultStatus(value: boolean) {
    GM_setValue('gameClipsDefaultStatus', value);
  },
  get gameClipsDefaultRecordedByValue(): string {
    return GM_getValue('gameClipsDefaultRecordedByValue', '');
  },
  set gameClipsDefaultRecordedByValue(value: string) {
    GM_setValue('gameClipsDefaultRecordedByValue', value);
  },
  get gameClipsDefaultSavedByValue(): string {
    return GM_getValue('gameClipsDefaultSavedByValue', 'Gamer');
  },
  set gameClipsDefaultSavedByValue(value: string) {
    GM_setValue('gameClipsDefaultSavedByValue', value);
  },
  get gameClipsDefaultRecordedValue(): string {
    return GM_getValue('gameClipsDefaultRecordedValue', '7');
  },
  set gameClipsDefaultRecordedValue(value: string) {
    GM_setValue('gameClipsDefaultRecordedValue', value);
  },
  get gameClipsDefaultSortByValue(): string {
    return GM_getValue('gameClipsDefaultSortByValue', 'Most viewed');
  },
  set gameClipsDefaultSortByValue(value: string) {
    GM_setValue('gameClipsDefaultSortByValue', value);
  }
};

export const gameDLC = {
  get gameDLCOverride(): boolean {
    return GM_getValue('gameDLCOverride', false);
  },
  set gameDLCOverride(value: boolean) {
    GM_setValue('gameDLCOverride', value);
  },
  get gameDLCDefaultStatus(): boolean {
    return gameDLC.gameDLCOverride
      ? GM_getValue('gameDLCDefaultStatus', false)
      : gameAchievements.gameAchievementsDefaultStatus;
  },
  set gameDLCDefaultStatus(value: boolean) {
    gameDLC.gameDLCOverride ? GM_setValue('gameDLCDefaultStatus', value) : null;
  },
  get gameDLCDefaultStatusValue(): string {
    return gameDLC.gameDLCOverride
      ? GM_getValue('gameDLCDefaultStatusValue', 'rdoAllAchievements')
      : gameAchievements.gameAchievementsDefaultStatusValue;
  },
  set gameDLCDefaultStatusValue(value: string) {
    gameDLC.gameDLCOverride ? GM_setValue('gameDLCDefaultStatusValue', value) : null;
  },
  get gameDLCIndividualProgress(): boolean {
    return gameDLC.gameDLCOverride
      ? GM_getValue('gameDLCIndividualProgress', false)
      : gameAchievements.gameAchievementsIndividualProgress;
  },
  set gameDLCIndividualProgress(value: boolean) {
    gameDLC.gameDLCOverride ? GM_setValue('gameDLCIndividualProgress', value) : null;
  }
};

export const gameChallenges = {
  get gameChallengesOverride(): boolean {
    return GM_getValue('gameChallengesOverride', false);
  },
  set gameChallengesOverride(value: boolean) {
    GM_setValue('gameChallengesOverride', value);
  },
  get gameChallengesDefaultStatus(): boolean {
    return GM_getValue('gameChallengesDefaultStatus', false);
  },
  set gameChallengesDefaultStatus(value: boolean) {
    GM_setValue('gameChallengesDefaultStatus', value);
  },
  get gameChallengesDefaultStatusValue(): string {
    return GM_getValue('gameChallengesDefaultStatusValue', 'rdoAllChallenges');
  },
  set gameChallengesDefaultStatusValue(value: string) {
    GM_setValue('gameChallengesDefaultStatusValue', value);
  },
  get gameChallengesIndividualProgress(): boolean {
    return gameChallenges.gameChallengesOverride
      ? GM_getValue('gameChallengesIndividualProgress', false)
      : gameAchievements.gameAchievementsIndividualProgress;
  },
  set gameChallengesIndividualProgress(value: boolean) {
    gameChallenges.gameChallengesOverride ? GM_setValue('gameChallengesIndividualProgress', value) : null;
  }
};

export const gameForums = {
  get gameForumsForumOverride(): boolean {
    return GM_getValue('gameForumsForumOverride', false);
  },
  set gameForumsForumOverride(value: boolean) {
    GM_setValue('gameForumsForumOverride', value);
  },
  get gameForumsThreadFilter(): boolean {
    return gameForums.gameForumsForumOverride
      ? GM_getValue('gameForumsThreadFilter', false)
      : forumImprovements.forumImprovementsThreadFilter;
  },
  set gameForumsThreadFilter(value: boolean) {
    gameForums.gameForumsForumOverride ? GM_setValue('gameForumsThreadFilter', value) : null;
  },
  get threadFilterKeywords(): string[] {
    return gameForums.gameForumsForumOverride
      ? arrayGet<string>('gameForumsThreadFilterKeywords', [])
      : forumImprovements.threadFilterKeywords;
  },
  set threadFilterKeywords(value: string[]) {
    gameForums.gameForumsForumOverride ? GM_setValue('gameForumsThreadFilterKeywords', JSON.stringify(value)) : null;
  },
  get gameForumsDefaultThread(): boolean {
    return GM_getValue('gameForumsDefaultThread', false);
  },
  set gameForumsDefaultThread(value: boolean) {
    GM_setValue('gameForumsDefaultThread', value);
  },
  get gameForumsDefaultThreadValue(): string {
    return GM_getValue('gameForumsDefaultThreadValue', 'all');
  },
  set gameForumsDefaultThreadValue(value: string) {
    GM_setValue('gameForumsDefaultThreadValue', value);
  }
};

export const gamesImprovements = {
  get enabled(): boolean {
    return GM_getValue('gamesImprovements-enabled', false);
  },
  set enabled(value: boolean) {
    GM_setValue('gamesImprovements-enabled', value);
  },
  games,
  achievements: gameAchievements,
  challenges: gameChallenges,
  forums: gameForums,
  clips: gameClips,
  dlc: gameDLC
};

export const achievements = {
  get addGroupByGameButton(): boolean {
    return GM_getValue('addGroupByGameButton-enabled', false);
  },
  set addGroupByGameButton(value: boolean) {
    GM_setValue('addGroupByGameButton-enabled', value);
  }
};

export const gamerImprovements = {
  get enabled(): boolean {
    return GM_getValue('gamerImprovements-enabled', false);
  },
  set enabled(value: boolean) {
    GM_setValue('gamerImprovements-enabled', value);
  },
  achievements
};

export const config = {
  stickyHeader,
  emojis,
  staffWalkthroughImprovements,
  forumImprovements,
  newsImprovements,
  gamesImprovements,
  gamerImprovements
};

const migrateGet = <T>(oldSetting: string, newSetting: string, defaultValue: T): T => {
  const newValue = GM_getValue(newSetting);

  if (newValue !== undefined) return newValue as T;

  const oldValue = GM_getValue(oldSetting, defaultValue);
  GM_setValue(newSetting, oldValue);
  GM_deleteValue(oldSetting);

  return oldValue;
};

export const stickyHeader = {
  get enabled(): boolean { return migrateGet('trueachievements-extra-stickyHeader-enabled', 'stickyHeader-enabled', false); },
  set enabled(value: boolean) { GM_setValue('stickyHeader-enabled', value); },
  get remainStuck(): boolean { return GM_getValue('stickyHeader-remainStuck', false); },
  set remainStuck(value: boolean) { GM_setValue('stickyHeader-remainStuck', value); }
};

export const editWalkthrough = {
  get improvedImageSelector(): boolean { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-improvedImageSelector', 'improvedImageSelector', false); },
  set improvedImageSelector(value: boolean) { GM_setValue('improvedImageSelector', value); },
  get autoSaveNotification(): boolean { return GM_getValue('autoSaveNotification', false); },
  set autoSaveNotification(value: boolean) { GM_setValue('autoSaveNotification', value); },
  get tinymceTheme(): string { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-tinymceTheme', 'tinymceTheme', null); },
  set tinymceTheme(value: string) { GM_setValue('tinymceTheme', value); }
};

export const manageWalkthrough = {
  get manageWalkthroughDefaultStatus(): boolean { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatus', 'manageWalkthroughDefaultStatus', false); },
  set manageWalkthroughDefaultStatus(value: boolean) { GM_setValue('manageWalkthroughDefaultStatus', value); },
  get clickableTableLinks(): boolean { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-clickableTableLinks', 'clickableTableLinks', false); },
  set clickableTableLinks(value: boolean) { GM_setValue('clickableTableLinks', value); },
  get addMissingButtons(): boolean { return GM_getValue('addMissingButtons', false); },
  set addMissingButtons(value: boolean) { GM_setValue('addMissingButtons', value); },
  get autoSelectFirst(): boolean { return GM_getValue('autoSelectFirst', false); },
  set autoSelectFirst(value: boolean) { GM_setValue('autoSelectFirst', value); },
  get manageWalkthroughDefaultStatusValue(): string { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatusValue', 'manageWalkthroughDefaultStatusValue', '-1'); },
  set manageWalkthroughDefaultStatusValue(value: string) { GM_setValue('manageWalkthroughDefaultStatusValue', value); }
};

export const walkthroughPage = {
  get stickyPageHistory(): boolean { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory', 'stickyPageHistory', false); },
  set stickyPageHistory(value: boolean) { GM_setValue('stickyPageHistory', value); },
  get moveButtonsToLeft(): boolean { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-editPageLeft', 'moveButtonsToLeft', false); },
  set moveButtonsToLeft(value: boolean) { GM_setValue('moveButtonsToLeft', value); },
  get walkthroughTeamButton(): boolean { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton', 'walkthroughTeamButton', false); },
  set walkthroughTeamButton(value: boolean) { GM_setValue('walkthroughTeamButton', value); },
  get highlightPageLocked(): boolean { return GM_getValue('highlightPageLocked', false); },
  set highlightPageLocked(value: boolean) { GM_setValue('highlightPageLocked', value); }
};

export const walkthroughPreview = {
  get populateAsideContent(): boolean { return GM_getValue('populateAsideContent', false); },
  set populateAsideContent(value: boolean) { GM_setValue('populateAsideContent', value); }
};

export const staffWalkthroughImprovements = {
  get enabled(): boolean { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-enabled','staffWalkthroughImprovements-enabled',  false); },
  set enabled(value: boolean) { GM_setValue('staffWalkthroughImprovements-enabled', value); },
  editWalkthrough,
  manageWalkthrough,
  walkthroughPage,
  walkthroughPreview
};

export const walkthroughs = {
  get showOwnerProgress(): boolean { return GM_getValue('showOwnerProgress', false); },
  set showOwnerProgress(value: boolean) { GM_setValue('showOwnerProgress', value); }
};

export const forumImprovements = {
  get enabled(): boolean { return GM_getValue('forumImprovements-enabled', false); },
  set enabled(value: boolean) { GM_setValue('forumImprovements-enabled', value); },
  walkthroughs
};

export const sales = {
  get autoSortBy(): boolean { return GM_getValue('autoSortBy', false); },
  set autoSortBy(value: boolean) { GM_setValue('autoSortBy', value); },
  get autoSortByValue(): string[] { 
    const value = GM_getValue('autoSortByValue', '') as string;
    return value.length !== 0 ? JSON.parse(value) : [ 'product', 'game' ];
  },
  set autoSortByValue(value: string[]) { GM_setValue('autoSortByValue', JSON.stringify(value)); },
  get autoSortByOrder(): string { return GM_getValue('autoSortByOrder', 'asc'); },
  set autoSortByOrder(value: string) { GM_setValue('autoSortByOrder', value); }
};

export const newsImprovements = {
  get enabled(): boolean { return GM_getValue('newsImprovements-enabled', false); },
  set enabled(value: boolean) { GM_setValue('newsImprovements-enabled', value); },
  sales
};

export const games = {
  get addHighlightGamesNotInCollectionButton(): boolean { return GM_getValue('addHighlightGamesNotInCollectionButton-enabled', false); },
  set addHighlightGamesNotInCollectionButton(value: boolean) { GM_setValue('addHighlightGamesNotInCollectionButton-enabled', value); }
};

export const gameAchievements = {
  get gameAchievementsDefaultStatus(): boolean { return GM_getValue('gameAchievementsDefaultStatus', false); },
  set gameAchievementsDefaultStatus(value: boolean) { GM_setValue('gameAchievementsDefaultStatus', value); },
  get gameAchievementsDefaultStatusValue(): string { return GM_getValue('gameAchievementsDefaultStatusValue', 'rdoAllAchievements'); },
  set gameAchievementsDefaultStatusValue(value: string) { GM_setValue('gameAchievementsDefaultStatusValue', value); }
};

export const gameClips = {
  get gameClipsDefaultStatus(): boolean { return GM_getValue('gameClipsDefaultStatus', false); },
  set gameClipsDefaultStatus(value: boolean) { GM_setValue('gameClipsDefaultStatus', value); },
  get gameClipsDefaultRecordedByValue(): string { return GM_getValue('gameClipsDefaultRecordedByValue', ''); },
  set gameClipsDefaultRecordedByValue(value: string) { GM_setValue('gameClipsDefaultRecordedByValue', value); },
  get gameClipsDefaultSavedByValue(): string { return GM_getValue('gameClipsDefaultSavedByValue', 'Gamer'); },
  set gameClipsDefaultSavedByValue(value: string) { GM_setValue('gameClipsDefaultSavedByValue', value); },
  get gameClipsDefaultRecordedValue(): string { return GM_getValue('gameClipsDefaultRecordedValue', '7'); },
  set gameClipsDefaultRecordedValue(value: string) { GM_setValue('gameClipsDefaultRecordedValue', value); },
  get gameClipsDefaultSortByValue(): string { return GM_getValue('gameClipsDefaultSortByValue', 'Most viewed'); },
  set gameClipsDefaultSortByValue(value: string) { GM_setValue('gameClipsDefaultSortByValue', value); }
};

export const gamesImprovements = {
  get enabled(): boolean { return GM_getValue('gamesImprovements-enabled', false); },
  set enabled(value: boolean) { GM_setValue('gamesImprovements-enabled', value); },
  games,
  achievements: gameAchievements,
  clips: gameClips
};

export const achievements = {
  get addGroupByGameButton(): boolean { return GM_getValue('addGroupByGameButton-enabled', false); },
  set addGroupByGameButton(value: boolean) { GM_setValue('addGroupByGameButton-enabled', value); }
};

export const gamerImprovements = {
  get enabled(): boolean { return GM_getValue('gamerImprovements-enabled', false); },
  set enabled(value: boolean) { GM_setValue('gamerImprovements-enabled', value); },
  achievements
};

export const config = {
  stickyHeader,
  staffWalkthroughImprovements,
  forumImprovements,
  newsImprovements,
  gamesImprovements,
  gamerImprovements
};
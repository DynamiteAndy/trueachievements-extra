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
  set enabled(value: boolean) { GM_setValue('stickyHeader-enabled', value); }
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

export const staffWalkthroughImprovements = {
  get enabled(): boolean { return migrateGet('trueachievements-extra-staffWalkthroughImprovements-enabled','staffWalkthroughImprovements-enabled',  false); },
  set enabled(value: boolean) { GM_setValue('staffWalkthroughImprovements-enabled', value); },
  editWalkthrough,
  manageWalkthrough,
  walkthroughPage
};

export const config = {
  stickyHeader,
  staffWalkthroughImprovements
};
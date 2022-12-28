export default {
  stickyHeader: {
    get enabled(): boolean { return GM_getValue('trueachievements-extra-stickyHeader-enabled', false); },
    set enabled(value: boolean) { GM_setValue('trueachievements-extra-stickyHeader-enabled', value); }
  },
  recentWinners: {
    get enabled(): boolean { return GM_getValue('trueachievements-extra-recentWinners-enabled', false); },
    set enabled(value: boolean) { GM_setValue('trueachievements-extra-recentWinners-enabled', value); },
    get onlineUnlocksOnly(): boolean { return this.enabled && GM_getValue('trueachievements-extra-recentWinners-onlineUnlocksOnly', false); },
    set onlineUnlocksOnly(value: boolean) { GM_setValue('trueachievements-extra-recentWinners-onlineUnlocksOnly', value); },
    get baseGameOnly(): boolean { return this.enabled && GM_getValue('trueachievements-extra-recentWinners-baseGameOnly', false); },
    set baseGameOnly(value: boolean) { GM_setValue('trueachievements-extra-recentWinners-baseGameOnly', value); }
  },
  staffWalkthroughImprovements: {
    get enabled(): boolean { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-enabled', false); },
    set enabled(value: boolean) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-enabled', value); },
    get stickyPageHistory(): boolean { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory', false); },
    set stickyPageHistory(value: boolean) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory', value); },
    get editPageLeft(): boolean { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-editPageLeft', false); },
    set editPageLeft(value: boolean) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-editPageLeft', value); },
    get walkthroughTeamButton(): boolean { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton', false); },
    set walkthroughTeamButton(value: boolean) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton', value); },
    get manageWalkthroughDefaultStatus(): boolean { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatus', false); },
    set manageWalkthroughDefaultStatus(value: boolean) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatus', value); },
    get improvedImageSelector(): boolean { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-improvedImageSelector', false); },
    set improvedImageSelector(value: boolean) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-improvedImageSelector', value); },
    get clickableTableLinks(): boolean { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-clickableTableLinks', false); },
    set clickableTableLinks(value: boolean) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-clickableTableLinks', value); },
    get manageWalkthroughDefaultStatusValue(): string { return GM_getValue('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatusValue', '-1'); },
    set manageWalkthroughDefaultStatusValue(value: string) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatusValue', value); }
  }
};
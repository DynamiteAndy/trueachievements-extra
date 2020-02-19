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
    set walkthroughTeamButton(value: boolean) { GM_setValue('trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton', value); }
  }
};
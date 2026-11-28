// The script's entry: on a guide site it reads the guides from the page; on TrueAchievements it starts everything at
// once (the maintenance task, the toast, the stylesheet, the settings menu and each feature group), and each waits for
// the part of the page it needs. Dev builds run src/dev first (Preact's debug warnings and DevTools, debug logging).
// Only one copy of the script runs on a page (claim-page.ts): a later one stands down.

import {
  settingsMenu,
  allPages,
  staffWalkthrough,
  forum,
  news,
  game,
  gamesList,
  gamer,
  readGuidePage,
  isGuideSite
} from '@ta-x-features';
import { allConcurrently } from '@ta-x-lib';
import { stylesheet, toast } from '@ta-x-ui';

import { claimPage, isDevScript, warnDevStoodDown } from './claim-page';
import { forgetLastGamer, maintenance } from './maintenance';

if (!claimPage()) {
  // Another copy runs on this page
  if (isDevScript() && !isGuideSite()) {
    void warnDevStoodDown();
  }
} else if (isGuideSite()) {
  // On a guide site (matched only for its guide pages), just read the guides from the page the user is on
  void allConcurrently('Guide Site', [{ name: 'guide-site:read-guide-page', task: readGuidePage }]);
} else {
  // Nothing here waits for anything else: a failing task is logged and the rest carry on
  const start = (): void => {
    void allConcurrently<unknown>('Start-up', [
      { name: 'maintenance', task: maintenance },
      { name: 'component:toast', task: toast },
      { name: 'component:stylesheet', task: stylesheet },
      { name: 'feature:settings-menu', task: settingsMenu },
      { name: 'feature:all-pages', task: allPages },
      { name: 'feature:staff:walkthrough', task: staffWalkthrough },
      { name: 'feature:forum', task: forum },
      { name: 'feature:news', task: news },
      { name: 'feature:game', task: game },
      { name: 'feature:games-list', task: gamesList },
      { name: 'feature:gamer', task: gamer }
    ]);
  };

  // A different gamer signed in from the one the cache holds pages for: those go before anything reads one
  const forgetting = forgetLastGamer();
  if (forgetting) {
    void forgetting.finally(start);
  } else {
    start();
  }
}

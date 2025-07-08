// Phase 0 migration to Lit is in progress — see
// TrueAchievements_Extra__Migration_to_Lit___Plan. Everything below is
// commented out and will be uncommented feature-by-feature as each is
// migrated (Phase 2). Nothing here needs to move to Lit itself; only the
// ajax-interceptor replacement (this file's only active code) is Phase 0
// work.

import { Cache, clearLegacy } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { accordion, snackbar, tabs, hideableRow } from '@ta-x-components';
import { Styles } from '@ta-x-features';
import {
  SettingsMenu,
  MiscellaneousImprovements,
  StaffWalkthroughImprovements,
  ForumImprovements,
  NewsImprovements,
  GamesImprovements,
  GamerImprovements
} from '@ta-x-features';
import { httpIntercept } from '@ta-x-services';

httpIntercept.start();

(async () => {
  await allConcurrently('Component Initialization', [
    { name: 'component:snackbar', task: snackbar },
    { name: 'component:accordion', task: accordion },
    { name: 'component:tabs', task: tabs },
    { name: 'component:hideable-row', task: hideableRow }
  ]);

  await allConcurrently(
    'Feature Initialization',
    [
      { name: 'feature:styles', task: Styles },
      { name: 'feature:settings-menu', task: SettingsMenu },
      { name: 'feature:miscellaneous-improvements', task: MiscellaneousImprovements },
      { name: 'feature:staff-walkthrough-improvements', task: StaffWalkthroughImprovements },
      { name: 'feature:forum-improvements', task: ForumImprovements },
      { name: 'feature:news-improvements', task: NewsImprovements },
      { name: 'feature:games-improvements', task: GamesImprovements },
      { name: 'feature:gamer-improvements', task: GamerImprovements }
    ],
    4
  );

  await allConcurrently('Cache Initialization', [
    { name: 'cache:expired', task: Cache.clearExpired.bind(Cache) },
    { name: 'cache:legacy', task: Cache.clearLegacy.bind(Cache) }
  ]);

  await allConcurrently('Config Initialization', [{ name: 'config:legacy', task: clearLegacy }]);
})();

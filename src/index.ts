import { default as ajaxInterceptor } from 'ajax-interceptor';
import { Cache } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { accordion, pubSub, snackbar, tabs } from '@ta-x-components';
import { SettingsMenu, StickyHeader, Emojis,
  StaffWalkthroughImprovements, Styles,
  ForumImprovements, NewsImprovements,
  GamesImprovements, GamerImprovements} from '@ta-x-features';

ajaxInterceptor.addRequestCallback((xhr: XMLHttpRequest) => pubSub.publish('ajaxIntercept:request', xhr ));
ajaxInterceptor.addResponseCallback((xhr: XMLHttpRequest) => pubSub.publish('ajaxIntercept:response', xhr));
ajaxInterceptor.wire();

(async () => {
  allConcurrently('Components', [
    { name: 'component:snackbar', task: snackbar },
    { name: 'component:accordion', task: accordion },
    { name: 'component:tabs', task: tabs }
  ]);
  
  allConcurrently('Features', [
    { name: 'feature:styles', task: Styles },
    { name: 'feature:settings-menu', task: SettingsMenu },
    { name: 'feature:sticky-header', task: StickyHeader },
    { name: 'feature:staff-walkthrough-improvements', task: StaffWalkthroughImprovements },
    { name: 'feature:forum-improvements', task: ForumImprovements },
    { name: 'feature:news-improvements', task: NewsImprovements },
    { name: 'feature:games-improvements', task: GamesImprovements },
    { name: 'feature:gamer-improvements', task: GamerImprovements },
    { name: 'feature:emojis', task: Emojis }
  ], 4);

  allConcurrently('Cache', [
    { name: 'cache:expired', task: Cache.clearExpired.bind(Cache) },
    { name: 'cache:legacy', task: Cache.clearLegacy.bind(Cache) }
  ]);
})();
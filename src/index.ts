import { default as ajaxInterceptor }  from 'ajax-interceptor';
import { Cache } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { accordion, pubSub, snackbar } from '@ta-x-components';
import { SettingsMenu, StickyHeader, StaffWalkthroughImprovements, Styles, ForumImprovements } from '@ta-x-features';

ajaxInterceptor.addRequestCallback((xhr: XMLHttpRequest) => pubSub.publish('ajaxIntercept:request', xhr ));
ajaxInterceptor.addResponseCallback((xhr: XMLHttpRequest) => pubSub.publish('ajaxIntercept:response', xhr));
ajaxInterceptor.wire();

(async () => {
  allConcurrently('Components', [
    { name: 'component:snackbar', task: snackbar },
    { name: 'component:accordion', task: accordion }
  ]);
  
  allConcurrently('Features', [
    { name: 'feature:styles', task: Styles },
    { name: 'feature:settings-menu', task: SettingsMenu },
    { name: 'feature:sticky-header', task: StickyHeader },
    { name: 'feature:staff-walkthrough-improvements', task: StaffWalkthroughImprovements },
    { name: 'feature:forum-improvements', task: ForumImprovements }
  ], 4);

  Cache.clearExpired();
})();
import { default as ajaxInterceptor }  from 'ajax-interceptor';
import { Cache } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import { accordion, broadcast, snackbar } from '@ta-x-components';
import { SettingsMenu, StickyHeader, StaffWalkthroughImprovements, Styles } from '@ta-x-features';

ajaxInterceptor.addRequestCallback((xhr: XMLHttpRequest) => broadcast('ajaxIntercept:request', undefined, xhr ));
ajaxInterceptor.addResponseCallback((xhr: XMLHttpRequest) => broadcast('ajaxIntercept:response', undefined, xhr));
ajaxInterceptor.wire();

(async () => {
  allConcurrently('Components', [
    { name: 'component:snackbar', task: snackbar },
    { name: 'component:accordion', task: accordion }
  ], 3);
  
  allConcurrently('Features', [
    { name: 'feature:styles', task: Styles },
    { name: 'feature:settings-menu', task: SettingsMenu },
    { name: 'feature:sticky-header', task: StickyHeader },
    { name: 'feature:staff-walkthrough-improvements', task: StaffWalkthroughImprovements }
  ], 4);

  Cache.clearExpired();
})();
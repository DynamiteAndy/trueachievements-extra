/* eslint-disable @typescript-eslint/no-var-requires */
// const ajaxInterceptor = require('ajax-interceptor');
// import { broadcast } from './scripts/components/events';

import { allConcurrently } from './scripts/components/promise';

// ajaxInterceptor.addRequestCallback((xhr: any) => broadcast('ajaxIntercept:request', undefined, { detail: xhr }));
// ajaxInterceptor.addResponseCallback((xhr: any) => broadcast('ajaxIntercept:response', undefined, { detail: xhr }));
// ajaxInterceptor.wire();

(async () => {
  const styles = require('./styles/index');
  const settings = require('./scripts/settings-menu');
  const stickyHeader = require('./scripts/sticky-header');
  const staffWalkthroughImprovements = require('./scripts/staff-walkthrough-improvements');

  await styles.apply();
  allConcurrently(3, [settings.render, stickyHeader.render, staffWalkthroughImprovements.render])
})();
/* eslint-disable @typescript-eslint/no-var-requires */
// const ajaxInterceptor = require('ajax-interceptor');
// import { broadcast } from './scripts/components/events';

import { log, LogLevel } from 'missionlog';
import { allConcurrently } from './scripts/components/promise';
import styles from './styles/index';
import settingsMenu from './scripts/settings-menu';
import stickyHeader from './scripts/sticky-header';
import staffWalkthroughImprovements from './scripts/staff-walkthrough-improvements/index';
import cache from './cache';

// handler which does the logging to the console or anything
const logger = {
  [LogLevel.ERROR]: (tag, msg, params) => console.error(`TA-X [${tag}]`, msg, ...params),
  [LogLevel.WARN]: (tag, msg, params) => console.warn(`TA-X [${tag}]`, msg, ...params),
  [LogLevel.INFO]: (tag, msg, params) => console.log(`TA-X [${tag}]`, msg, ...params),
  [LogLevel.TRACE]: (tag, msg, params) => console.log(`TA-X [${tag}]`, msg, ...params),
  [LogLevel.DEBUG]: (tag, msg, params) => console.log(`TA-X [${tag}]`, msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

/**
 * initialize missionlog
 * @param config JSON which assigns tags levels. An uninitialized,
 *    tag's level defaults to DEBUG.
 * @param callback? handle logging whichever way works best for you
 */
log.init({ }, (level, tag, msg, params) => {
  logger[level as keyof typeof logger](tag, msg, params);
});

(async () => {
  cache.clearExpired();
  
  await allConcurrently(4, [
    styles,
    settingsMenu,
    stickyHeader,
    staffWalkthroughImprovements
  ]);
})();
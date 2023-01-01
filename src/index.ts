import { log, LogLevel } from 'missionlog';
import { Cache } from '@ta-x-globals';
import { allConcurrently } from './scripts/components/promise';
import styles from './styles/index';
import settingsMenu from './scripts/settings-menu';
import stickyHeader from './scripts/sticky-header';
import staffWalkthroughImprovements from './scripts/staff-walkthrough-improvements/index';

const logger = {
  [LogLevel.ERROR]: (tag, msg, params) => console.error(`TA-X [${tag}]`, msg, ...params),
  [LogLevel.WARN]: (tag, msg, params) => console.warn(`TA-X [${tag}]`, msg, ...params),
  [LogLevel.INFO]: (tag, msg, params) => console.log(`TA-X [${tag}]`, msg, ...params),
  [LogLevel.TRACE]: (tag, msg, params) => console.log(`TA-X [${tag}]`, msg, ...params),
  [LogLevel.DEBUG]: (tag, msg, params) => console.log(`TA-X [${tag}]`, msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

log.init({ }, (level, tag, msg, params) => {
  logger[level as keyof typeof logger](tag, msg, params);
});

(async () => {
  await allConcurrently(4, [
    styles,
    settingsMenu,
    stickyHeader,
    staffWalkthroughImprovements
  ]);

  Cache.clearExpired();
})();
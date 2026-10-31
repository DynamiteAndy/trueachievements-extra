// Dev builds only (the dev entry runs this before the script): every logger.debug reaches the console, including
// allConcurrently's task timings (Chrome shows them under the console's Verbose level)
import { LogLevel, logger } from '@ta-x-lib';

logger.setLevel(LogLevel.Debug);

import { LogLevel, logger } from './logger';

// Runs some work and, with debug logging on (dev builds), leaves how long it took on the performance timeline as a
// measure named `ta-x <name>`, so a live check can compare builds without adding a timer. The release build only runs
// it. Work that returns a promise is measured until it settles, so its waits (an IndexedDB read, say) are counted
export const timed = <T>(name: string, work: () => T): T => {
  if (logger.getLevel() !== LogLevel.Debug) {
    return work();
  }

  const start = performance.now();
  const measure = (): void => {
    performance.measure(`ta-x ${name}`, { start, end: performance.now() });
  };

  let result: T;
  try {
    result = work();
  } catch (error) {
    measure();
    throw error;
  }

  if (result instanceof Promise) {
    // The caller still gets the work's own promise, rejection and all
    void result.then(measure, measure);
  } else {
    measure();
  }

  return result;
};

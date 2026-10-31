import { LogLevel, logger } from './logger';

// Resolves in a later task, letting the page handle input and paint first. Long synchronous features started together
// (the list features once the page is parsed) each await it first, so they run as separate tasks, not one long one
export const yieldToPage = (): Promise<void> => new Promise((resolve) => setTimeout(resolve));

export interface TaskDefinition<T> {
  name: string;
  // Called with no arguments, so a function with optional parameters can be passed as it is
  task: () => T | Promise<T>;
}

// Runs every task, all at once unless `max` caps how many run together (e.g. pages fetched in a loop), and resolves
// with their results in order. A task that fails is logged and its result is undefined, so it can't stop the others
export const allConcurrently = async <T>(
  batchName: string,
  arr: TaskDefinition<T>[],
  max = arr.length
): Promise<(T | undefined)[]> => {
  if (arr.length === 0) {
    return [];
  }

  let index = 0;
  // Filled up front, so a failed task's slot reads undefined rather than being a hole
  const results = Array.from<T | undefined>({ length: arr.length });

  const threadCount = Math.max(1, Math.min(max, arr.length));
  logger.debug(batchName, `starting ${arr.length} task(s) with concurrency ${threadCount}`);
  const start = performance.now();

  const execThread = async (threadIndex: number) => {
    while (index < arr.length) {
      const curIndex = index++;
      const taskDefinition = arr[curIndex];
      const taskStart = performance.now();

      try {
        results[curIndex] = await taskDefinition.task();

        // With debug logging on (dev builds), a performance mark per task, to measure the start-up
        if (logger.getLevel() === LogLevel.Debug) {
          performance.mark(`ta-x ${batchName}: ${taskDefinition.name}`);
        }

        logger.debug(
          batchName,
          `[thread ${threadIndex}] ${taskDefinition.name} finished in ${Math.round(performance.now() - taskStart)}ms (at ${Math.round(performance.now())}ms)`
        );
      } catch (error) {
        // One failing task (a feature, say) mustn't stop the others, or the batches that run after this one
        logger.error(batchName, `[thread ${threadIndex}] ${taskDefinition.name} failed`, error);
      }
    }
  };

  const threads = Array.from({ length: threadCount }, (_, threadIndex) => execThread(threadIndex));

  await Promise.all(threads);

  logger.debug(batchName, `finished ${arr.length} task(s) in ${Math.round(performance.now() - start)}ms`);

  return results;
};

// Resolves true once `f` returns true (checked often), or false after `timeoutMs`
export const until = async (f: () => boolean, timeoutMs = 10000): Promise<boolean> => {
  return new Promise((resolve) => {
    const start = Date.now();

    const check = () => {
      try {
        if (f()) {
          return resolve(true);
        }
      } catch (error) {
        // Counts as not yet (the check may read what isn't there yet)
        logger.debug('until', 'check threw', error);
      }

      if (Date.now() - start > timeoutMs) {
        resolve(false);
      } else {
        setTimeout(check, 20);
      }
    };

    check();
  });
};

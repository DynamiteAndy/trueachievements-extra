import { logger } from '@ta-x-services';

export interface TaskDefinition<T> {
  name: string;
  task: (index?: number) => T | Promise<T>;
}

export const allSequentially = <T>(batchName: string, arr: TaskDefinition<T>[]): Promise<T[]> =>
  allConcurrently(batchName, arr, 1);

export const allConcurrently = async <T>(batchName: string, arr: TaskDefinition<T>[], max = 3): Promise<T[]> => {
  if (arr.length === 0) {
    return [];
  }

  let index = 0;
  const results: T[] = [];

  // Only spawn as many threads as there are items to prevent idle overhead
  const threadCount = Math.max(1, Math.min(max, arr.length));
  logger.debug(batchName, `starting ${arr.length} task(s) with concurrency ${threadCount}`);
  const start = performance.now();

  // Shared worker thread logic
  const execThread = async (threadIndex: number) => {
    while (index < arr.length) {
      const curIndex = index++;
      const taskDefinition = arr[curIndex];
      const taskStart = performance.now();

      try {
        results[curIndex] = await taskDefinition.task(curIndex);
        logger.debug(
          batchName,
          `[thread ${threadIndex}] ${taskDefinition.name} finished in ${Math.round(performance.now() - taskStart)}ms`
        );
      } catch (error) {
        logger.error(batchName, `[thread ${threadIndex}] ${taskDefinition.name} failed`, error);
        throw error;
      }
    }
  };

  const threads = Array.from({ length: threadCount }, (_, threadIndex) => execThread(threadIndex));

  await Promise.all(threads);

  logger.debug(batchName, `finished ${arr.length} task(s) in ${Math.round(performance.now() - start)}ms`);

  return results;
};

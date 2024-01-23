const promisify =
  <T>(fn: (...args: unknown[]) => T) =>
  async (...args: unknown[]) =>
    fn(args);

const needsPromisifying = (fn: () => unknown): boolean => fn.constructor.name === 'AsyncFunction';

export const allSequentially = async <T>(
  name: string,
  arr: { name: string; task: () => T | Promise<T> }[]
): Promise<T[]> => {
  const result: T[] = [];

  for (const { task } of arr) {
    const actualTask = needsPromisifying(task) ? promisify(task) : task;
    const taskResult = await actualTask();
    result.push(taskResult);
  }

  return result;
};

export const allConcurrently = async <T>(
  name: string,
  arr: { name: string; task: () => T | Promise<T> }[],
  max = 3
): Promise<T[]> => {
  if (arr.length === 0) {
    return Promise.resolve([]);
  }

  let index = 0;
  const results = [];

  // Run a pseudo-thread
  const execThread = async () => {
    while (index < arr.length) {
      const curIndex = index++;
      // Use of `curIndex` is important because `index` may change after await is resolved
      const task = needsPromisifying(arr[curIndex].task) ? promisify(arr[curIndex].task) : arr[curIndex].task;
      results[curIndex] = await task();
    }
  };

  // Start threads
  const threads = [];

  for (let thread = 0; thread < max; thread++) {
    threads.push(execThread());
  }

  await Promise.all(threads);

  return results;
};

type Callback<T> = (args: T) => void;

export const promisify =
  <T>(fn: (cb: Callback<T>) => void): (() => Promise<T>) =>
  () =>
    new Promise((resolve) => fn((callbackArgs) => resolve(callbackArgs)));

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
      const task =
        arr[curIndex].task.constructor.name === 'Function' ? promisify(arr[curIndex].task) : arr[curIndex].task;

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

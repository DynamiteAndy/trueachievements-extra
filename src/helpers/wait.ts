export const until = async (
  f: () => boolean,
  timeoutMs = 10000,
  intervalMs = 20,
  signal?: AbortSignal
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    let timer: ReturnType<typeof setTimeout>;

    const check = () => {
      if (signal?.aborted) {
        clearTimeout(timer);
        return reject(new Error('Until aborted'));
      }

      try {
        if (f()) return resolve(true);
      } catch (e) {
        // optionally log e
      }

      if (Date.now() - start > timeoutMs) {
        resolve(false);
      } else {
        timer = setTimeout(check, intervalMs);
      }
    };

    check();
  });
};

export const wait = (timeoutMs = 250, signal?: AbortSignal): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => resolve(), timeoutMs);

    if (signal) {
      if (signal.aborted) {
        clearTimeout(timer);
        return reject(new Error('Wait aborted'));
      }

      const onAbort = () => {
        clearTimeout(timer);
        reject(new Error('Wait aborted'));
      };

      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
};
export const allSequentially = (arr) => {
  let result = Promise.resolve();
  return Promise.all(
      arr.reduce((promise, task) => {
        result = result.then(() => (typeof task === 'function' ? task() : task));
        promise.push(result);
        return promise;
      }, [])
  );
};

export const allConcurrently = (max: number, arr) => {
  if (arr.length === 0) return Promise.resolve([]);

  const tail = arr.splice(max);
  const head = arr;
  const resolved = [];
  let processed = 0;

  return new Promise(resolve => {
    head.forEach(task => {
      const res = (typeof task === 'function' ? task() : task);
      resolved.push(res);
      res.then(y => {
        runNext();
        return y;
      });
    });

    const runNext = () => {
      if (processed === tail.length) {
        resolve(Promise.all(resolved));
      } else {
        if ('then' in tail[processed]) {
          resolved.push(tail[processed].then(x => {
            runNext();
            return x;
          }));
        } else {
          resolved.push(tail[processed]().then(x => {
            runNext();
            return x;
          }));
        }

        processed++;
      }
    };
  });
};

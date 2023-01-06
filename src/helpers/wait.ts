export const until = async (f: () => boolean, timeoutMs = 10000) => {
  return new Promise((resolve, reject) => {
    const timeWas = new Date();
    const wait = setInterval(function () {
      if (f()) {
        clearInterval(wait);
        resolve(true);
      } else if (+new Date() - +timeWas > timeoutMs) {
        clearInterval(wait);
        reject(false);
      }
    }, 20);
  });
};
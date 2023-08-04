export const until = async (f: () => boolean, timeoutMs = 10000) => {
  return new Promise((resolve) => {
    const timeWas = new Date();
    const wait = setInterval(() => {
      if (f()) {
        clearInterval(wait);
        resolve(true);
      } else if (+new Date() - +timeWas > timeoutMs) {
        clearInterval(wait);
        resolve(false);
      }
    }, 20);
  });
};

export const wait = async (timeoutMs = 250) => new Promise((resolve) => setTimeout(resolve, timeoutMs));

export const until = (predFn: () => any): Promise<any> => {
  const poll = (done: any) => (predFn() ? done() : setTimeout(() => poll(done), 250));
  return new Promise(poll);
};
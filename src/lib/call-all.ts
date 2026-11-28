// Calls each function in turn; `reverse` calls the last first, for undoing changes made in order
export const callAll = (fns: Iterable<() => unknown>, options?: { reverse?: boolean }): void => {
  const list = [...fns];
  if (options?.reverse) {
    list.reverse();
  }
  for (const fn of list) {
    fn();
  }
};

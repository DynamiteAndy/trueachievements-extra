export const getDuplicates = <T>(arr: T[], unique = false): T[] =>
  unique ? [...new Set(arr.filter((e, i, a) => a.indexOf(e) !== i))] : arr.filter((e, i, a) => a.indexOf(e) !== i);

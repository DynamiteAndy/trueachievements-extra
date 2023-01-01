export const getDuplicates = (arr: any[], unique = false): any[] => unique
  ? [...new Set(arr.filter((e, i, a) => a.indexOf(e) !== i))]
  : arr.filter((e, i, a) => a.indexOf(e) !== i);
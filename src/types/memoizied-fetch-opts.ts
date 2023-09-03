type DeleteAfter = {
  value: number;
  period: 'seconds' | 'minutes' | 'hours' | 'days';
};

export type MemoizedFetchOptions = {
  deleteAfter: DeleteAfter;
};

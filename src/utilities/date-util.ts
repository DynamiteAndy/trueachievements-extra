const getDate = (date: string | Date): Date => (typeof date === 'string' ? new Date(date) : date);

export const isValid = (date: string | Date): boolean =>
  date ? new Date(getDate(date)).toString().toLowerCase() !== 'invalid date' : false;

export const isAfterNow = (date: string | Date): boolean => {
  const now = new Date();
  const actualDate = getDate(date);

  return now < actualDate;
};

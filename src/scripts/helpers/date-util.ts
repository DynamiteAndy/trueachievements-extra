export const isValid = (date: string|Date): boolean => {
  const testDate = typeof(date) === 'string' ? new Date(date) : date;

  return new Date(testDate).toString().toLowerCase() !== 'invalid date';
}
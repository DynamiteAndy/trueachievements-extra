const getDate = (date: string|Date): Date => typeof(date) === 'string' ? new Date(date) : date;

export const isValid = (date: string|Date): boolean => new Date(getDate(date)).toString().toLowerCase() !== 'invalid date';

export const isBeforeNow = (date: string|Date): boolean => new Date() < getDate(date);
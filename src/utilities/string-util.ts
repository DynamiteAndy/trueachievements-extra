import regex from '../regex';
import { isValid } from './date-util';

const today = new Date(new Date().setHours(0, 0, 0, 0));
const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));

export const toInt = (value: string|boolean|number): number => {
  if (typeof(value) === 'string') {
    const parsedValue = parseInt(value.replace(/,/g, ''), 10);

    return !isNaN(parsedValue) ? parsedValue : null;
  }

  if (typeof(value) === 'boolean') {
    return value ? 1 : 0;
  }

  return typeof(value) === 'number'
    ? value
    : null;
};

export const toDate = (value: string): Date => {
  if (regex.words.today.test(value)) {
    return today;
  }

  if (regex.words.yesterday.test(value)) {
    return yesterday;
  }
  
  return isValid(value) ? new Date(value) : null;
};

export const toBool = (str: string|boolean|number): boolean => {
  if (typeof(str) === 'string') {
    return str.toLowerCase() === 'true'
      ? true
      : str.toLowerCase() === 'false'
        ? false
        : null;
  }

  if (typeof(str) === 'number') {
    return str === 1
      ? true
      : str === 0
        ? false
        : null;
  }

  return typeof(str) === 'boolean'
    ? str
    : null;
};

export default {
  toInt,
  toDate,
  toBool
};
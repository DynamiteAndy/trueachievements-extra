import { DatesRegex } from '../globals/regex';
import { isValid } from './date-util';

const today = new Date(new Date().setHours(0, 0, 0, 0));
const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));

export const toInt = (value: string|boolean|number): number => {
  if (value === null || value === undefined) return null;

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
  if (DatesRegex.today.test(value)) {
    return today;
  }

  if (DatesRegex.yesterday.test(value)) {
    return yesterday;
  }
  
  return isValid(value) ? new Date(value) : null;
};

export const toBool = (str: string|boolean|number): boolean => {
  if (str === null || str === undefined) return null;

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

export const extractBetween = (between: string, str: string): string => {
  const regex = new RegExp(`${between}(.*?)${between}`);
  const matches = str.match(regex);
  
  return matches
    ? matches[1]
    : str;
};

export const extractAllBetween = (between: string, str: string): string[] =>  {
  const regex = new RegExp(`${between}(.*?)${between}`, 'g');
  const matches = str.match(regex);
  
  return matches
    ? matches.map(str => str.replace(between, ''))
    : [str];
};

export const insertSeperator = (value: string | number, seperator = ','): string => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator);

export default {
  toInt,
  toDate,
  toBool,
  extractBetween,
  extractAllBetween,
  insertSeperator
};
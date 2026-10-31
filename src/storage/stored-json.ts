import { logger } from '@ta-x-lib';

// A value kept in Tampermonkey storage as JSON, parsed; undefined when it isn't stored (missing or empty), or can't be
// read (not JSON: edited by hand, or cut off). A bad value is logged and read as missing, so it can't stop the script
// while the settings load
export const parseStoredJson = (key: string, stored: unknown): unknown => {
  if (typeof stored !== 'string' || stored.length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(stored) as unknown;
  } catch (error) {
    logger.warn('storage', `"${key}" isn't valid JSON, so its default is used`, error);
    return undefined;
  }
};

// Reads a map saved as JSON `[key, value]` entries (as stored() maps keep them), or null if the key isn't stored or
// isn't a list of entries. Either kind of bad value is logged
export const readEntries = (key: string, stored: unknown): [string, unknown][] | null => {
  const value = parseStoredJson(key, stored);

  if (Array.isArray(value) && value.every((entry) => Array.isArray(entry) && typeof entry[0] === 'string')) {
    return value as [string, unknown][];
  }

  if (value !== undefined) {
    logger.warn('storage', `"${key}" isn't a list of entries, so it's read as empty`);
  }

  return null;
};

import { isBeforeNow } from './scripts/helpers/date-util';
import { MemoizedFetch } from './scripts/models/memoized-fetch';

const cache = {
  get memoize(): Map<string, MemoizedFetch> { 
    const value = GM_getValue('trueachievements-extra-memoized', '') as string;
    return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
  },
  set memoize(value: Map<string, MemoizedFetch>) { GM_setValue('trueachievements-extra-memoized', JSON.stringify(Array.from(value.entries()))); },
  forceClear: () => {
    GM_deleteValue('trueachievements-extra-memoized');
  },
  clearExpired: null
};

const clearExpired = () => {
  const updatedCache = Array.from(cache.memoize.entries()).filter(item => isBeforeNow(item[1].expiryTime));
  cache.memoize = new Map(updatedCache);
};

cache.clearExpired = clearExpired;

export default cache;
import { MemoizedFetch } from './scripts/models/memoized-fetch';

export default {
  get memoize(): Map<string, MemoizedFetch> { 
    const value = GM_getValue('trueachievements-extra-memoized', '') as string;
    return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
  },
  set memoize(value: Map<string, MemoizedFetch>) { GM_setValue('trueachievements-extra-memoized', JSON.stringify(Array.from(value.entries()))); },
  clear: () => {
    GM_deleteValue('trueachievements-extra-memoized');
  }
};
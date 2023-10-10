import { MemoizeFetch } from '../models/memoize-fetch';
import corsFetch from './cors-fetch';

const memoize = new MemoizeFetch(corsFetch);
export const memoizeCorsFetch = memoize.memoizeFetch;
export const deleteMemoizedCorsFetch = memoize.deleteMemoizedFetch;

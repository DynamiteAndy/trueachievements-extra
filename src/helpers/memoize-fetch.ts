import { MemoizeFetch } from '../models/memoize-fetch';
import fetch from './fetch';

const memoize = new MemoizeFetch(fetch);
export const memoizeFetch = memoize.memoizeFetch;
export const updateMemoizedFetch = memoize.updateMemoizedFetch;

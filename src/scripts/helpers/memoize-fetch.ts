import { Cache } from '@ta-x-globals';
import { MemoizedFetch, MemoizedFetchOpts } from '../models/memoized-fetch';
import { fetchHelper } from './fetch';
import { isBeforeNow } from './date-util';

const cachedCalls: Map<string, MemoizedFetch> = Cache.memoize;

export default async(url: string, fetchOpts = {}, memoizeOpts: MemoizedFetchOpts = { deleteAfter: { value: 7, period: 'days' } }): Promise<string> => {
  const cachedRequest = cachedCalls.get(url);

  if (cachedRequest && isBeforeNow(new Date(cachedRequest.expiryTime))) {
    return cachedRequest.response;
  }

  const response = await fetchHelper(url, fetchOpts);
  const body = await response.text();

  cachedCalls.set(url, new MemoizedFetch(memoizeOpts).setResponse(body));
  Cache.memoize = cachedCalls;
  return body;
};

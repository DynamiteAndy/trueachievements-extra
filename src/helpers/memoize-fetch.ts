import { Cache } from '../globals';
import { MemoizedFetch, MemoizedFetchOpts } from '../models/memoized-fetch';
import { isBeforeNow } from '../utilities/date-util';
import fetch from './fetch';

const cachedCalls: Map<string, MemoizedFetch> = Cache.memoize;

export const memoizeFetch = async(url: string, fetchOpts = {}, memoizeOpts: MemoizedFetchOpts = { deleteAfter: { value: 7, period: 'days' } }): Promise<string> => {
  const cachedRequest = cachedCalls.get(url);

  if (cachedRequest && isBeforeNow(new Date(cachedRequest.expiryTime))) {
    return cachedRequest.response;
  }

  const response = await fetch(url, fetchOpts);
  const body = await response.text();

  cachedCalls.set(url, new MemoizedFetch(memoizeOpts).setResponse(body));
  Cache.memoize = cachedCalls;
  return body;
};

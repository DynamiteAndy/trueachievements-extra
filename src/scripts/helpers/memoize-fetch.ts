import { MemoizedFetch, MemoizedFetchOpts } from '../models/memoized-fetch';
import { fetchHelper } from './fetch';
import cache from '../../cache'

const cachedCalls: Map<string, MemoizedFetch> = cache.memoize;

export default async(url: string, fetchOpts = {}, memoizeOpts: MemoizedFetchOpts = { deleteAfter: { value: 24, period: 'hours' } }): Promise<string> => {
  const cachedRequest = cachedCalls.get(url);

  if (cachedRequest && (new Date() < new Date(cachedRequest.expiryTime))) {
    return cachedRequest.response;
  }

  const response = await fetchHelper(url, fetchOpts);
  const body = await response.text();

  cachedCalls.set(url, new MemoizedFetch(memoizeOpts).setResponse(body));
  cache.memoize = cachedCalls;
  return body;
};

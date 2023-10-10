import { Cache } from '@ta-x-globals';
import { MemoizedFetchOptions } from '@ta-x-types';
import { isBeforeNow } from '../utilities/date-util';
import { MemoizedFetch } from './memoized-fetch';

export class MemoizeFetch {
  private cachedCalls: Map<string, MemoizedFetch> = Cache.memoize;
  private fetch: (
    url: string,
    options: RequestInit | Tampermonkey.Request<unknown>
  ) => Promise<Response> | Promise<Tampermonkey.Response<unknown>>;

  constructor(
    _fetch: (
      url: string,
      options: RequestInit | Tampermonkey.Request<unknown>
    ) => Promise<Response> | Promise<Tampermonkey.Response<unknown>>
  ) {
    this.fetch = _fetch;
  }

  memoizeFetch = async (
    url: string,
    fetchOpts?: RequestInit | Tampermonkey.Request<unknown>,
    memoizeOptions?: MemoizedFetchOptions
  ): Promise<string> => {
    const cachedRequest = this.cachedCalls.get(url);

    if (cachedRequest && isBeforeNow(new Date(cachedRequest.expiryTime))) {
      return cachedRequest.response;
    }

    const response = await this.fetch(url, fetchOpts);
    const body =
      response instanceof Response
        ? await (response as Response).text()
        : (response as Tampermonkey.Response<unknown>).responseText;

    this.cachedCalls.set(url, new MemoizedFetch(memoizeOptions).setResponse(body));
    Cache.memoize = this.cachedCalls;
    return body;
  };

  updateMemoizedFetch = (url: string, body: string, memoizeOptions?: MemoizedFetchOptions) => {
    this.cachedCalls.set(url, new MemoizedFetch(memoizeOptions).setResponse(body));
    Cache.memoize = this.cachedCalls;
  };

  deleteMemoizedFetch = (url: string) => {
    this.cachedCalls.delete(url);
    Cache.memoize = this.cachedCalls;
  };
}

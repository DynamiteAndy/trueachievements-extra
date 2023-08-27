import { MemoizedFetchOptions } from '@ta-x-types';
import { deleteMemoizedFetch, memoizeFetch } from './memoize-fetch';

const getProxiedUrl = (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

export const memoizedCorsFetch = async (
  url: string,
  fetchOpts = {},
  memoizeOptions?: MemoizedFetchOptions
): Promise<string> => await memoizeFetch(getProxiedUrl(url), fetchOpts, memoizeOptions);

export const deleteMemoizedCorsFetch = (url: string) => deleteMemoizedFetch(getProxiedUrl(url));

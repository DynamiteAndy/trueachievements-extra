import { setLocalStorage } from '@ta-x-test';
import { MemoizedFetch } from '@ta-x-models';
import { Cache } from './cache';

describe('memoize', () => {
  describe('get', () => {
    test.concurrent.each([
      { cachedValues: new Map<string, MemoizedFetch>(), expected: undefined },
      {
        cachedValues: new Map([['memoized', JSON.stringify([['key1', 'value1']])]]),
        input: 'key1',
        expected: 'value1'
      },
      {
        cachedValues: new Map([
          [
            'memoized',
            JSON.stringify([
              ['key1', 'value1'],
              ['key2', 'value2']
            ])
          ]
        ]),
        input: 'key2',
        expected: 'value2'
      }
    ])('should return the cached value $expected when getting $input', ({ cachedValues, input, expected }) => {
      setLocalStorage(cachedValues);
      expect(Cache.memoize.get(input)).toEqual(expected);
    });
  });

  describe('set', () => {
    test.concurrent.each([
      { input: new Map<string, MemoizedFetch>(), expected: 0 },
      {
        input: new Map([['key1', new MemoizedFetch()]]),
        expected: 1
      },
      {
        input: new Map([
          ['key1', new MemoizedFetch()],
          ['key2', new MemoizedFetch()]
        ]),
        expected: 2
      }
    ])('should set cached items', ({ input, expected }) => {
      Cache.memoize = input;
      expect(Cache.memoize.size).toEqual(expected);
    });
  });
});

describe('forceclear', () => {
  test.each([
    { input: new Map<string, MemoizedFetch>(), expected: 0 },
    {
      input: new Map([['key1', new MemoizedFetch()]]),
      expected: 0
    },
    {
      input: new Map([
        ['key1', new MemoizedFetch()],
        ['key2', new MemoizedFetch()]
      ]),
      expected: 0
    }
  ])('should clear cached items', ({ input, expected }) => {
    setLocalStorage(input);

    Cache.forceClear();

    expect(Cache.memoize.size).toEqual(expected);
  });
});
